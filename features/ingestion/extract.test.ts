import assert from "node:assert/strict";
import test from "node:test";

import { extractTxtDocument } from "./extract.ts";

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
