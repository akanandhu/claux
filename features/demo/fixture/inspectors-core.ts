import type { DemoInspector } from "../types";
import { dependency, evidence } from "./helpers";

export const coreInspectors: DemoInspector[] = [
  {
    id: "liability-cap",
    nodeId: "liability-cap",
    clauseRef: "Section 11.2",
    title: "Aggregate liability cap",
    nodeType: "CLAUSE",
    severity: "HIGH",
    confidence: 0.81,
    labels: ["COMMERCIAL_RISK", "UNCERTAIN"],
    summary:
      "The cap appears to include service credits while excluding several provider obligations. This is a commercial review signal, not a legal conclusion.",
    keyInfo: [
      { label: "Role reviewed", value: "Customer" },
      { label: "Linked finding", value: "Cap mismatch" },
      { label: "Evidence status", value: "Partially verified" },
    ],
    dependencyChain: [
      dependency("dep-service-credit", "Service credit remedy", "May consume available cap", "MEDIUM"),
      dependency("dep-indemnity", "IP indemnity", "Listed outside cap in one clause", "INFO"),
    ],
    evidence: [
      evidence(
        "ev-cap-1",
        "11.2",
        14,
        "aggregate liability will not exceed fees paid in the six months before the claim",
        "PARTIALLY_VERIFIED",
      ),
    ],
    commercialImpact:
      "The customer may have limited recovery for outages if credits and damages draw from the same pool.",
    uncertainty:
      "Governing law and negotiated exhibits are not included in this static sample.",
    suggestedAction:
      "Consider separating service credits from the liability cap or adding a targeted carveout for uptime failures.",
    history: [
      { label: "Detected", detail: "Linked from liability and service level clauses" },
      { label: "Validation", detail: "Needs reviewer confirmation" },
    ],
  },
  {
    id: "fees-clause",
    nodeId: "fees",
    clauseRef: "Section 4.1",
    title: "Fees and payment timing",
    nodeType: "CLAUSE",
    severity: "MEDIUM",
    confidence: 0.84,
    labels: ["STRUCTURAL_DIAGNOSTIC", "COMMERCIAL_RISK"],
    summary:
      "Payment timing is explicit, but the late fee cross-reference depends on a separate termination remedy.",
    keyInfo: [
      { label: "Due date", value: "30 days from invoice" },
      { label: "Actor", value: "Customer" },
      { label: "Evidence status", value: "Verified" },
    ],
    dependencyChain: [
      dependency("dep-payment-termination", "Termination for non-payment", "Depends on notice and cure", "MEDIUM"),
    ],
    evidence: [
      evidence("ev-fees-1", "4.1", 6, "Customer will pay undisputed invoices within thirty days"),
    ],
    commercialImpact:
      "Cash-flow exposure is bounded by invoice disputes, but suspension timing should be checked.",
    uncertainty:
      "The sample does not include order forms that may override fee timing.",
    suggestedAction:
      "Confirm whether disputed invoice procedures pause suspension and late fees.",
    history: [
      { label: "Detected", detail: "Parsed as payment obligation" },
      { label: "Validation", detail: "Evidence matched source excerpt" },
    ],
  },
];
