import { createAction } from "typesafe-actions";
import { EntryFilter, OverviewState, PaperEntry, Weights } from "../state/overview";
import { getData } from "./api/api";
import { makeThunk } from "./utils";

const unitActions = {
  setKeywords: createAction(
    "OVERVIEW/SET_KEYWORDS",
    (keywords: string[]) => keywords
  )(),
  setSeedPapers: createAction(
    "OVERVIEW/SET_SEED_PAPERS",
    (seedPapers: PaperEntry[]) => seedPapers
  )(),
  setMarkedPapers: createAction(
    "OVERVIEW/SET_MARKED_PAPERS",
    (markedPapers: PaperEntry[]) => markedPapers
  )(),
  setHistories: createAction(
    "OVERVIEW/SET_HISTORIES",
    (histories: OverviewState[]) => histories
  )(),
  setWeights: createAction(
    "OVERVIEW/SET_WEIGHTS",
    (weights: Weights) => weights
  )(),
  selectHistory: createAction(
    "OVERVIEW/SELECT_HISTORY",
    (history: OverviewState) => history
  )(),
  setFilter: createAction(
    "OVERVIEW/SET_FILTER",
    (filter: EntryFilter | null) => filter
  )(),

};

const thunkActions = {
  getData: makeThunk(
    "OVERVIEW/GET_DATA/fetch",
    "OVERVIEW/GET_DATA/complete",
    () => ({
      request: {},
      response: () => getData(),
    })
  ),
};

type ThunkActionObject = typeof thunkActions;
type UnitActionObject = typeof unitActions;
type ThunkAction = ThunkActionObject[keyof ThunkActionObject];
type UnitAction = UnitActionObject[keyof UnitActionObject];

export const actionOverview = { ...thunkActions, ...unitActions };
export type OverviewActionReducible = ReturnType<
  ThunkAction["fetch"] | ThunkAction["complete"] | UnitAction
>;
export type OverviewActionDispatchable = ReturnType<
  ThunkAction["thunk"] | UnitAction
>;
