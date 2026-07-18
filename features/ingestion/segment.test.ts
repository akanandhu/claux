import assert from "node:assert/strict";
import test from "node:test";

import { IngestionError } from "./errors.ts";
import { extractTxtDocument } from "./extract.ts";
import { segmentContractClauses } from "./segment.ts";
import { validateContractLikeText } from "./validation.ts";

test("segmentContractClauses detects numbered clauses and continuations", async () => {
  const file = new File(
    [
      [
        "MASTER SERVICES AGREEMENT",
        "1. Payment. Customer shall pay Provider within 30 days.",
        "Invoices disputed in good faith shall not trigger suspension.",
        "2. Termination. Either party may terminate for material breach.",
      ].join("\n"),
    ],
    "agreement.txt",
    { type: "text/plain" },
  );
  const document = await extractTxtDocument(file);
  const clauses = segmentContractClauses(document);

  assert.equal(clauses.length, 2);
  assert.equal(clauses[0]?.number, "1");
  assert.match(clauses[0]?.text ?? "", /Invoices disputed/);
  assert.equal(clauses[1]?.number, "2");
});

test("segmentContractClauses rejects text without legal clauses", async () => {
  const file = new File(
    ["Shopping list\napples\nbananas\ncoffee"],
    "notes.txt",
    { type: "text/plain" },
  );
  const document = await extractTxtDocument(file);

  assert.throws(
    () => segmentContractClauses(document),
    (error) => error instanceof IngestionError && error.code === "no_clauses",
  );
});

test("segmentContractClauses rejects contract-like text without usable clauses", async () => {
  const rawText =
    "This Agreement is between Party A and Party B. The parties discuss payment, confidentiality, term, governing law, and liability. Customer shall pay invoices under the contract, and the parties may review notices, reports, and schedules during normal business hours.";
  const file = new File([rawText], "contract-ish.txt", { type: "text/plain" });
  const document = await extractTxtDocument(file);

  assert.doesNotThrow(() => validateContractLikeText(rawText));
  assert.throws(
    () => segmentContractClauses(document),
    (error) => error instanceof IngestionError && error.code === "no_clauses",
  );
});
