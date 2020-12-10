import { Box, Button, Grid } from "grommet";
import React, { useState } from "react";
import { useRootSelector } from "../redux/state/root-state";

const AdjustWeightModal: React.FC = () => {
  const weights = useRootSelector((state) => state.overview.weights);
  return (
    <Box direction="column" pad="medium">
      <Grid columns={["1fr", "1fr"]} gap="small">
        <div>Keyword Similarities</div>
        <input type="number" value={weights.keywordSimilarity.maxVal} />
        {weights.keywordSimilarity.components.map(({ keyword, weight }) => (
          <>
            <div style={{ paddingLeft: 40 }}>{keyword}</div>
            <input style={{ marginLeft: 40 }} value={weight} />
          </>
        ))}

        <div>Seed paper Similarities</div>
        <input type="number" value={weights.seedPaperSimilarity.maxVal} />
        {weights.seedPaperSimilarity.components.map(({ entry, weight }) => (
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
            <input style={{ marginLeft: 40 }} value={weight} />
          </>
        ))}

        <div>Referenced by Seed papers</div>
        <input type="number" value={weights.referencedBySeedPapers.maxVal} />
        {weights.referencedBySeedPapers.components.map(({ entry, weight }) => (
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
            <input style={{ marginLeft: 40 }} value={weight} />
          </>
        ))}

        <div>References Seed papers</div>
        <input type="number" value={weights.referencesSeedPapers.maxVal} />
        {weights.referencesSeedPapers.components.map(({ entry, weight }) => (
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
            <input style={{ marginLeft: 40 }} value={weight} />
          </>
        ))}
      </Grid>
      <Box fill={true} justify="center" margin={{ top: "small" }}>
        <Button primary color="dark-2" label="Apply" />
      </Box>
    </Box>
  );
};

export default AdjustWeightModal;
