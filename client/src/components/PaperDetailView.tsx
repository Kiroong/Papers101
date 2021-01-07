import * as d3 from 'd3';
import React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  Button,
  Heading,
  Card,
} from "grommet";
import { useRootSelector } from "../redux/state/root-state";
import { useThunkDispatch } from "../redux/action/root-action";
import { actionOverview } from "../redux/action/overview-actions";
import DescriptionCard from "./DescriptionCard";

const PaperDetailView = () => {
  const entry = useRootSelector((state) => state.ui.selectedEntry);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const dispatch = useThunkDispatch();
  const tagColors = {} as { [keyword: string]: string };
  keywords.forEach(
    (keyword, i) => (tagColors[keyword] = d3.schemeTableau10[Math.min(i, 9)])
  );

  if (!entry) {
    return <Card />;
  }
  return (
    <Card>
      <Box fill={true} height={{ min: "0px" }}>
        <Grid fill={true} pad="small" rows={["auto", "1fr", "auto"]}>
          <Heading level="5">Paper Detail</Heading>
          <Box
            fill={true}
            overflow={{ vertical: "scroll" }}
            className="styled-scroll"
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell scope="row">Title</TableCell>
                  <TableCell>
                    <Text>{entry.title}</Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Authors</TableCell>
                  <TableCell>
                    <Text>{entry.author.join("; ")}</Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Year</TableCell>
                  <TableCell>
                    <Text>{entry.year}</Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Keywords</TableCell>
                  <TableCell>
                    <Text>{entry.keywords.join("; ")}</Text>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell scope="row">Abstract</TableCell>
                  <TableCell>
                    <DescriptionCard
                      description={entry.abstract}
                      tagColors={tagColors}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box>
            <Button
              onClick={() => {
                if (!seedPapers.includes(entry)) {
                  dispatch(
                    actionOverview.setSeedPapers([...seedPapers, entry])
                  );
                }
              }}
              secondary
              label="Add to seed papers"
            ></Button>
          </Box>
        </Grid>
      </Box>
    </Card>
  );
};

export default PaperDetailView;
