import { Box, Grid } from "grommet";
import React from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import PapersTabularView from "./PapersTabularView";
import SearchBox from "./SearchBox";
import SummaryView from "./SummaryView";

const Overview: React.FC = () => {
  const paperEntries = useRootSelector(state => state.overview.paperEntries)
  const dispatch = useThunkDispatch();
  if (!paperEntries) {
    dispatch(actionOverview.getData.thunk())
  }
  console.log({ data: paperEntries })
  return (
    <Grid fill={true} columns={["small", "1fr", "small"]} rows={["large"]}>
      <Box fill={true}>
        <SearchBox />
      </Box>
      <Box fill={true}>
        <PapersTabularView />
      </Box>
      <Box fill={true}>
        <SummaryView />
      </Box>
    </Grid>
  );
};

export default Overview;
