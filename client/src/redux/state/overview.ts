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

export interface Weights {
  keywordSimilarity: {
    maxVal: number;
    components: { keyword: string; weight: number }[];
  };
  seedPaperSimilarity: {
    maxVal: number;
    components: { entry: PaperEntry; weight: number }[];
  };
  referencedBySeedPapers: {
    maxVal: number;
    components: { entry: PaperEntry; weight: number }[];
  };
  referencesSeedPapers: {
    maxVal: number;
    components: { entry: PaperEntry; weight: number }[];
  };
}

export interface OverviewState {
  paperEntries: PaperEntry[];
  markedPapers: PaperEntry[];
  seedPapers: PaperEntry[];
  keywords: string[];
  histories: OverviewState[];
  weights: Weights;

  //==============//
  seedPaperSimsCache: { [doi: string]: { [doi: string]: number } };
}
