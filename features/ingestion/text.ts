export function normalizeContractText(text: string) {
  return text
    .normalize("NFKC")
    .replace(/\u00ad/g, "")
    .replace(/-\s*\n\s*/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "item";
}

export function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function findLineNumber(text: string, offset: number) {
  let line = 1;

  for (let index = 0; index < offset && index < text.length; index += 1) {
    if (text[index] === "\n") line += 1;
  }

  return line;
}
