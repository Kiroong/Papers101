import { useSelector } from "react-redux";
import { OverviewState } from "./overview";

export interface RootState {
  overview: OverviewState;
}

export function useRootSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}
