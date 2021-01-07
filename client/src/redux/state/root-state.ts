import { useSelector } from "react-redux";
import { OverviewState, PaperEntry } from "./overview";

export interface UIState {
  hoveredEntry: PaperEntry | null;
  selectedEntry: PaperEntry | null;
}

export interface RootState {
  overview: OverviewState;
  ui: UIState;
}

export function useRootSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}
