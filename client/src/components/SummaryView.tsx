import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  RadioButtonGroup,
} from "grommet";
import * as Icons from "grommet-icons";
import React, { useState } from "react";
import { useRootSelector } from "../redux/state/root-state";
import KeywordsBarChartContainer from "./KeywordsBarChartContainer";
import SeedPapersScatterplotContainer from "./SeedPapersScatterplotContainer";

const SummaryView: React.FC = () => {
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const paperEntries = useRootSelector((state) =>
    state.overview.paperEntries.slice(0, 50)
  );

  const [targetPaperMode, setTargetPaperMode] = useState("from search result");
  return (
    <Card height="100%" width="100%" background="white">
      <CardHeader pad="small">
        <Heading level="4">Summary</Heading>
      </CardHeader>
      <CardBody pad="small" gap="small">
        <Heading level="5">Keywords</Heading>
        <RadioButtonGroup
          margin={{ bottom: "small" }}
          name="target paper"
          options={["from search result", "from seed papers"]}
          value={targetPaperMode}
          onChange={(event: any) => setTargetPaperMode(event.target.value)}
        />
        <KeywordsBarChartContainer
          targetPapers={
            targetPaperMode === "from search result" ? paperEntries : seedPapers
          }
        />
        {/* <Heading level="5">Seed papers</Heading>
        <SeedPapersScatterplotContainer /> */}
      </CardBody>
    </Card>
  );
};

export default SummaryView;
