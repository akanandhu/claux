import type { DemoInspector } from "../types";
import { dependency, evidence } from "./helpers";

export const riskInspectors: DemoInspector[] = [
  {
    id: "cure-condition",
    nodeId: "cure-period",
    clauseRef: "Section 9.3",
    title: "Breach cure condition",
    nodeType: "CONDITION",
    severity: "LOW",
    confidence: 0.8,
    labels: ["STRUCTURAL_DIAGNOSTIC"],
    summary: "The cure period condition gates the termination right after written notice.",
    keyInfo: [
      { label: "Duration", value: "15 days" },
      { label: "Trigger", value: "Written notice" },
      { label: "Evidence status", value: "Verified" },
    ],
    dependencyChain: [
      dependency("dep-cure-term", "Termination right", "Triggered when uncured", "LOW"),
    ],
    evidence: [
      evidence("ev-cure-1", "9.3", 12, "after fifteen days from written notice of material breach"),
    ],
    commercialImpact:
      "Short cure windows may require operational readiness for breach response.",
    uncertainty: "Notice delivery mechanics are not represented in this sample graph.",
    suggestedAction:
      "Confirm notice addresses and delivery method before relying on the cure path.",
    history: [
      { label: "Detected", detail: "Condition linked from termination clause" },
      { label: "Validation", detail: "Evidence matched source excerpt" },
    ],
  },
  {
    id: "service-credit-right",
    nodeId: "service-credit",
    clauseRef: "Section 7.4",
    title: "Service credit remedy",
    nodeType: "RIGHT",
    severity: "MEDIUM",
    confidence: 0.78,
    labels: ["COMMERCIAL_RISK", "NEGOTIATION_SUGGESTION"],
    summary:
      "The customer has a service credit remedy that may interact with the aggregate liability cap.",
    keyInfo: [
      { label: "Beneficiary", value: "Customer" },
      { label: "Linked cap", value: "Section 11.2" },
      { label: "Evidence status", value: "Partially verified" },
    ],
    dependencyChain: [
      dependency("dep-credit-cap", "Liability cap", "May affect available recovery", "MEDIUM"),
    ],
    evidence: [
      evidence("ev-credit-1", "7.4", 10, "service credits are customer sole remedy for availability failure", "PARTIALLY_VERIFIED"),
    ],
    commercialImpact:
      "Sole-remedy language can narrow practical recovery for availability issues.",
    uncertainty:
      "Availability schedule details are summarized in the fixture and need source review.",
    suggestedAction:
      "Consider whether service credits should be cumulative with other outage remedies.",
    history: [
      { label: "Detected", detail: "Right linked to service level language" },
      { label: "Validation", detail: "Needs schedule confirmation" },
    ],
  },
  {
    id: "cap-risk",
    nodeId: "cap-risk",
    clauseRef: "Sections 7.4 / 11.2",
    title: "Cap mismatch finding",
    nodeType: "FINDING",
    severity: "HIGH",
    confidence: 0.81,
    labels: ["COMMERCIAL_RISK", "UNCERTAIN"],
    summary:
      "The graph links service credits and damages to the same cap path, creating a commercial review signal.",
    keyInfo: [
      { label: "Finding type", value: "Commercial risk" },
      { label: "Linked clauses", value: "7.4, 11.2" },
      { label: "Review status", value: "Open" },
    ],
    dependencyChain: [
      dependency("dep-risk-credit", "Service credit", "Feeds risk path", "MEDIUM"),
      dependency("dep-risk-cap", "Liability cap", "Supports finding", "HIGH"),
    ],
    evidence: [
      evidence("ev-risk-1", "11.2", 14, "fees paid in the six months before the claim", "PARTIALLY_VERIFIED"),
    ],
    commercialImpact:
      "Potential remedy limits should be reviewed before treating credits as sufficient protection.",
    uncertainty:
      "This is not a legal enforceability conclusion and does not account for governing law.",
    suggestedAction:
      "Ask counsel or deal owners whether outage remedies need a separate negotiated carveout.",
    history: [
      { label: "Detected", detail: "Graph path connected credits to cap" },
      { label: "Validation", detail: "Reviewer confirmation required" },
    ],
  },
];
