import * as d3 from "d3";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CheckBox,
  Form,
  Grid,
  Heading,
  List,
  RadioButtonGroup,
  Text,
  TextInput,
} from "grommet";
import * as Icons from "grommet-icons";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import KeywordsBarChartContainer from "./KeywordsBarChartContainer";

const SearchBox: React.FC = () => {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const keywords = useRootSelector((state) => state.overview.keywords);
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const paperEntries = useRootSelector((state) =>
    state.overview.paperEntries.slice(0, 30)
  );
  const [targetPaperMode, setTargetPaperMode] = useState("from search result");
  const forceAllKeywords = useRootSelector(
    (state) => state.overview.forceAllKeywords
  );
  const dispatch = useThunkDispatch();

  return (
    <Card height="100%" width="100%" background="white">
      <CardHeader pad="small">
        <Heading level="4">Search Box</Heading>
      </CardHeader>
      <CardBody pad="small" gap="small">
        <Box fill={true}>
          <Grid fill={true} rows={["2fr", "5fr"]}>
            <div style={{ overflowY: "scroll" }} className="styled-scroll">
              <Box direction="row" align="baseline" gap="small">
                <Heading level="5">Keywords</Heading>
                <Button
                  color="blue"
                  onClick={() => {
                    dispatch(actionOverview.setKeywords([]));
                  }}
                >
                  clear
                </Button>
              </Box>
              <Box direction="row" align="center" gap="small">
                <CheckBox
                  size={10}
                  checked={forceAllKeywords}
                  onChange={(e) =>
                    dispatch(
                      actionOverview.setForceAllKeywords(!forceAllKeywords)
                    )
                  }
                />
                Should contain all keywords
              </Box>
              <Form
                onSubmit={() => {
                  if (!keywords.includes(currentKeyword.toLocaleLowerCase())) {
                    dispatch(
                      actionOverview.setKeywords([...keywords, currentKeyword])
                    );
                  }
                  setCurrentKeyword("");
                }}
              >
                <TextInput
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                />
                <List
                  data={keywords.map((keyword) => ({ entry: keyword }))}
                  primaryKey={(item) => item.entry}
                  pad={{
                    left: "small",
                    right: "none",
                    top: "none",
                    bottom: "none",
                  }}
                >
                  {(item: any, i: number) => (
                    <Grid
                      fill={true}
                      key={item.doi}
                      columns={["auto", "1fr", "auto"]}
                      pad="xsmall"
                      gap="small"
                      align="center"
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: d3.schemeTableau10[Math.min(i, 9)],
                        }}
                      />
                      <Text size="small">{item.entry}</Text>
                      <Button
                        icon={<Icons.Close size="small" />}
                        hoverIndicator
                        onClick={() => {
                          dispatch(
                            actionOverview.setKeywords(
                              keywords.filter((k) => k !== item.entry)
                            )
                          );
                        }}
                      />
                    </Grid>
                  )}
                </List>
              </Form>
            </div>
            <Box fill={true} pad="small" gap="small" height={{ min: "0px" }}>
              <Heading level="5">Recommended</Heading>
              <RadioButtonGroup
                margin={{ bottom: "small" }}
                name="target paper"
                options={["from search result", "from seed papers"]}
                value={targetPaperMode}
                onChange={(event: any) =>
                  setTargetPaperMode(event.target.value)
                }
              />
              <KeywordsBarChartContainer
                targetPapers={
                  targetPaperMode === "from search result"
                    ? paperEntries
                    : seedPapers
                }
              />
            </Box>
          </Grid>
        </Box>
      </CardBody>
    </Card>
  );
};

export default SearchBox;
