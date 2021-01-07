import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { createAction } from "typesafe-actions";
import { PaperEntry } from "../state/overview";
import {
  OverviewActionDispatchable,
  OverviewActionReducible,
} from "./overview-actions";

export const setHoveredEntry = createAction(
  "SET_HOVERED_ENTRY",
  (paperEntry: PaperEntry) => paperEntry
)();

export const setSelectedEntry = createAction(
  "SET_SELECTED_ENTRY",
  (paperEntry: PaperEntry) => paperEntry
)();

export type ReducibleAction =
  | OverviewActionReducible
  | ReturnType<typeof setHoveredEntry>
  | ReturnType<typeof setSelectedEntry>;

export type DispatchableAction =
  | OverviewActionDispatchable
  | ReturnType<typeof setHoveredEntry>
  | ReturnType<typeof setSelectedEntry>;

type CustomDispatch = Dispatch<DispatchableAction>;
export const useThunkDispatch = () => useDispatch<CustomDispatch>();
