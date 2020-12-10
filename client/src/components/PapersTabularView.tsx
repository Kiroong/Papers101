// import { Button } from "grommet";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import React from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import HistoryLink from "./HistoryLink";

const PapersTabularView: React.FC = () => {
  const numHistories = 2;
  const paperEntries = useRootSelector((state) => state.overview.paperEntries);
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const dispatch = useThunkDispatch();

  return (
    <Card fill={true} background="white" overflow={{ vertical: "scroll" }}>
      <CardHeader pad="small">
        <Heading level="4">Papers</Heading>
      </CardHeader>
      <CardBody pad="small" gap="small">
        <Grid
          columns={[
            ...Array(numHistories)
              .fill(0)
              .map((_) => "auto"),
            "1fr",
          ]}
          fill={true}
        >
          {Array(numHistories)
            .fill(0)
            .map((_, i) => {
              if (!paperEntries) {
                return null;
              }
              if (i === 0) {
                const reversed = paperEntries.reverse();
                return (
                  <HistoryLink
                    fromEntries={[
                      ...paperEntries.slice(10, 100),
                      ...paperEntries.slice(0, 10).reverse(),
                    ]}
                    toEntries={[
                      ...paperEntries.slice(5, 100),
                      ...paperEntries.slice(0, 5).reverse(),
                    ]}
                    offsetHeight={40}
                    cellHeight={20}
                  />
                );
              } else if (i === 1) {
                return (
                  <HistoryLink
                    fromEntries={[
                      ...paperEntries.slice(5, 100),
                      ...paperEntries.slice(0, 5).reverse(),
                    ]}
                    toEntries={paperEntries}
                    offsetHeight={40}
                    cellHeight={20}
                  />
                );
              }
            })}
          <table>
            <thead>
              <tr style={{ height: 40, padding: 0 }}>
                <th scope="col">Title</th>
                <th scope="col">Year</th>
                <th scope="col">Keyword Similarity</th>
                <th scope="col">Seed Paper Similarity</th>
                <th scope="col"># References</th>
              </tr>
            </thead>
            <tbody>
              {paperEntries &&
                paperEntries.slice(0, 100).map((entry) => (
                  <tr
                    onClick={() => {
                      dispatch(
                        actionOverview.setSeedPapers([...seedPapers, entry])
                      );
                    }}
                    key={entry.doi}
                    style={{ height: 20, padding: 0 }}
                  >
                    <th scope="row">
                      <strong>{entry.title}</strong>
                    </th>
                    <td>{entry.year}</td>
                    <td>
                      <Box justify="center" fill={true} direction="row">
                        <Box
                          height="10px"
                          width="30px"
                          background="lightgreen"
                        />
                        <Box height="10px" width="60px" background="pink" />
                        <Box height="10px" width="20px" background="yellow" />
                      </Box>
                    </td>
                    <td>
                      <Box justify="center" fill={true} direction="row">
                        <Box
                          height="10px"
                          width="20px"
                          background="lightgreen"
                        />
                        <Box height="10px" width="10px" background="pink" />
                        <Box height="10px" width="70px" background="yellow" />
                      </Box>
                    </td>
                    <td>{entry.referencing.length}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default PapersTabularView;
