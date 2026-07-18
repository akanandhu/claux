import type { ParsedDocument, SourceSpan } from "../../schemas/contract.ts";
import { parsedDocumentSchema } from "../../schemas/contract.ts";
import { IngestionError } from "./errors.ts";
import { findLineNumber, normalizeContractText } from "./text.ts";
import {
  type SupportedFileType,
  validateContractLikeText,
  validateUploadFile,
} from "./validation.ts";

type TextItem = {
  str?: string;
};

type PdfPage = {
  getTextContent: () => Promise<{ items: TextItem[] }>;
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

type PdfJsModule = {
  GlobalWorkerOptions?: {
    workerSrc: string;
  };
  getDocument: (input: {
    data: Uint8Array<ArrayBuffer>;
    useWorkerFetch: false;
  }) => {
    promise: Promise<PdfDocument>;
  };
};

type PdfJsLoader = () => Promise<PdfJsModule>;

type MammothBrowserModule = {
  default?: {
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  extractRawText?: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
};

export async function extractContractDocument(file: File): Promise<ParsedDocument> {
  const fileType = validateUploadFile(file);
  const document =
    fileType === "pdf"
      ? await extractPdfDocument(file, fileType)
      : fileType === "docx"
        ? await extractDocxDocument(file, fileType)
        : await extractTxtDocument(file, fileType);

  validateContractLikeText(document.rawText);

  return parsedDocumentSchema.parse(document);
}

export async function extractTxtDocument(
  file: File,
  fileType: SupportedFileType = "txt",
): Promise<ParsedDocument> {
  const rawText = await file.text();

  if (!rawText.trim()) {
    throw new IngestionError("The text file did not contain readable text.", "empty_file");
  }

  return buildParsedDocument({
    fileName: file.name,
    fileSize: file.size,
    fileType,
    pageTexts: [rawText],
    spanMode: "line",
  });
}

export async function extractDocxDocument(
  file: File,
  fileType: SupportedFileType = "docx",
): Promise<ParsedDocument> {
  try {
    const mammothModule = (await import("mammoth/mammoth.browser.js")) as MammothBrowserModule;
    const extractRawText =
      mammothModule.extractRawText ?? mammothModule.default?.extractRawText;

    if (!extractRawText) {
      throw new Error("mammoth extractRawText is unavailable");
    }

    const result = await extractRawText({ arrayBuffer: await file.arrayBuffer() });

    if (!result.value.trim()) {
      throw new IngestionError("The DOCX did not contain readable text.", "empty_file");
    }

    return buildParsedDocument({
      fileName: file.name,
      fileSize: file.size,
      fileType,
      pageTexts: [result.value],
      spanMode: "paragraph",
    });
  } catch (error) {
    if (error instanceof IngestionError) throw error;
    throw new IngestionError("The DOCX could not be read.", "corrupt_file");
  }
}

export async function extractPdfDocument(
  file: File,
  fileType: SupportedFileType = "pdf",
): Promise<ParsedDocument> {
  return extractPdfDocumentWithLoader(file, fileType, loadPdfJs);
}

export async function extractPdfDocumentWithLoader(
  file: File,
  fileType: SupportedFileType,
  loadPdfJs: PdfJsLoader,
): Promise<ParsedDocument> {
  try {
    const pdfjs = await loadPdfJs();
    configurePdfWorker(pdfjs);
    const data = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjs.getDocument({
      data,
      useWorkerFetch: false,
    });
    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => (item as TextItem).str ?? "")
        .filter(Boolean)
        .join(" ");

      pageTexts.push(text);
    }

    if (!pageTexts.join(" ").trim()) {
      throw new IngestionError(
        "This PDF has no readable text layer. OCR is outside this MVP build.",
        "scanned_pdf",
      );
    }

    return buildParsedDocument({
      fileName: file.name,
      fileSize: file.size,
      fileType,
      pageTexts,
      spanMode: "page",
    });
  } catch (error) {
    if (error instanceof IngestionError) throw error;

    if (isEncryptedPdfError(error)) {
      throw new IngestionError(
        "Encrypted or password-protected PDFs are not supported in this MVP.",
        "encrypted_pdf",
      );
    }

    throw new IngestionError(
      "The PDF could not be read. It may be corrupt or use unsupported PDF features.",
      "corrupt_file",
    );
  }
}

async function loadPdfJs(): Promise<PdfJsModule> {
  return (await import("pdfjs-dist")) as PdfJsModule;
}

function configurePdfWorker(pdfjs: PdfJsModule) {
  if (!pdfjs.GlobalWorkerOptions) return;

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();
}

function isEncryptedPdfError(error: unknown) {
  const message =
    error instanceof Error ? `${error.name} ${error.message}`.toLowerCase() : "";

  return (
    message.includes("password") ||
    message.includes("encrypted") ||
    message.includes("needpassword") ||
    message.includes("incorrectpassword")
  );
}

function buildParsedDocument({
  fileName,
  fileSize,
  fileType,
  pageTexts,
  spanMode,
}: {
  fileName: string;
  fileSize: number;
  fileType: SupportedFileType;
  pageTexts: string[];
  spanMode: "line" | "page" | "paragraph";
}): ParsedDocument {
  const pages = [];
  const sourceSpans: SourceSpan[] = [];
  let rawText = "";
  let offset = 0;

  for (const [pageIndex, pageText] of pageTexts.entries()) {
    const pageNumber = pageIndex + 1;
    const pagePrefix = rawText ? "\n\n" : "";
    rawText += pagePrefix;
    offset += pagePrefix.length;

    const startOffset = offset;
    rawText += pageText;
    offset += pageText.length;

    pages.push({
      pageNumber,
      rawText: pageText,
      normalizedText: normalizeContractText(pageText),
      startOffset,
      endOffset: offset,
    });

    sourceSpans.push(
      ...buildSourceSpans({
        pageNumber,
        rawText: pageText,
        spanMode,
        pageStartOffset: startOffset,
      }),
    );
  }

  return {
    fileName,
    fileType,
    fileSize,
    pageCount: pages.length,
    rawText,
    normalizedText: normalizeContractText(rawText),
    pages,
    sourceSpans,
  };
}

function buildSourceSpans({
  pageNumber,
  pageStartOffset,
  rawText,
  spanMode,
}: {
  pageNumber: number;
  pageStartOffset: number;
  rawText: string;
  spanMode: "line" | "page" | "paragraph";
}) {
  if (spanMode === "page") {
    return [
      {
        id: `p${pageNumber}`,
        pageNumber,
        sectionPath: [],
        startOffset: pageStartOffset,
        endOffset: pageStartOffset + rawText.length,
        text: rawText,
      },
    ];
  }

  const pattern = spanMode === "line" ? /[^\n]+/g : /[^\n]+(?:\n(?!\n)[^\n]+)*/g;
  const spans: SourceSpan[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(rawText)) !== null) {
    const text = match[0].trim();
    if (!text) continue;

    const startOffset = pageStartOffset + match.index;
    const endOffset = startOffset + match[0].length;

    spans.push({
      id: `p${pageNumber}-s${index + 1}`,
      pageNumber,
      paragraphIndex: spanMode === "paragraph" ? index : undefined,
      lineStart: spanMode === "line" ? findLineNumber(rawText, match.index) : undefined,
      lineEnd:
        spanMode === "line"
          ? findLineNumber(rawText, match.index + match[0].length)
          : undefined,
      sectionPath: [],
      startOffset,
      endOffset,
      text: match[0],
    });
    index += 1;
  }

  return spans;
}
