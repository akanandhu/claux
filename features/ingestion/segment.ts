import type {
  ContractClause,
  ParsedDocument,
  SourceSpan,
} from "../../schemas/contract.ts";
import { contractClauseSchema } from "../../schemas/contract.ts";
import { IngestionError } from "./errors.ts";
import { normalizeContractText, slugify, stableHash } from "./text.ts";

type ClauseBlock = {
  number?: string;
  title?: string;
  text: string;
  startOffset: number;
  endOffset: number;
  pageStart: number;
  pageEnd: number;
  sourceSpanIds: string[];
};

const numberedClausePattern =
  /^((?:\d+|[A-Z])(?:\.\d+)*\.?|\([a-z0-9ivx]+\))\s+([A-Z][^\n]{1,140})/;
const headingPattern = /^[A-Z][A-Z0-9 ,'"()&/-]{5,120}$/;
const referencePattern =
  /\b(?:section|clause|schedule|article)\s+(\d+(?:\.\d+)*)\b/gi;
const legalVerbPattern =
  /\b(shall|must|will|agrees?|undertakes?|represents?|warrants?|may|is required to|prohibited|liable|indemnif(?:y|ies)|terminate|confidential)\b/i;

export function segmentContractClauses(document: ParsedDocument): ContractClause[] {
  const spans = document.sourceSpans.length
    ? document.sourceSpans
    : document.pages.map((page) => ({
        id: `p${page.pageNumber}`,
        pageNumber: page.pageNumber,
        sectionPath: [],
        startOffset: page.startOffset,
        endOffset: page.endOffset,
        text: page.rawText,
      }));
  const blocks = collectClauseBlocks(spans);
  const clauses = blocks.map((block, index) => {
    const label = block.number ?? block.title ?? `clause-${index + 1}`;
    const id = `clause-${slugify(label)}-${stableHash(`${block.startOffset}:${block.text}`)}`;
    const explicitReferenceIds = [...block.text.matchAll(referencePattern)].map(
      (match) => `clause-${slugify(match[1]!)}`,
    );

    return contractClauseSchema.parse({
      id,
      number: block.number,
      title: block.title,
      text: block.text,
      normalizedText: normalizeContractText(block.text),
      level: inferLevel(block.number),
      pageStart: block.pageStart,
      pageEnd: block.pageEnd,
      startOffset: block.startOffset,
      endOffset: block.endOffset,
      explicitReferenceIds,
      sourceSpanIds: block.sourceSpanIds,
    });
  });

  if (clauses.length === 0 || clauses.every((clause) => !legalVerbPattern.test(clause.text))) {
    throw new IngestionError(
      "No clause-like legal content was found in the extracted text.",
      "no_clauses",
    );
  }

  return clauses;
}

function collectClauseBlocks(spans: SourceSpan[]) {
  const blocks: ClauseBlock[] = [];
  let current: ClauseBlock | null = null;

  for (const span of spans) {
    const text = span.text.trim();
    if (!text) continue;

    const clauseStart = parseClauseStart(text);
    const startsClause = Boolean(clauseStart) || (isHeading(text) && !current);

    if (startsClause) {
      if (current) blocks.push(current);

      current = {
        number: clauseStart?.number,
        title: clauseStart?.title ?? (isHeading(text) ? text : undefined),
        text: span.text,
        startOffset: span.startOffset,
        endOffset: span.endOffset,
        pageStart: span.pageNumber ?? 1,
        pageEnd: span.pageNumber ?? 1,
        sourceSpanIds: [span.id],
      };
      continue;
    }

    if (!current) {
      current = {
        text: span.text,
        startOffset: span.startOffset,
        endOffset: span.endOffset,
        pageStart: span.pageNumber ?? 1,
        pageEnd: span.pageNumber ?? 1,
        sourceSpanIds: [span.id],
      };
      continue;
    }

    current.text = `${current.text}\n${span.text}`;
    current.endOffset = span.endOffset;
    current.pageEnd = span.pageNumber ?? current.pageEnd;
    current.sourceSpanIds.push(span.id);
  }

  if (current) blocks.push(current);

  return blocks.filter((block) => isClauseLike(block));
}

function parseClauseStart(text: string) {
  const match = text.match(numberedClausePattern);
  if (!match) return null;

  return {
    number: match[1]!.replace(/\.$/, ""),
    title: match[2]!.trim(),
  };
}

function isHeading(text: string) {
  return headingPattern.test(text.trim()) && text.trim().split(/\s+/).length <= 12;
}

function isClauseLike(block: ClauseBlock) {
  const normalized = normalizeContractText(block.text);

  return (
    Boolean(block.number) ||
    legalVerbPattern.test(normalized) ||
    /\b(definitions?|payment|term|termination|confidential|liability|law)\b/i.test(
      normalized,
    )
  );
}

function inferLevel(number?: string) {
  if (!number) return 1;
  if (number.startsWith("(")) return 3;
  return Math.min(number.split(".").length, 6);
}
