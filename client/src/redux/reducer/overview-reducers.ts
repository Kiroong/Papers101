import * as d3 from "d3";
import { getType } from "typesafe-actions";
import { actionOverview } from "../action/overview-actions";
import { ReducibleAction } from "../action/root-action";
import { OverviewState, PaperEntry } from "../state/overview";

const defaultOverviewState: OverviewState = {
  paperEntries: null,
  keywords: [],
  seedPapers: [],
  markedPapers: [],
};

function sortPaperEntries(paperEntries: PaperEntry[]) {
  return paperEntries.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    } else {
      return b.year - a.year;
    }
  });
}

function modifyScoreFromEntry(entry: PaperEntry) {
  const keywordSim = d3.sum(entry.keywordSims);
  const seedPaperSim = d3.sum(entry.seedPaperSims);
  const score = keywordSim + seedPaperSim;
  return {
    ...entry,
    score,
  };
}

export const overviewReducer = (
  state: OverviewState = defaultOverviewState,
  action: ReducibleAction
): OverviewState => {
  switch (action.type) {
    case getType(actionOverview.getData.complete):
      return {
        ...state,
        paperEntries: sortPaperEntries(
          action.payload
            .map((entry) => ({
              ...entry,
              referencedBy: entry.referenced_by,
              numReferencing: entry.referencing.length,
              numReferenced: entry.referenced_by.length,
              keywordSims: [],
              seedPaperSims: [],
              score: 0,
            }))
            .filter((entry) => !state.seedPapers.includes(entry))
        ),
      };
    case getType(actionOverview.setKeywords):
      const keywords = action.payload;
      return {
        ...state,
        keywords,
        paperEntries: sortPaperEntries(
          state.paperEntries
            ?.map((entry) => {
              const keywordSims = keywords.map(
                (keyword) =>
                  (entry.title + entry.abstract)
                    .toLowerCase()
                    .split(keyword.toLowerCase()).length - 1
              );
              return modifyScoreFromEntry({
                ...entry,
                keywordSims,
              });
            })
            .filter((entry) => !state.seedPapers.includes(entry)) || []
        ),
      };
    case getType(actionOverview.setSeedPapers):
      const seedPapers = action.payload;
      return {
        ...state,
        seedPapers,
        paperEntries: sortPaperEntries(
          state.paperEntries
            ?.map((entry) => {
              const seedPaperSims = seedPapers.map((seed) => {
                const a = (entry.title + entry.abstract)
                  .toLowerCase()
                  .split(" ");
                const b = (seed.title + seed.abstract).toLowerCase().split(" ");
                return a.filter((x) => b.includes(x)).length;
              });
              return modifyScoreFromEntry({
                ...entry,
                seedPaperSims,
              });
            })
            .filter((entry) => !seedPapers.includes(entry)) || []
        ),
      };
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
