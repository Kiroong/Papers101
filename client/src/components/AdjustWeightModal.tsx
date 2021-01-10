import { Box, Button, Grid } from "grommet";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";

interface Props {
  onClose: () => any;
}

const AdjustWeightModal: React.FC<Props> = ({ onClose }) => {
  const [weights, setWeights] = useState(
    useRootSelector((state) => state.overview.weights)
  );
  const dispatch = useThunkDispatch();
  return (
    <Box direction="column" pad="medium">
      <Grid columns={["1fr", "1fr"]} gap="small">

        <div>Year</div>
        <input
          type="number"
          value={weights.recentlyPublished.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              recentlyPublished: {
                ...weights.recentlyPublished,
                weight: +e.target.value,
              },
            })
          }
        />

        <div>Cited By</div>
        <input
          type="number"
          value={weights.citation.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              citation: {
                ...weights.citation,
                weight: +e.target.value,
              },
            })
          }
        />

        <div>Keyword Similarities</div>
        <input
          type="number"
          value={weights.keywordSimilarity.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              keywordSimilarity: {
                ...weights.keywordSimilarity,
                weight: +e.target.value,
              },
            })
          }
        />
        {/* {weights.keywordSimilarity.components.map(({ keyword, weight }, i) => (
          <>
            <div style={{ paddingLeft: 40 }}>{keyword}</div>
            <input
              style={{ marginLeft: 40 }}
              value={weight}
              onChange={(e) =>
                setWeights({
                  ...weights,
                  keywordSimilarity: {
                    ...weights.keywordSimilarity,
                    components: weights.keywordSimilarity.components.map(
                      (x, _i) =>
                        i !== _i
                          ? x
                          : {
                              ...x,
                              weight: +e.target.value,
                            }
                    ),
                  },
                })
              }
            />
          </>
        ))} */}

        <div>Seed paper Similarities</div>
        <input
          type="number"
          value={weights.seedPaperSimilarity.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              seedPaperSimilarity: {
                ...weights.seedPaperSimilarity,
                weight: +e.target.value,
              },
            })
          }
        />
        {/* {weights.seedPaperSimilarity.components.map(({ entry, weight }, i) => (
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
                setWeights({
                  ...weights,
                  seedPaperSimilarity: {
                    ...weights.seedPaperSimilarity,
                    components: weights.seedPaperSimilarity.components.map(
                      (x, _i) =>
                        i !== _i
                          ? x
                          : {
                              ...x,
                              weight: +e.target.value,
                            }
                    ),
                  },
                })
              }
            />
          </>
        ))} */}

        <div>Referenced by Seed papers</div>
        <input
          type="number"
          value={weights.referencedBySeedPapers.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              referencedBySeedPapers: {
                ...weights.referencedBySeedPapers,
                weight: +e.target.value,
              },
            })
          }
        />
        {/* {weights.referencedBySeedPapers.components.map(
          ({ entry, weight }, i) => (
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
                  setWeights({
                    ...weights,
                    referencedBySeedPapers: {
                      ...weights.referencedBySeedPapers,
                      components: weights.referencedBySeedPapers.components.map(
                        (x, _i) =>
                          i !== _i
                            ? x
                            : {
                                ...x,
                                weight: +e.target.value,
                              }
                      ),
                    },
                  })
                }
              />
            </>
          )
        )} */}

        <div>References Seed papers</div>
        <input
          type="number"
          value={weights.referencesSeedPapers.weight}
          onChange={(e) =>
            setWeights({
              ...weights,
              referencesSeedPapers: {
                ...weights.referencesSeedPapers,
                weight: +e.target.value,
              },
            })
          }
        />
        {/* {weights.referencesSeedPapers.components.map(({ entry, weight }, i) => (
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
                setWeights({
                  ...weights,
                  referencesSeedPapers: {
                    ...weights.referencesSeedPapers,
                    components: weights.referencesSeedPapers.components.map(
                      (x, _i) =>
                        i !== _i
                          ? x
                          : {
                              ...x,
                              weight: +e.target.value,
                            }
                    ),
                  },
                })
              }
            />
          </>
        ))} */}
      </Grid>
      <Box fill={true} justify="center" margin={{ top: "small" }}>
        <Button
          primary
          color="dark-2"
          label="Apply"
          onClick={() => {
            dispatch(actionOverview.setWeights(weights));
            onClose();
          }}
        />
      </Box>
    </Box>
  );
};

export default AdjustWeightModal;
