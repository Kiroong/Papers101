export interface PaperEntry {
  abstract: string;
  author: string[];
  doi: string;
  keywords: string[];
  referencedBy: string[];
  referencing: string[];
  title: string;
  year: number;
}

export interface OverviewState {
  paperEntries: PaperEntry[] | null;
  seedPapers: PaperEntry[];
  keywords: string[];
}
