export interface PaperEntry {
  abstract: string;
  author: string[];
  doi: string;
  keywords: string[];
  referencedBy: string[];
  referencing: string[];
  title: string;
  year: number;
  // ============= //
  numReferenced: number;
  numReferencing: number;
  // ============= //
  keywordSims: number[];
  seedPaperSims: number[];
  referencedBySeedPapers: number[];
  referencesSeedPapers: number[];
  score: number;
  [additionalColumn: string]: any;
}


export interface OverviewState {
  paperEntries: PaperEntry[];
  markedPapers: PaperEntry[];
  seedPapers: PaperEntry[];
  keywords: string[];
}
