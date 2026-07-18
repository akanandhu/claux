import type { DemoAnalysisFixture } from "@/features/demo/types";

export type TopBarProps = {
  contract: DemoAnalysisFixture["contract"];
  onClearWorkspace: () => void;
};
