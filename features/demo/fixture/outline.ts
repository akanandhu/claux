export type ContractClause = {
  id: string;
  label: string;
  risk: "Low" | "Medium" | "High";
  summary: string;
};

export type ContractSection = {
  children: ContractClause[];
  count: number;
  hazards: string[];
  id: string;
  label: string;
  plainEnglishSummary: string;
  risk: "Low" | "Medium" | "High";
  signGuidance: string;
};

export const contractOutline: ContractSection[] = [
  {
    children: [
      {
        id: "defined-terms",
        label: "1.1 Defined Terms",
        risk: "Low",
        summary: "Defines key terms used across the agreement.",
      },
      {
        id: "interpretation",
        label: "1.2 Interpretation",
        risk: "Low",
        summary: "Sets rules for reading references and headings.",
      },
      {
        id: "priority",
        label: "1.3 Order of Priority",
        risk: "Medium",
        summary: "Explains which document controls if terms conflict.",
      },
    ],
    count: 12,
    hazards: [
      "A conflicting definition can change obligations throughout the agreement.",
      "Priority rules may override terms in attached order forms.",
    ],
    id: "definitions",
    label: "Definitions",
    plainEnglishSummary:
      "This section explains how important words and document conflicts should be read. It is low risk, but mistakes here can affect many later clauses.",
    risk: "Low",
    signGuidance:
      "Usually acceptable if the key business terms match how both parties actually use them.",
  },
  {
    children: [
      {
        id: "service-scope",
        label: "2.1 Service Scope",
        risk: "Medium",
        summary: "Defines what the provider must deliver.",
      },
      {
        id: "support",
        label: "2.2 Support",
        risk: "Medium",
        summary: "Sets response expectations and support boundaries.",
      },
      {
        id: "service-levels",
        label: "2.3 Service Levels",
        risk: "Medium",
        summary: "Links performance commitments to remedies.",
      },
    ],
    count: 17,
    hazards: [
      "The service scope may be narrower than the commercial expectation.",
      "Service-level remedies can become the only practical remedy for downtime.",
    ],
    id: "services",
    label: "Services",
    plainEnglishSummary:
      "This section says what the provider must deliver and how support should work. Review it carefully because unclear scope is where delivery disputes usually start.",
    risk: "Medium",
    signGuidance:
      "Sign only if the scope, support, and service levels match the deal you expect.",
  },
  {
    children: [
      {
        id: "fees",
        label: "3.1 Fees",
        risk: "Medium",
        summary: "States the fees and payment basis.",
      },
      {
        id: "invoicing",
        label: "3.2 Invoicing",
        risk: "Medium",
        summary: "Controls invoice timing and billing format.",
      },
      {
        id: "payment-due-date",
        label: "3.3 Payment Due Date",
        risk: "High",
        summary: "Sets the deadline that triggers late-payment consequences.",
      },
      {
        id: "late-payment",
        label: "3.4 Late Payment",
        risk: "High",
        summary: "Adds interest and may lead to suspension after notice.",
      },
      {
        id: "taxes",
        label: "3.5 Taxes",
        risk: "Medium",
        summary: "Allocates tax responsibility between parties.",
      },
      {
        id: "refunds",
        label: "3.6 Refunds",
        risk: "Low",
        summary: "Limits when amounts are refundable.",
      },
      {
        id: "set-off",
        label: "3.7 Set-off",
        risk: "Medium",
        summary: "Controls whether amounts can be withheld or offset.",
      },
      {
        id: "currency",
        label: "3.8 Currency",
        risk: "Low",
        summary: "Sets the payment currency.",
      },
    ],
    count: 12,
    hazards: [
      "Late payment can add interest and extra commercial pressure.",
      "Suspension rights may affect business continuity if invoices are disputed.",
      "Set-off limits can reduce leverage when services are incomplete.",
    ],
    id: "payment",
    label: "Payment Terms",
    plainEnglishSummary:
      "This section controls fees, invoices, tax, refunds, and late-payment consequences. It is high risk because payment defaults can quickly trigger interest or service suspension.",
    risk: "High",
    signGuidance:
      "Do not sign until invoice timing, dispute rights, late fees, and suspension triggers are commercially acceptable.",
  },
  {
    children: [
      {
        id: "customer-materials",
        label: "4.1 Customer Materials",
        risk: "Medium",
        summary: "Protects materials supplied by the customer.",
      },
      {
        id: "provider-ip",
        label: "4.2 Provider IP",
        risk: "Medium",
        summary: "Preserves provider ownership of platform IP.",
      },
      {
        id: "license-rights",
        label: "4.3 License Rights",
        risk: "Medium",
        summary: "Explains permitted use of the service.",
      },
    ],
    count: 10,
    hazards: [
      "License rights may be too narrow for the intended use.",
      "Ownership language can blur customer materials and provider platform IP.",
    ],
    id: "ip",
    label: "Intellectual Property",
    plainEnglishSummary:
      "This section separates customer materials, provider IP, and usage rights. It is medium risk because an unclear license can limit how the service can be used.",
    risk: "Medium",
    signGuidance:
      "Sign only if the license covers your real operating needs and your own materials remain protected.",
  },
  {
    children: [
      {
        id: "confidential-information",
        label: "5.1 Confidential Information",
        risk: "Medium",
        summary: "Defines protected confidential material.",
      },
      {
        id: "permitted-disclosures",
        label: "5.2 Permitted Disclosures",
        risk: "Medium",
        summary: "Allows limited disclosure for legal or operational needs.",
      },
      {
        id: "confidentiality-survival",
        label: "5.3 Survival",
        risk: "High",
        summary: "Keeps confidentiality duties alive after termination.",
      },
    ],
    count: 7,
    hazards: [
      "Confidentiality duties may continue after the contract ends.",
      "Permitted disclosure carve-outs may be broader than expected.",
    ],
    id: "confidentiality",
    label: "Confidentiality",
    plainEnglishSummary:
      "This section protects confidential information and says when disclosure is allowed. It is medium risk, with survival obligations that can continue after termination.",
    risk: "Medium",
    signGuidance:
      "Usually signable if the exceptions are narrow and the survival period is acceptable.",
  },
  {
    children: [
      {
        id: "liability-exclusions",
        label: "6.1 Exclusions",
        risk: "High",
        summary: "Carves some claims out of ordinary limits.",
      },
      {
        id: "liability-cap",
        label: "6.2 Liability Cap",
        risk: "High",
        summary: "Caps recovery and may limit service-credit remedies.",
      },
      {
        id: "indemnity",
        label: "6.3 Indemnity",
        risk: "Medium",
        summary: "Allocates third-party claim responsibility.",
      },
    ],
    count: 11,
    hazards: [
      "The liability cap may limit recovery even when losses are meaningful.",
      "Exclusions and indemnities can shift high-value claims outside normal remedies.",
      "Service credits may replace stronger financial remedies.",
    ],
    id: "liability",
    label: "Liability",
    plainEnglishSummary:
      "This section decides how much each party can recover if something goes wrong. It is high risk because caps and exclusions can materially reduce available remedies.",
    risk: "High",
    signGuidance:
      "Do not sign until the cap, exclusions, indemnities, and uncapped claims match your risk tolerance.",
  },
  {
    children: [
      {
        id: "term",
        label: "7.1 Term",
        risk: "Low",
        summary: "States how long the agreement runs.",
      },
      {
        id: "termination-for-cause",
        label: "7.2 Termination for Cause",
        risk: "Medium",
        summary: "Allows exit after material breach and cure periods.",
      },
      {
        id: "effect-of-termination",
        label: "7.3 Effect of Termination",
        risk: "Medium",
        summary: "Explains what obligations continue after exit.",
      },
    ],
    count: 10,
    hazards: [
      "Cure periods may delay exit from a failing relationship.",
      "Post-termination obligations may survive longer than expected.",
    ],
    id: "termination",
    label: "Termination",
    plainEnglishSummary:
      "This section explains how long the contract lasts and how either side can exit. It is medium risk because termination mechanics affect leverage when performance breaks down.",
    risk: "Medium",
    signGuidance:
      "Sign only if exit rights, cure periods, and post-termination duties are workable.",
  },
  {
    children: [
      {
        id: "notices",
        label: "8.1 Notices",
        risk: "Low",
        summary: "Sets how formal notices must be sent.",
      },
      {
        id: "assignment",
        label: "8.2 Assignment",
        risk: "Medium",
        summary: "Restricts transfer of rights and obligations.",
      },
      {
        id: "governing-law",
        label: "8.3 Governing Law",
        risk: "Medium",
        summary: "Identifies the law controlling interpretation.",
      },
    ],
    count: 12,
    hazards: [
      "Assignment restrictions can block business transfers or reorganizations.",
      "Governing law and notice mechanics can affect enforcement speed.",
    ],
    id: "general",
    label: "General Provisions",
    plainEnglishSummary:
      "This section covers legal mechanics such as notices, assignment, and governing law. It is medium risk because these terms affect enforceability and future flexibility.",
    risk: "Medium",
    signGuidance:
      "Sign if operational mechanics are practical and the governing law/forum are acceptable.",
  },
];
