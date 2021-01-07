import * as d3 from "d3";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  RadioButtonGroup,
  Form,
  List,
  Grid,
  Text,
} from "grommet";
import * as Icons from "grommet-icons";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import KeywordsBarChartContainer from "./KeywordsBarChartContainer";
import SeedPapersScatterplotContainer from "./SeedPapersScatterplotContainer";

const SummaryView: React.FC = () => {
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const dispatch = useThunkDispatch();
  return (
    <Card height="100%" width="100%" background="white">
      <CardHeader pad="small">
        <Box direction="row" align="baseline" gap="small">
          <Heading level="4">Seed papers</Heading>
          <Button
            color="blue"
            onClick={() => {
              dispatch(actionOverview.setSeedPapers([]));
            }}
          >
            clear
          </Button>
        </Box>
      </CardHeader>
      <CardBody>
        <Form onSubmit={() => {}}>
          <List
            data={seedPapers.map((entry) => entry)}
            primaryKey={(entry) => entry.title}
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
                    minWidth: 20,
                    height: 20,
                    backgroundColor: d3.schemePurples[9].slice(3)[
                      Math.min(i, 5)
                    ],
                  }}
                />
                <Text size="small">{item.title}</Text>
                <Button
                  icon={<Icons.Close size="small" />}
                  hoverIndicator
                  onClick={() => {
                    dispatch(
                      actionOverview.setSeedPapers(
                        seedPapers.filter((e) => e !== item)
                      )
                    );
                  }}
                />
              </Grid>
            )}
          </List>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SummaryView;
