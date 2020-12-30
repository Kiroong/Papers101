import { useSelector } from "react-redux";
import { OverviewState, PaperEntry } from "./overview";

export interface RootState {
  overview: OverviewState;
  hoveredEntry: PaperEntry | null;
}

export function useRootSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}
