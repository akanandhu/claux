import type { DemoInspector } from "../types";
import { dependency, evidence } from "./helpers";

export const pathInspectors: DemoInspector[] = [
  {
    id: "termination-clause",
    nodeId: "termination",
    clauseRef: "Section 9.3",
    title: "Termination for uncured breach",
    nodeType: "CLAUSE",
    severity: "MEDIUM",
    confidence: 0.8,
    labels: ["CONTRACT_SMELL", "NEGOTIATION_SUGGESTION"],
    summary:
      "The breach cure path is clear, but suspension and termination remedies are spread across separate sections.",
    keyInfo: [
      { label: "Cure period", value: "15 days" },
      { label: "Trigger", value: "Material breach" },
      { label: "Evidence status", value: "Verified" },
    ],
    dependencyChain: [
      dependency("dep-cure-period", "Cure period condition", "Triggers termination right", "LOW"),
    ],
    evidence: [
      evidence("ev-term-1", "9.3", 12, "may terminate if breach remains uncured after written notice"),
    ],
    commercialImpact:
      "Operational teams need notice tracking before exercising termination rights.",
    uncertainty: "Materiality is not defined in this static sample.",
    suggestedAction:
      "Consider consolidating cure, suspension, and termination references in one review note.",
    history: [
      { label: "Detected", detail: "Referenced by payment path" },
      { label: "Validation", detail: "Cross-reference needs review" },
    ],
  },
  {
    id: "customer-party",
    nodeId: "customer",
    clauseRef: "Preamble",
    title: "Customer party reference",
    nodeType: "PARTY",
    confidence: 0.94,
    labels: ["FACT"],
    summary:
      "The customer is identified as the reviewing party for this static sample.",
    keyInfo: [
      { label: "Role", value: "Customer" },
      { label: "Mentions", value: "12 linked clauses" },
      { label: "Evidence status", value: "Verified" },
    ],
    dependencyChain: [
      dependency("dep-customer-payment", "Payment obligation", "Assigned to customer", "INFO"),
    ],
    evidence: [
      evidence("ev-customer-1", "Preamble", 1, "Acme, Inc. is the customer receiving the hosted services"),
    ],
    commercialImpact:
      "Customer role drives obligation, remedy, and risk interpretation in the demo.",
    uncertainty:
      "Affiliate and order-form party details are not included in this fixture.",
    suggestedAction:
      "Confirm whether affiliates can use the services or claim remedies.",
    history: [
      { label: "Detected", detail: "Party mention matched across clauses" },
      { label: "Validation", detail: "Evidence matched source excerpt" },
    ],
  },
  {
    id: "payment-obligation",
    nodeId: "payment-obligation",
    clauseRef: "Section 4.1",
    title: "Customer payment obligation",
    nodeType: "OBLIGATION",
    severity: "MEDIUM",
    confidence: 0.86,
    labels: ["FACT", "COMMERCIAL_RISK"],
    summary:
      "The customer payment obligation is clear and links to the termination path for uncured non-payment.",
    keyInfo: [
      { label: "Actor", value: "Customer" },
      { label: "Deadline", value: "30 days" },
      { label: "Evidence status", value: "Verified" },
    ],
    dependencyChain: [
      dependency("dep-payment-fees", "Fees clause", "Defines invoice timing", "INFO"),
      dependency("dep-payment-term", "Termination", "Affected by uncured breach", "MEDIUM"),
    ],
    evidence: [
      evidence("ev-payment-1", "4.1", 6, "Customer will pay undisputed invoices within thirty days"),
    ],
    commercialImpact:
      "Late payment can connect to suspension or termination if notice and cure requirements are met.",
    uncertainty:
      "The fixture does not include billing exhibits or disputed invoice workflow details.",
    suggestedAction:
      "Check whether payment disputes preserve service access during review.",
    history: [
      { label: "Detected", detail: "Obligation extracted from modal verb" },
      { label: "Validation", detail: "Linked to fees and termination nodes" },
    ],
  },
];
