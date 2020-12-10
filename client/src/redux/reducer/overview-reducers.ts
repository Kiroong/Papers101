import { getType } from "typesafe-actions";
import { actionOverview } from "../action/overview-actions";
import { ReducibleAction } from "../action/root-action";
import { OverviewState } from "../state/overview";

const defaultOverviewState: OverviewState = {
  paperEntries: null,
  keywords: [],
  seedPapers: [],
};

export const overviewReducer = (
  state: OverviewState = defaultOverviewState,
  action: ReducibleAction
): OverviewState => {
  switch (action.type) {
    case getType(actionOverview.getData.complete):
      return {
        ...state,
        paperEntries: action.payload.map(entry => ({
          ...entry,
          referencedBy: entry.referenced_by,
          numReferencing: entry.referencing.length,
          numReferenced: entry.referenced_by.length,
          score: entry.year
        })),
      };
    case getType(actionOverview.setKeywords):
      return {
        ...state,
        keywords: action.payload,
      }
    case getType(actionOverview.setSeedPapers):
      return {
        ...state,
        seedPapers: action.payload,
      }
    default:
      return state;
  }
};
