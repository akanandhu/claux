import type { DemoAnalysisFixture } from "../types";
import {
  contract,
  executiveSummary,
  metrics,
  navItems,
  topFindings,
} from "./contract";
import { coreInspectors } from "./inspectors-core";
import { pathInspectors } from "./inspectors-paths";
import { riskInspectors } from "./inspectors-risk";

export const demoAnalysis: DemoAnalysisFixture = {
  contract,
  navItems,
  metrics,
  defaultInspectorId: "liability-cap",
  inspectors: [...coreInspectors, ...pathInspectors, ...riskInspectors],
  executiveSummary,
  topFindings,
};
