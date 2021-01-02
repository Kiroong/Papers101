import { Box, Card, Grid } from "grommet";
import React from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import CitationRelationshipView from "./CitationRelationshipView";
import PaperDetailView from "./PaperDetailView";
import PapersTabularView from "./PapersTabularView";
import SearchBox from "./SearchBox";
import SummaryView from "./SummaryView";

const Overview: React.FC = () => {
  const paperEntries = useRootSelector(state => state.overview.paperEntries)
  const dispatch = useThunkDispatch();
  if (!paperEntries.length) {
    dispatch(actionOverview.getData.thunk())
  }
  return (
    <Grid fill={true} columns={["2fr", "10fr", "2fr"]}>
      <Box fill={true}>
        <SearchBox />
      </Box>
      <Box fill={true}>
        <Grid fill={true} rows={["1fr", "1fr"]}>
          <PapersTabularView />
          <Box fill={true}>
            <Grid fill={true} columns={["1fr", "1fr"]}>
              <CitationRelationshipView />
              <PaperDetailView />
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Box fill={true}>
        <SummaryView />
      </Box>
    </Grid>
  );
};

export default Overview;
