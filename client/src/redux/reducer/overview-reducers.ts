import * as d3 from "d3";
import { getType } from "typesafe-actions";
import { extractKeywords } from "../../utils";
import { actionOverview } from "../action/overview-actions";
import { ReducibleAction } from "../action/root-action";
import { OverviewState, PaperEntry } from "../state/overview";

const defaultOverviewState: OverviewState = {
  paperEntries: [],
  keywords: [],
  seedPapers: [],
  markedPapers: [],
  histories: [],
};

function scoreOfEntry(entry: PaperEntry) {
  const keywordSim = d3.sum(entry.keywordSims);
  const seedPaperSim = d3.sum(entry.seedPaperSims);
  const referencesSeedPapers = d3.sum(entry.referencesSeedPapers);
  const referencedBySeedPapers = d3.sum(entry.referencedBySeedPapers);
  // const score = keywordSim + seedPaperSim + referencedBySeedPapers + referencesSeedPapers;
  const score = keywordSim + referencedBySeedPapers + referencesSeedPapers;
  return score;
}

function updateSortedPaperEntries(
  state: OverviewState,
  updateKeywordSims: boolean,
  updateSeedPaperSims: boolean
) {
  const updated = state.paperEntries.map((entry) => {
    let newEntry = { ...entry };
    if (updateKeywordSims) {
      const keywordSims = state.keywords.map(
        (keyword) =>
          (entry.title + entry.abstract)
            .toLowerCase()
            .split(keyword.toLowerCase()).length - 1
      );
      newEntry = { ...newEntry, keywordSims };
    }
    if (updateSeedPaperSims) {
      const seedPaperSims = state.seedPapers.map((seed) => {
        const a = new Set(extractKeywords(entry.title + " " + entry.abstract));
        const b = new Set(extractKeywords(seed.title + " " + seed.abstract));
        const [union, intersection] = [
          new Set<string>([]),
          new Set<string>([]),
        ];
        a.forEach((w) => union.add(w));
        b.forEach((w) => union.add(w));
        a.forEach((w) => b.has(w) && intersection.add(w));
        return intersection.size / union.size;
      });
      const referencedBySeedPapers = state.seedPapers.map((seed) => {
        return newEntry.referencedBy.includes(seed.doi) ? 1 : 0;
      });
      const referencesSeedPapers = state.seedPapers.map((seed) => {
        return newEntry.referencing.includes(seed.doi) ? 1 : 0;
      });
      newEntry = {
        ...newEntry,
        seedPaperSims,
        referencedBySeedPapers,
        referencesSeedPapers,
      };
    }
    newEntry = { ...newEntry, score: scoreOfEntry(newEntry) };
    return newEntry;
  });
  const sorted = updated.sort((a, b) =>
    a.score === b.score ? b.year - a.year : b.score - a.score
  );
  return sorted;
}

export const overviewReducer = (
  state: OverviewState = defaultOverviewState,
  action: ReducibleAction
): OverviewState => {
  switch (action.type) {
    case getType(actionOverview.getData.complete):
      const paperEntries = action.payload.map((entry) => ({
        ...entry,
        referencedBy: entry.referenced_by,
        numReferencing: entry.referencing.length,
        numReferenced: entry.referenced_by.length,
        keywordSims: [],
        seedPaperSims: [],
        referencedBySeedPapers: [],
        referencesSeedPapers: [],
        score: 0,
      }));
      const nextState = {
        ...state,
        paperEntries,
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, false, false),
      };
    case getType(actionOverview.setKeywords): {
      const keywords = action.payload;

      const nextState = {
        ...state,
        keywords,
        histories: [...state.histories, state],
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, true, false),
      };
    }
    case getType(actionOverview.setSeedPapers): {
      const seedPapers = action.payload;
      const nextState = {
        ...state,
        seedPapers,
        histories: [...state.histories, state],
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, false, true),
      };
    }
    case getType(actionOverview.setMarkedPapers):
      const markedPapers = action.payload;
      return {
        ...state,
        markedPapers,
      };
    default:
      return state;
  }
};
