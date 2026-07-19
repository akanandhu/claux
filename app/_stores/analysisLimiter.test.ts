import assert from "node:assert/strict";
import test from "node:test";

import { consumeAnalysisSlot, dailyAnalysisLimit } from "./analysisLimiter.ts";

test("consumeAnalysisSlot allows three analyses per local day", () => {
  const now = new Date(2026, 6, 19, 10, 30);
  let state = { count: 0, dayKey: "2026-07-19" };

  for (let index = 0; index < dailyAnalysisLimit; index += 1) {
    const result = consumeAnalysisSlot(state, now);
    assert.equal(result.allowed, true);
    state = { count: result.count, dayKey: result.dayKey };
  }

  const blocked = consumeAnalysisSlot(state, now);

  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
});

test("consumeAnalysisSlot resets on a new local day", () => {
  const result = consumeAnalysisSlot(
    { count: dailyAnalysisLimit, dayKey: "2026-07-19" },
    new Date(2026, 6, 20, 9, 0),
  );

  assert.equal(result.allowed, true);
  assert.equal(result.count, 1);
  assert.equal(result.remaining, dailyAnalysisLimit - 1);
});
