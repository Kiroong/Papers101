import { Box, Card, Grid, Heading, Text } from "grommet";
import React, { useMemo } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { overviewReducer } from "../redux/reducer/overview-reducers";
import { useRootSelector } from "../redux/state/root-state";
import NetworkView from "./NetworkView";

const CitationRelationshipView = () => {
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const weights = useRootSelector((state) => state.overview.weights);
  const selectedEntry = useRootSelector((state) => state.ui.selectedEntry);
  const overviewState = useRootSelector((state) => state.overview);
  const cohesivenesses = useMemo(() => {
    return seedPapers.map((entry) => {
      const withoutThis = overviewReducer(
        overviewState,
        actionOverview.setSeedPapers(
          seedPapers.filter((p) => p.doi !== entry.doi)
        )
      );
      const index = withoutThis.paperEntriesToShow
        .map((p) => p.doi)
        .indexOf(entry.doi);
      console.log({ entry, withoutThis, index });
      return (30 - (index >= 0 ? index : 30)) / 30;
    });
  }, [seedPapers, keywords, weights]);

  return (
    <Card>
      <Box fill={true} height={{ min: "0px" }}>
        <Grid fill={true} pad="small" rows={["auto", "1fr"]}>
          <Heading level="5">Citation Relationship</Heading>
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NetworkView
              seedPapers={seedPapers}
              selectedEntry={selectedEntry}
              cohesivenesses={cohesivenesses}
            />
          </div>
        </Grid>
      </Box>
    </Card>
  );
};

export default CitationRelationshipView;
