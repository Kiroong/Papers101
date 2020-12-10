import { combineReducers } from "redux";
import { overviewReducer } from "./overview-reducers";
export const rootReducer = combineReducers({
  overview: overviewReducer,
});
