import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Box, Button, Card, Grid, Heading, Text } from "grommet";
import React, { useEffect, useMemo, useState } from "react";
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
  const [shouldUpdateCohesiveness, setShouldUpdateCohesiveness] = useState(
    false
  );
  const [calcPercentage, setCalcPercentage] = useState(-1);
  const [cohesivenesses, setCohesivenesses] = useState([] as number[]);
  useEffect(() => {
    if (shouldUpdateCohesiveness) {
      setShouldUpdateCohesiveness(false);
      const _cohesivenesses = seedPapers.map((entry, i) => {
        setCalcPercentage(i / seedPapers.length);
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
      setCalcPercentage(-1);
      setCohesivenesses(_cohesivenesses);
    }
  }, [seedPapers, keywords, weights, shouldUpdateCohesiveness]);

  return (
    <Card>
      <Box fill={true} height={{ min: "0px" }}>
        <Grid fill={true} pad="small" rows={["auto", "1fr"]}>
          <Box direction="row" align="baseline" gap="small">
            <Heading level="5">Citation Relationship</Heading>
            <Popup
              trigger={
                <Button
                  size="small"
                  color="blue"
                  onClick={() => {
                    setShouldUpdateCohesiveness(true);
                  }}
                >
                  Update Cohesiveness
                </Button>
              }
              on={["hover"]}
            >
              High cohesiveness indicates that, the paper should be still ranked
              high when it is excluded from the seed paper set. This operation
              might be slow when there are many seed papers. The higher the
              cohesiveness, the darker the color of the node.
            </Popup>
          </Box>
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
