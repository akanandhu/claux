"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const dailyAnalysisLimit = 3;

type AnalysisLimiterResult = {
  allowed: boolean;
  remaining: number;
  resetAt: string;
};

type AnalysisLimiterState = {
  count: number;
  dayKey: string;
  consumeAnalysis: (now?: Date) => AnalysisLimiterResult;
};

export const useAnalysisLimiterStore = create<AnalysisLimiterState>()(
  persist(
    (set, get) => ({
      count: 0,
      dayKey: localDayKey(new Date()),
      consumeAnalysis: (now = new Date()) => {
        const result = consumeAnalysisSlot(get(), now);
        set({ count: result.count, dayKey: result.dayKey });

        return {
          allowed: result.allowed,
          remaining: result.remaining,
          resetAt: result.resetAt.toISOString(),
        };
      },
    }),
    {
      name: "claux-analysis-limiter",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ count, dayKey }) => ({ count, dayKey }),
    },
  ),
);

export function analysisLimitMessage(result: AnalysisLimiterResult) {
  return `Daily local analysis limit reached. You can run ${dailyAnalysisLimit} analyses per browser per day. Try again after ${formatResetTime(result.resetAt)}.`;
}

export function consumeAnalysisSlot(
  state: Pick<AnalysisLimiterState, "count" | "dayKey">,
  now: Date,
) {
  const dayKey = localDayKey(now);
  const count = state.dayKey === dayKey ? state.count : 0;
  const allowed = count < dailyAnalysisLimit;
  const nextCount = allowed ? count + 1 : count;

  return {
    allowed,
    count: nextCount,
    dayKey,
    remaining: Math.max(0, dailyAnalysisLimit - nextCount),
    resetAt: nextLocalMidnight(now),
  };
}

function localDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function nextLocalMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

function formatResetTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
