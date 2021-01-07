import * as d3 from "d3";
import { getType } from "typesafe-actions";
import { extractKeywords, maxOfSum } from "../../utils";
import { actionOverview } from "../action/overview-actions";
import { ReducibleAction } from "../action/root-action";
import { OverviewState, PaperEntry } from "../state/overview";

const defaultOverviewState: OverviewState = {
  originalPaperEntries: [],
  paperEntries: [],
  keywords: [],
  seedPapers: [],
  markedPapers: [],
  histories: [],
  seedPaperSimsCache: {},
  weights: {
    recentlyPublished: {
      maxVal: 0.5,
    },
    citation: {
      maxVal: 0.5,
    },
    keywordSimilarity: {
      maxVal: 1,
      components: [],
    },
    referencedBySeedPapers: {
      maxVal: 1,
      components: [],
    },
    referencesSeedPapers: {
      maxVal: 1,
      components: [],
    },
    seedPaperSimilarity: {
      maxVal: 1,
      components: [],
    },
  },
  filter: null,
};

function updateSortedPaperEntries(
  state: OverviewState,
  updateKeywordSims: boolean,
  updateSeedPaperSims: boolean
) {
  let filtered = state.paperEntries;
  if (state.filter) {
    filtered = state.originalPaperEntries.filter(entry => state.filter!.year.from <= entry.year && entry.year <= state.filter!.year.to);
    if (state.filter!.authors.length) {
      filtered = filtered.filter(entry => {
        for(const author of state.filter!.authors) {
          if (entry.author.includes(author)) {
            return true;
          }
        }
        return false;
      })
    }
    updateKeywordSims = true;
    updateSeedPaperSims = true;
  }
  const updated = filtered.map((entry) => {
    const seedPaperSimsCache = state.seedPaperSimsCache; // going to mutate it as it's cache
    let newEntry = { ...entry };
    if (updateKeywordSims) {
      const keywordSims = state.keywords.map((keyword) =>
        Math.min(5, keyword
          .split("zxcvzxxc")
          .map(
            (word) =>
              (entry.title + ' ' + entry.abstract)
                .toLowerCase()
                .split(word.toLowerCase()).length - 1
          )
          .reduce((a, b) => a + b)) / 5
      );
      newEntry = { ...newEntry, keywordSims };
    }
    if (updateSeedPaperSims) {
      const seedPaperSims = state.seedPapers.map((seed) => {
        if (!(seed.doi in seedPaperSimsCache)) {
          seedPaperSimsCache[seed.doi] = {};
        }
        if (!seedPaperSimsCache[seed.doi][entry.doi]) {
          const a = new Set(
            extractKeywords(entry.title + " " + entry.abstract)
          );
          const b = new Set(extractKeywords(seed.title + " " + seed.abstract));
          const [union, intersection] = [
            new Set<string>([]),
            new Set<string>([]),
          ];
          a.forEach((w) => union.add(w));
          b.forEach((w) => union.add(w));
          a.forEach((w) => b.has(w) && intersection.add(w));
          seedPaperSimsCache[seed.doi][entry.doi] =
            intersection.size / union.size;
        }
        return seedPaperSimsCache[seed.doi][entry.doi];
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
    return newEntry;
  });

  const recentlyPublishedMax = updated
    .map((entry) => entry.recentlyPublished)
    .reduce((a, b) => Math.max(a, b), 0);
  const citationMax = updated
    .map((entry) => entry.numReferenced)
    .reduce((a, b) => Math.max(a, b), 0);
  const keywordSimsMaxOfSum = maxOfSum(
    updated.map((entry) => entry.keywordSims)
  );
  const withoutSeedPapers = updated.filter(
    (entry) => !state.seedPapers.map((d) => d.doi).includes(entry.doi)
  );
  const seedPaperSimsMaxOfSum =
    maxOfSum(withoutSeedPapers.map((entry) => entry.seedPaperSims)) || 1;
  const referencedBySeedPapersMaxOfSum =
    maxOfSum(withoutSeedPapers.map((entry) => entry.referencedBySeedPapers)) ||
    1;
  const referencesSeedPapersMaxOfSum =
    maxOfSum(withoutSeedPapers.map((entry) => entry.referencesSeedPapers)) || 1;

  const normalized = updated.map((entry) => ({
    ...entry,
    recentlyPublished: entry.recentlyPublished / recentlyPublishedMax,
    citation: entry.numReferenced / citationMax,
    keywordSims: entry.keywordSims.map((sim) => sim / keywordSimsMaxOfSum),
    seedPaperSims: entry.seedPaperSims.map(
      (sim) => sim / seedPaperSimsMaxOfSum
    ),
    referencedBySeedPapers: entry.referencedBySeedPapers.map(
      (sim) => sim / referencedBySeedPapersMaxOfSum
    ),
    referencesSeedPapers: entry.referencesSeedPapers.map(
      (sim) => sim / referencesSeedPapersMaxOfSum
    ),
  }));

  const inner = (as: number[], bs: number[]) =>
    as.reduce((acc, a, i) => acc + a * bs[i], 0);

  const withScore = normalized.map((entry) => ({
    ...entry,
    score:
      entry.recentlyPublished * state.weights.recentlyPublished.maxVal +
      entry.citation * state.weights.citation.maxVal +
      inner(
        entry.keywordSims,
        state.weights.keywordSimilarity.components.map(
          (comp) => comp.weight / 100
        )
      ) *
        state.weights.keywordSimilarity.maxVal +
      inner(
        entry.seedPaperSims,
        state.weights.seedPaperSimilarity.components.map(
          (comp) => comp.weight / 100
        )
      ) *
        state.weights.seedPaperSimilarity.maxVal +
      inner(
        entry.referencesSeedPapers,
        state.weights.referencesSeedPapers.components.map(
          (comp) => comp.weight / 100
        )
      ) *
        state.weights.referencesSeedPapers.maxVal +
      inner(
        entry.referencedBySeedPapers,
        state.weights.referencedBySeedPapers.components.map(
          (comp) => comp.weight / 100
        )
      ) *
        state.weights.referencedBySeedPapers.maxVal,
  }));

  if (state.keywords.length === 0 && state.seedPapers.length === 0) {
    return withScore;
  } else {
    const sorted = withScore.sort((a, b) =>
      a.score === b.score ? b.year - a.year : b.score - a.score
    );
    return sorted;
  }
}

export const overviewReducer = (
  state: OverviewState = defaultOverviewState,
  action: ReducibleAction
): OverviewState => {
  switch (action.type) {
    case getType(actionOverview.getData.complete):
      const paperEntries = action.payload.map((entry) => ({
        ...entry,
        recentlyPublished: entry.year - 1980,
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
        originalPaperEntries: paperEntries,
        paperEntries,
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, false, false),
      };
    case getType(actionOverview.setKeywords): {
      const keywords = action.payload;

      const nextState: OverviewState = {
        ...state,
        keywords,
        weights: {
          ...state.weights,
          keywordSimilarity: {
            maxVal: 1,
            components: keywords.map((keyword) => ({
              keyword,
              weight: Math.floor((1 / keywords.length) * 100),
            })),
          },
        },
        histories: [...state.histories, state],
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, true, false),
      };
    }
    case getType(actionOverview.setSeedPapers): {
      const seedPapers = action.payload;
      const nextState: OverviewState = {
        ...state,
        seedPapers,
        weights: {
          ...state.weights,
          seedPaperSimilarity: {
            ...state.weights.seedPaperSimilarity,
            components: seedPapers.map((entry) => ({
              entry,
              weight: Math.floor((1 / seedPapers.length) * 100),
            })),
          },
          referencedBySeedPapers: {
            ...state.weights.referencedBySeedPapers,
            components: seedPapers.map((entry) => ({
              entry,
              weight: Math.floor((1 / seedPapers.length) * 100),
            })),
          },
          referencesSeedPapers: {
            ...state.weights.referencesSeedPapers,
            components: seedPapers.map((entry) => ({
              entry,
              weight: Math.floor((1 / seedPapers.length) * 100),
            })),
          },
        },
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, false, true),
        histories: [...state.histories, state],
      };
    }
    case getType(actionOverview.setMarkedPapers):
      const markedPapers = action.payload;
      return {
        ...state,
        markedPapers,
      };
    case getType(actionOverview.setHistories):
      const histories = action.payload;
      return {
        ...state,
        histories,
      };
    case getType(actionOverview.selectHistory):
      const history = action.payload;
      return history;
    case getType(actionOverview.setWeights): {
      const weights = action.payload;
      const nextState: OverviewState = {
        ...state,
        weights,
        histories: [...state.histories, state],
      };
      return {
        ...nextState,
        paperEntries: updateSortedPaperEntries(nextState, false, false),
      };
    }
    default:
      return state;
    case getType(actionOverview.setFilter):
      {
        const filter = action.payload;
        const nextState: OverviewState = {
          ...state,
          filter,
          histories: [...state.histories, state],
        }
        return {
          ...nextState,
          paperEntries: updateSortedPaperEntries(nextState, false, false),
        }
      }
  }
};
