import type { DemoAnalysisFixture } from "./types";

export const demoAnalysis: DemoAnalysisFixture = {
  contract: {
    fileName: "Acme Cloud Services Agreement.pdf",
    contractType: "SaaS services agreement",
    reviewingRole: "Customer",
    effectiveDate: "2026-07-01",
    pageCount: 18,
    clauseCount: 42,
    analysisCompletedAt: "2026-07-17T10:30:00+05:30",
  },
  navItems: [
    { id: "overview", label: "Overview", count: 8 },
    { id: "clauses", label: "Clauses", count: 42 },
    { id: "obligations", label: "Obligations", count: 16 },
    { id: "risks", label: "Commercial risks", count: 5 },
    { id: "smells", label: "Contract smells", count: 3 },
    { id: "evidence", label: "Evidence links", count: 31 },
  ],
  metrics: [
    {
      id: "coverage",
      label: "Evidence coverage",
      value: "86%",
      detail: "31 linked excerpts",
      tone: "success",
    },
    {
      id: "confidence",
      label: "Extraction confidence",
      value: "0.82",
      detail: "hybrid parse",
      tone: "accent",
    },
    {
      id: "dependencies",
      label: "Critical dependencies",
      value: "7",
      detail: "payment and termination paths",
      tone: "warning",
    },
    {
      id: "findings",
      label: "Open findings",
      value: "5",
      detail: "2 high commercial risks",
      tone: "danger",
    },
  ],
  graph: {
    nodes: [
      {
        id: "contract",
        label: "Agreement",
        type: "CONTRACT",
        x: 82,
        y: 92,
        size: 52,
      },
      {
        id: "customer",
        label: "Customer",
        type: "PARTY",
        x: 226,
        y: 48,
        size: 40,
        inspectorId: "customer-party",
      },
      {
        id: "provider",
        label: "Provider",
        type: "PARTY",
        x: 226,
        y: 138,
        size: 40,
      },
      {
        id: "fees",
        label: "Fees",
        type: "CLAUSE",
        x: 392,
        y: 48,
        size: 44,
        inspectorId: "fees-clause",
      },
      {
        id: "payment-obligation",
        label: "Payment",
        type: "OBLIGATION",
        x: 554,
        y: 48,
        size: 42,
        inspectorId: "payment-obligation",
      },
      {
        id: "termination",
        label: "Termination",
        type: "CLAUSE",
        x: 392,
        y: 142,
        size: 46,
        inspectorId: "termination-clause",
      },
      {
        id: "cure-period",
        label: "Cure period",
        type: "CONDITION",
        x: 554,
        y: 142,
        size: 40,
        inspectorId: "cure-condition",
      },
      {
        id: "service-credit",
        label: "Service credit",
        type: "RIGHT",
        x: 392,
        y: 238,
        size: 42,
        inspectorId: "service-credit-right",
      },
      {
        id: "liability-cap",
        label: "Liability cap",
        type: "CLAUSE",
        x: 554,
        y: 238,
        size: 46,
        inspectorId: "liability-cap",
      },
      {
        id: "cap-risk",
        label: "Cap mismatch",
        type: "FINDING",
        x: 706,
        y: 238,
        size: 44,
        inspectorId: "cap-risk",
      },
    ],
    edges: [
      {
        id: "contract-customer",
        source: "contract",
        target: "customer",
        type: "MENTIONS_PARTY",
        confidence: 0.94,
        pathType: "reference",
      },
      {
        id: "contract-provider",
        source: "contract",
        target: "provider",
        type: "MENTIONS_PARTY",
        confidence: 0.94,
        pathType: "reference",
      },
      {
        id: "contract-fees",
        source: "contract",
        target: "fees",
        type: "CONTAINS",
        confidence: 0.91,
        pathType: "dependency",
      },
      {
        id: "fees-payment",
        source: "fees",
        target: "payment-obligation",
        type: "ASSIGNED_TO",
        confidence: 0.86,
        pathType: "dependency",
      },
      {
        id: "payment-customer",
        source: "payment-obligation",
        target: "customer",
        type: "ASSIGNED_TO",
        confidence: 0.83,
        pathType: "dependency",
      },
      {
        id: "contract-termination",
        source: "contract",
        target: "termination",
        type: "CONTAINS",
        confidence: 0.9,
        pathType: "dependency",
      },
      {
        id: "termination-cure",
        source: "termination",
        target: "cure-period",
        type: "TRIGGERED_BY",
        confidence: 0.8,
        pathType: "dependency",
      },
      {
        id: "termination-payment",
        source: "payment-obligation",
        target: "termination",
        type: "DEPENDS_ON",
        confidence: 0.78,
        pathType: "risk",
        dashed: true,
      },
      {
        id: "service-liability",
        source: "service-credit",
        target: "liability-cap",
        type: "AFFECTS",
        confidence: 0.76,
        pathType: "reference",
        dashed: true,
      },
      {
        id: "liability-finding",
        source: "liability-cap",
        target: "cap-risk",
        type: "SUPPORTED_BY",
        confidence: 0.81,
        pathType: "risk",
      },
    ],
  },
  defaultInspectorId: "liability-cap",
  inspectors: [
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
        {
          id: "dep-service-credit",
          label: "Service credit remedy",
          relationship: "May consume available cap",
          severity: "MEDIUM",
        },
        {
          id: "dep-indemnity",
          label: "IP indemnity",
          relationship: "Listed outside cap in one clause",
          severity: "INFO",
        },
      ],
      evidence: [
        {
          id: "ev-cap-1",
          clauseRef: "11.2",
          page: 14,
          excerpt:
            "aggregate liability will not exceed fees paid in the six months before the claim",
          validationStatus: "PARTIALLY_VERIFIED",
        },
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
        {
          id: "dep-payment-termination",
          label: "Termination for non-payment",
          relationship: "Depends on notice and cure",
          severity: "MEDIUM",
        },
      ],
      evidence: [
        {
          id: "ev-fees-1",
          clauseRef: "4.1",
          page: 6,
          excerpt: "Customer will pay undisputed invoices within thirty days",
          validationStatus: "VERIFIED",
        },
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
        {
          id: "dep-cure-period",
          label: "Cure period condition",
          relationship: "Triggers termination right",
          severity: "LOW",
        },
      ],
      evidence: [
        {
          id: "ev-term-1",
          clauseRef: "9.3",
          page: 12,
          excerpt: "may terminate if breach remains uncured after written notice",
          validationStatus: "VERIFIED",
        },
      ],
      commercialImpact:
        "Operational teams need notice tracking before exercising termination rights.",
      uncertainty:
        "Materiality is not defined in this static sample.",
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
        {
          id: "dep-customer-payment",
          label: "Payment obligation",
          relationship: "Assigned to customer",
          severity: "INFO",
        },
      ],
      evidence: [
        {
          id: "ev-customer-1",
          clauseRef: "Preamble",
          page: 1,
          excerpt: "Acme, Inc. is the customer receiving the hosted services",
          validationStatus: "VERIFIED",
        },
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
        {
          id: "dep-payment-fees",
          label: "Fees clause",
          relationship: "Defines invoice timing",
          severity: "INFO",
        },
        {
          id: "dep-payment-term",
          label: "Termination",
          relationship: "Affected by uncured breach",
          severity: "MEDIUM",
        },
      ],
      evidence: [
        {
          id: "ev-payment-1",
          clauseRef: "4.1",
          page: 6,
          excerpt: "Customer will pay undisputed invoices within thirty days",
          validationStatus: "VERIFIED",
        },
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
    {
      id: "cure-condition",
      nodeId: "cure-period",
      clauseRef: "Section 9.3",
      title: "Breach cure condition",
      nodeType: "CONDITION",
      severity: "LOW",
      confidence: 0.8,
      labels: ["STRUCTURAL_DIAGNOSTIC"],
      summary:
        "The cure period condition gates the termination right after written notice.",
      keyInfo: [
        { label: "Duration", value: "15 days" },
        { label: "Trigger", value: "Written notice" },
        { label: "Evidence status", value: "Verified" },
      ],
      dependencyChain: [
        {
          id: "dep-cure-term",
          label: "Termination right",
          relationship: "Triggered when uncured",
          severity: "LOW",
        },
      ],
      evidence: [
        {
          id: "ev-cure-1",
          clauseRef: "9.3",
          page: 12,
          excerpt: "after fifteen days from written notice of material breach",
          validationStatus: "VERIFIED",
        },
      ],
      commercialImpact:
        "Short cure windows may require operational readiness for breach response.",
      uncertainty:
        "Notice delivery mechanics are not represented in this sample graph.",
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
        {
          id: "dep-credit-cap",
          label: "Liability cap",
          relationship: "May affect available recovery",
          severity: "MEDIUM",
        },
      ],
      evidence: [
        {
          id: "ev-credit-1",
          clauseRef: "7.4",
          page: 10,
          excerpt: "service credits are customer sole remedy for availability failure",
          validationStatus: "PARTIALLY_VERIFIED",
        },
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
        {
          id: "dep-risk-credit",
          label: "Service credit",
          relationship: "Feeds risk path",
          severity: "MEDIUM",
        },
        {
          id: "dep-risk-cap",
          label: "Liability cap",
          relationship: "Supports finding",
          severity: "HIGH",
        },
      ],
      evidence: [
        {
          id: "ev-risk-1",
          clauseRef: "11.2",
          page: 14,
          excerpt: "fees paid in the six months before the claim",
          validationStatus: "PARTIALLY_VERIFIED",
        },
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
  ],
  executiveSummary: [
    "The sample agreement has strong clause structure and most key obligations are linked to evidence.",
    "Commercial review should prioritize liability cap scope, termination dependencies, and service credit treatment.",
    "No jurisdiction-specific legal enforceability assessment is included in this visual fixture.",
  ],
  topFindings: [
    {
      id: "finding-cap",
      title: "Liability cap may absorb service credits",
      category: "COMMERCIAL_RISK",
      severity: "HIGH",
      summary:
        "Service credits and damages appear connected to the same recovery limit.",
      clauseRefs: ["7.4", "11.2"],
      confidence: 0.81,
    },
    {
      id: "finding-cure",
      title: "Termination path depends on separate cure language",
      category: "CONTRACT_SMELL",
      severity: "MEDIUM",
      summary:
        "The remedy can be traced, but the path crosses payment, notice, and breach sections.",
      clauseRefs: ["4.1", "9.3"],
      confidence: 0.8,
    },
    {
      id: "finding-context",
      title: "Governing law missing from sample metadata",
      category: "UNCERTAIN",
      severity: "LOW",
      summary:
        "The fixture does not include jurisdiction context for legal-review checks.",
      clauseRefs: ["Metadata"],
      confidence: 0.72,
    },
  ],
};
