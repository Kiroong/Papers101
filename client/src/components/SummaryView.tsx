import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
} from "grommet";
import * as Icons from "grommet-icons";
import React from "react";
import KeywordsBarChartContainer from "./KeywordsBarChartContainer";
import SeedPapersScatterplotContainer from "./SeedPapersScatterplotContainer";

const SummaryView: React.FC = () => {
  return (
    <Card height="100%" width="100%" background="white">
      <CardHeader pad="small">
        <Heading level="4">Summary</Heading>
      </CardHeader>
      <CardBody pad="small" gap="small">
        <Heading level="5">Keywords</Heading>
        <KeywordsBarChartContainer />
        <Heading level="5">Seed papers</Heading>
        <SeedPapersScatterplotContainer />
      </CardBody>
    </Card>
  );
};

export default SummaryView;
