import type { DemoMetric } from "@/features/demo/types";

export const metricHelpText: Record<
  string,
  Pick<DemoMetric, "label"> & { question: string; tip: string }
> = {
  "commercial-risk": {
    label: "Commercial Risk",
    question: "Should I be worried?",
    tip: "Commercial Risk highlights clauses that may create financial, operational, or business exposure based on your role in the agreement. It points you to the areas worth reviewing first.",
  },
  "contract-complexity": {
    label: "Contract Complexity",
    question: "How difficult is this contract to understand?",
    tip: "Complexity measures review difficulty using contract size, references, dependencies, and structural depth.",
  },
  "contract-health": {
    label: "Contract Health",
    question: "Is this contract well-structured?",
    tip: "Contract Health checks drafting issues, broken references, missing definitions, and structural inconsistencies before clause review.",
  },
  explainability: {
    label: "Explainability",
    question: "Can I trust what Claux is telling me?",
    tip: "Explainability shows how much of the analysis is directly supported by evidence from the contract.",
  },
};
