import { IngestionError } from "./errors.ts";
import { normalizeContractText } from "./text.ts";

const supportedExtensions = ["pdf", "docx", "txt"] as const;
const supportedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "",
]);

const contractSignals = [
  /\bagreement\b/i,
  /\bcontract\b/i,
  /\bparty\b/i,
  /\bparties\b/i,
  /\bshall\b/i,
  /\bmust\b/i,
  /\bterm(?:ination)?\b/i,
  /\bliabilit(?:y|ies)\b/i,
  /\bconfidential/i,
  /\bgoverning law\b/i,
  /\bindemn/i,
  /\bpayment\b/i,
  /\beffective date\b/i,
];

export type SupportedFileType = (typeof supportedExtensions)[number];

export type UploadFileLike = {
  name: string;
  size: number;
  type?: string;
};

export const maxUploadBytes = 15 * 1024 * 1024;

export function getSupportedFileType(file: UploadFileLike): SupportedFileType | null {
  const extension = file.name.split(".").at(-1)?.toLowerCase();

  if (!extension || !isSupportedExtension(extension)) return null;
  if (file.type && !supportedMimeTypes.has(file.type)) return null;

  return extension;
}

export function validateUploadFile(file: UploadFileLike): SupportedFileType {
  if (file.size <= 0) {
    throw new IngestionError("The selected file is empty.", "empty_file");
  }

  if (file.size > maxUploadBytes) {
    throw new IngestionError(
      "The selected file is larger than the 15 MB MVP limit.",
      "file_too_large",
    );
  }

  const fileType = getSupportedFileType(file);

  if (!fileType) {
    throw new IngestionError(
      "Upload a PDF, DOCX, or UTF-8 TXT contract.",
      "unsupported_file",
    );
  }

  return fileType;
}

export function validateContractLikeText(text: string) {
  const normalizedText = normalizeContractText(text);
  const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
  const signalCount = contractSignals.reduce(
    (count, signal) => count + (signal.test(normalizedText) ? 1 : 0),
    0,
  );

  if (wordCount < 35 || signalCount < 2) {
    throw new IngestionError(
      "This file does not look like clause-based legal contract text.",
      "non_contract_text",
    );
  }
}

function isSupportedExtension(value: string): value is SupportedFileType {
  return supportedExtensions.includes(value as SupportedFileType);
}
