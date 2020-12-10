import { stopwords } from "./stopwords";

export function maxOfSum(values: number[][]) {
  return values.reduce(
    (a, b) =>
      Math.max(
        a,
        b.reduce((x, y) => x + y, 0)
      ),
    0
  );
}

export function extractKeywords(content: string) {
  return content.split(' ')
    .map((word) => word.toLowerCase().replace(/[^a-zA-Z\-]/g, ""))
    .filter((word) => word.length >= 2 && !stopwords.has(word.toLowerCase()))
}