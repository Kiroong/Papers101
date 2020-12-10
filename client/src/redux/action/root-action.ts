import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import {
  OverviewActionDispatchable,
  OverviewActionReducible,
} from "./overview-actions";

export type ReducibleAction = OverviewActionReducible;

export type DispatchableAction = OverviewActionDispatchable;

type CustomDispatch = Dispatch<DispatchableAction>;
export const useThunkDispatch = () => useDispatch<CustomDispatch>();
