import * as d3 from "d3";
import { getType } from "typesafe-actions";
import { actionOverview } from "../action/overview-actions";
import { ReducibleAction } from "../action/root-action";
import { OverviewState, PaperEntry } from "../state/overview";

const defaultOverviewState: OverviewState = {
  paperEntries: [],
  keywords: [],
  seedPapers: [],
  markedPapers: [],
};

function scoreOfEntry(entry: PaperEntry) {
  const keywordSim = d3.sum(entry.keywordSims);
  const seedPaperSim = d3.sum(entry.seedPaperSims);
  const score = keywordSim + seedPaperSim;
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
        const a = (entry.title + entry.abstract).toLowerCase().split(" ");
        const b = (seed.title + seed.abstract).toLowerCase().split(" ");
        return a.filter((x) => b.includes(x)).length;
      });
      newEntry = { ...newEntry, seedPaperSims };
    }
    newEntry = { ...newEntry, score: scoreOfEntry(newEntry) };
    return newEntry;
  });
  const filtered = updated.filter(
    (entry) => !state.seedPapers.map((e) => e.doi).includes(entry.doi)
  );
  const sorted = filtered.sort((a, b) => b.score - a.score);
  const truncated = sorted.slice(0, 50);
  return truncated;
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
