export function splitParagraphs(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function firstParagraph(body: string): string {
  return splitParagraphs(body)[0] ?? "";
}
