import { Box, Button, Grid } from "grommet";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";

const AdjustWeightModal: React.FC = () => {
  const weights = useRootSelector((state) => state.overview.weights);
  const dispatch = useThunkDispatch();
  return (
    <Box direction="column" pad="medium">
      <Grid columns={["1fr", "1fr"]} gap="small">
        <div>Keyword Similarities</div>
        <input
          type="number"
          value={weights.keywordSimilarity.maxVal}
          onChange={(e) => (weights.keywordSimilarity.maxVal = +e.target.value)}
        />
        {weights.keywordSimilarity.components.map(({ keyword, weight }, i) => (
          <>
            <div style={{ paddingLeft: 40 }}>{keyword}</div>
            <input
              style={{ marginLeft: 40 }}
              value={weight}
              onChange={(e) =>
                (weights.keywordSimilarity.components[i].weight = +e.target
                  .value)
              }
            />
          </>
        ))}

        <div>Seed paper Similarities</div>
        <input
          type="number"
          value={weights.seedPaperSimilarity.maxVal}
          onChange={(e) =>
            (weights.seedPaperSimilarity.maxVal = +e.target.value)
          }
        />
        {weights.seedPaperSimilarity.components.map(({ entry, weight }, i) => (
          <>
            <div
              style={{
                paddingLeft: 40,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {entry.title}
            </div>
            <input
              style={{ marginLeft: 40 }}
              value={weight}
              onChange={(e) =>
                (weights.seedPaperSimilarity.components[i].weight = +e.target
                  .value)
              }
            />
          </>
        ))}

        <div>Referenced by Seed papers</div>
        <input
          type="number"
          value={weights.referencedBySeedPapers.maxVal}
          onChange={(e) =>
            (weights.referencedBySeedPapers.maxVal = +e.target.value)
          }
        />
        {weights.referencedBySeedPapers.components.map(({ entry, weight }, i) => (
          <>
            <div
              style={{
                paddingLeft: 40,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {entry.title}
            </div>
            <input style={{ marginLeft: 40 }} value={weight}
              onChange={(e) =>
                (weights.referencedBySeedPapers.components[i].weight = +e.target
                  .value)
              }
            />
          </>
        ))}

        <div>References Seed papers</div>
        <input
          type="number"
          value={weights.referencesSeedPapers.maxVal}
          onChange={(e) =>
            (weights.referencesSeedPapers.maxVal = +e.target.value)
          }
        />
        {weights.referencesSeedPapers.components.map(({ entry, weight }, i) => (
          <>
            <div
              style={{
                paddingLeft: 40,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {entry.title}
            </div>
            <input style={{ marginLeft: 40 }} value={weight} 
              onChange={(e) =>
                (weights.referencesSeedPapers.components[i].weight = +e.target
                  .value)
              }
            />
          </>
        ))}
      </Grid>
      <Box fill={true} justify="center" margin={{ top: "small" }}>
        <Button primary color="dark-2" label="Apply" onClick={() => {
          dispatch(actionOverview.setWeights(weights))
        }} />
      </Box>
    </Box>
  );
};

export default AdjustWeightModal;
