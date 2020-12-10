import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Heading,
  List,
  TextInput,
} from "grommet";
import * as Icons from "grommet-icons";
import React, { useState } from "react";
import KeywordsBarChartContainer from "./KeywordsBarChartContainer";

const SummaryView: React.FC = () => {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const keywords = ["a", "b", "c"];
  const seedPapers = ["a", "b", "c"];

  return (
    <Card height="100%" width="100%" background="white">
      <CardHeader pad="small">
        <Heading level="4">Summary</Heading>
      </CardHeader>
      <CardBody pad="small" gap="small">
        <Heading level="5">Keywords</Heading>
        <KeywordsBarChartContainer />
        <Heading level="5">Seed papers</Heading>
        <Box fill={true} height="small" background="lightgreen" />
      </CardBody>
      <CardFooter
        pad={{ horizontal: "small" }}
        background="light-1"
        justify="end"
      >
        <Button
          onClick={() => {}}
          icon={<Icons.Search color="plain" />}
          hoverIndicator
        />
      </CardFooter>
    </Card>
  );
};

export default SummaryView;
