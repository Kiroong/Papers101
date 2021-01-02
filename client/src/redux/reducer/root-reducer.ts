import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { ReducibleAction, setHoveredEntry, setSelectedEntry } from "../action/root-action";
import { PaperEntry } from "../state/overview";
import { UIState } from "../state/root-state";
import { overviewReducer } from "./overview-reducers";

const defaultUIState: UIState = {
  hoveredEntry: null,
  selectedEntry: null,
}

const uiReducer = (
  state: UIState = defaultUIState,
  action: ReducibleAction
) => {
  switch (action.type) {
    case getType(setHoveredEntry):
      return {
        ...state,
        hoveredEntry: action.payload
      };
    case getType(setSelectedEntry):
      return {
        ...state,
        selectedEntry: action.payload
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  overview: overviewReducer,
  ui: uiReducer,
});
