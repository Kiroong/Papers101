export interface PaperEntry {
  abstract: string;
  author: string[];
  doi: string;
  conference: string;
  keywords: string[];
  referencedBy: string[];
  referencing: string[];
  title: string;
  year: number;
  // ============= //
  numReferenced: number;
  numReferencing: number;
  // ============= //
  recentlyPublished: number;
  citation: number;
  keywordSims: number[];
  seedPaperSims: number[];
  referencedBySeedPapers: number[];
  referencesSeedPapers: number[];
  score: number;
  [additionalColumn: string]: any;
}

export interface Weights {
  recentlyPublished: {
    weight: number;
  };
  citation: {
    weight: number;
  };
  keywordSimilarity: {
    weight: number;
  };
  seedPaperSimilarity: {
    weight: number;
  };
  referencedBySeedPapers: {
    weight: number;
  };
  referencesSeedPapers: {
    weight: number;
  };
  mode: null | 'year' | 'year-ascending' | 'citation' | 'keyword' | 'seed' | 'referenced-by-seed' | 'references-seed';
}

export interface OverviewState {
  originalPaperEntries: PaperEntry[];
  paperEntries: PaperEntry[];
  markedPapers: PaperEntry[];
  seedPapers: PaperEntry[];
  keywords: string[];
  histories: OverviewState[];
  weights: Weights;

  //==============//
  seedPaperSimsCache: { [doi: string]: { [doi: string]: number } };
  // ============ //
  filter: EntryFilter | null;
}

export interface EntryFilter {
  year: {
    from: number,
    to: number,
  },
  authors: string[],
}
