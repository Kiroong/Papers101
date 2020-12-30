import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { ReducibleAction, setHoveredEntry } from "../action/root-action";
import { PaperEntry } from "../state/overview";
import { overviewReducer } from "./overview-reducers";

const hoveredEntryReducer = (
  state: PaperEntry | null = null,
  action: ReducibleAction
) => {
  switch (action.type) {
    case getType(setHoveredEntry):
      return action.payload;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  overview: overviewReducer,
  hoveredEntry: hoveredEntryReducer,
});
