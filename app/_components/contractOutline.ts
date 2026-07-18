export type ContractClause = {
  id: string;
  label: string;
  risk: "Low" | "Medium" | "High";
  summary: string;
};

export type ContractSection = {
  children: ContractClause[];
  count: number;
  id: string;
  label: string;
  risk: "Low" | "Medium" | "High";
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
    id: "definitions",
    label: "Definitions",
    risk: "Low",
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
    id: "services",
    label: "Services",
    risk: "Medium",
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
    id: "payment",
    label: "Payment Terms",
    risk: "High",
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
    id: "ip",
    label: "Intellectual Property",
    risk: "Medium",
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
    id: "confidentiality",
    label: "Confidentiality",
    risk: "Medium",
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
    id: "liability",
    label: "Liability",
    risk: "High",
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
    id: "termination",
    label: "Termination",
    risk: "Medium",
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
    id: "general",
    label: "General Provisions",
    risk: "Medium",
  },
];

export function findContractClause(clauseId: string | null) {
  if (!clauseId) return undefined;

  for (const section of contractOutline) {
    const clause = section.children.find((item) => item.id === clauseId);
    if (clause) return { clause, section };
  }

  return undefined;
}

export function findContractSection(sectionId: string | null) {
  if (!sectionId) return undefined;
  return contractOutline.find((section) => section.id === sectionId);
}
