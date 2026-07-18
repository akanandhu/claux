import assert from "node:assert/strict";
import test from "node:test";

import { IngestionError } from "./errors.ts";
import { extractPdfDocumentWithLoader, extractTxtDocument } from "./extract.ts";

test("extractTxtDocument preserves text and line source offsets", async () => {
  const file = new File(
    [
      [
        "MASTER SERVICES AGREEMENT",
        "1. Payment. Customer shall pay Provider within 30 days.",
        "2. Confidentiality. Each party must protect Confidential Information.",
      ].join("\n"),
    ],
    "agreement.txt",
    { type: "text/plain" },
  );

  const document = await extractTxtDocument(file);

  assert.equal(document.fileType, "txt");
  assert.equal(document.pages[0]?.startOffset, 0);
  assert.equal(document.sourceSpans.length, 3);
  assert.equal(document.sourceSpans[1]?.lineStart, 2);
  assert.equal(
    document.rawText.slice(
      document.sourceSpans[1]!.startOffset,
      document.sourceSpans[1]!.endOffset,
    ),
    "1. Payment. Customer shall pay Provider within 30 days.",
  );
});

test("extractPdfDocument configures worker and preserves text-layer pages", async () => {
  const pdfjs = mockPdfJs({
    pageTexts: [
      "MASTER SERVICES AGREEMENT",
      "1. Payment. Customer shall pay Provider within 30 days.",
    ],
  });
  const document = await extractPdfDocumentWithLoader(
    pdfFile(),
    "pdf",
    async () => pdfjs,
  );

  assert.equal(document.fileType, "pdf");
  assert.equal(document.pageCount, 2);
  assert.equal(document.pages[1]?.pageNumber, 2);
  assert.equal(document.sourceSpans.length, 2);
  assert.equal(document.sourceSpans[1]?.id, "p2");
  assert.match(pdfjs.GlobalWorkerOptions.workerSrc, /pdf\.worker\.mjs/);
  assert.match(document.rawText, /Customer shall pay Provider/);
});

test("extractPdfDocument rejects PDFs without a readable text layer", async () => {
  await assert.rejects(
    () =>
      extractPdfDocumentWithLoader(
        pdfFile(),
        "pdf",
        async () => mockPdfJs({ pageTexts: [" ", ""] }),
      ),
    (error) => error instanceof IngestionError && error.code === "scanned_pdf",
  );
});

test("extractPdfDocument reports encrypted PDFs separately", async () => {
  await assert.rejects(
    () =>
      extractPdfDocumentWithLoader(
        pdfFile(),
        "pdf",
        async () =>
          mockPdfJs({
            loadError: new Error("PasswordException: No password given"),
          }),
      ),
    (error) => error instanceof IngestionError && error.code === "encrypted_pdf",
  );
});

test("extractPdfDocument reports unsupported PDF load failures as corrupt files", async () => {
  await assert.rejects(
    () =>
      extractPdfDocumentWithLoader(
        pdfFile(),
        "pdf",
        async () =>
          mockPdfJs({
            loadError: new Error("Setting up fake worker failed"),
          }),
      ),
    (error) =>
      error instanceof IngestionError &&
      error.code === "corrupt_file" &&
      error.message.includes("unsupported PDF features"),
  );
});

function pdfFile() {
  return new File(["%PDF-1.7"], "agreement.pdf", { type: "application/pdf" });
}

function mockPdfJs({
  loadError,
  pageTexts = [],
}: {
  loadError?: Error;
  pageTexts?: string[];
}) {
  return {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
    getDocument: ({ data }: { data: Uint8Array<ArrayBuffer> }) => {
      assert.equal(data instanceof Uint8Array, true);

      return {
        promise: loadError
          ? Promise.reject(loadError)
          : Promise.resolve({
              numPages: pageTexts.length,
              getPage: async (pageNumber: number) => ({
                getTextContent: async () => ({
                  items: pageTexts[pageNumber - 1]!
                    .split(" ")
                    .map((str) => ({ str })),
                }),
              }),
            }),
      };
    },
  };
}
