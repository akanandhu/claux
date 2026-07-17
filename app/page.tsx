import { WorkspaceShell } from "./_components/WorkspaceShell";
import { demoAnalysis } from "@/features/demo/fixture";

export default function Home() {
  return <WorkspaceShell analysis={demoAnalysis} />;
}
