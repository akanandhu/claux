import assert from "node:assert/strict";
import test from "node:test";

import { IngestionError } from "./errors.ts";
import {
  maxUploadBytes,
  validateContractLikeText,
  validateUploadFile,
} from "./validation.ts";

test("validateUploadFile accepts supported PDF, DOCX, and TXT uploads", () => {
  assert.equal(validateUploadFile({ name: "deal.pdf", size: 1024, type: "application/pdf" }), "pdf");
  assert.equal(
    validateUploadFile({
      name: "deal.docx",
      size: 1024,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
    "docx",
  );
  assert.equal(validateUploadFile({ name: "deal.txt", size: 1024, type: "text/plain" }), "txt");
});

test("validateUploadFile rejects unsupported, empty, and oversized files", () => {
  assert.throws(
    () => validateUploadFile({ name: "deal.doc", size: 1024, type: "application/msword" }),
    (error) => error instanceof IngestionError && error.code === "unsupported_file",
  );
  assert.throws(
    () => validateUploadFile({ name: "deal.txt", size: 0, type: "text/plain" }),
    (error) => error instanceof IngestionError && error.code === "empty_file",
  );
  assert.throws(
    () =>
      validateUploadFile({
        name: "deal.pdf",
        size: maxUploadBytes + 1,
        type: "application/pdf",
      }),
    (error) => error instanceof IngestionError && error.code === "file_too_large",
  );
});

test("validateContractLikeText rejects text without contract signals", () => {
  assert.throws(
    () =>
      validateContractLikeText(
        "This is a short personal note about lunch, travel, and weekend logistics.",
      ),
    (error) => error instanceof IngestionError && error.code === "non_contract_text",
  );
});
