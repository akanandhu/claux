export const INGESTION_ERROR_CODES = [
  "unsupported_file",
  "empty_file",
  "file_too_large",
  "encrypted_pdf",
  "scanned_pdf",
  "corrupt_file",
  "non_contract_text",
  "no_clauses",
] as const;

export type IngestionErrorCode = (typeof INGESTION_ERROR_CODES)[number];

export class IngestionError extends Error {
  readonly code: IngestionErrorCode;

  constructor(message: string, code: IngestionErrorCode) {
    super(message);
    this.name = "IngestionError";
    this.code = code;
  }
}
