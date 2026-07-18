import type { DemoAnalysisFixture } from "@/features/demo/types";

export type SidebarProps = {
  analysis: DemoAnalysisFixture;
  contractFileName: string;
  reviewerRoleLabel: string;
};
