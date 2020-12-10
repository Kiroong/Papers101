import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CheckBox,
  Grid,
  Heading,
} from "grommet";
import React from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import HistoryLink from "./HistoryLink";
import SimilaritiesBar from "./SimilaritiesBar";

function maxOfSum(values: number[][]) {
  return values.reduce(
    (a, b) =>
      Math.max(
        a,
        b.reduce((x, y) => x + y, 0)
      ),
    0
  );
}

const PapersTabularView: React.FC = () => {
  const numHistories = 2;
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const paperEntries = useRootSelector((state) =>
    state.overview.paperEntries
      .filter((entry) => !seedPapers.map((e) => e.doi).includes(entry.doi))
      .slice(0, 100)
  );
  const markedPapers = useRootSelector((state) => state.overview.markedPapers);

  const keywordSimsMaxOfSum = maxOfSum(
    paperEntries.map((entry) => entry.keywordSims)
  );
  const seedPaperSimsMaxOfSum = maxOfSum(
    paperEntries.map((entry) => entry.seedPaperSims)
  );
  const referencedBySeedPapersMaxOfSum = maxOfSum(
    paperEntries.map((entry) => entry.referencedBySeedPapers)
  );
  const referencesSeedPapersMaxOfSum = maxOfSum(
    paperEntries.map((entry) => entry.referencesSeedPapers)
  );
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
                const reversed = paperEntries.slice(0).reverse();
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
                    markedEntries={markedPapers}
                    onSelect={() => {}}
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
                    markedEntries={markedPapers}
                    onSelect={() => {}}
                    offsetHeight={40}
                    cellHeight={20}
                  />
                );
              }
            })}
          <table>
            <thead>
              <tr style={{ height: 40, padding: 0 }}>
                <th scope="col"></th>
                <th scope="col">Title</th>
                <th scope="col">Year</th>
                <th scope="col"># References</th>
                <th scope="col"># Referenced</th>
                <th scope="col">Keyword Similarity</th>
                <th scope="col">Seed Paper Similarity</th>
                <th scope="col">Referenced by Seed Papers</th>
                <th scope="col">References Seed Papers</th>
                <th scope="col">score</th>
              </tr>
            </thead>
            <tbody>
              {paperEntries &&
                paperEntries.map((entry, i) => (
                  <tr key={entry.doi} style={{ height: 20, padding: 0 }}>
                    <td>
                      <CheckBox
                        checked={markedPapers.includes(entry)}
                        onChange={() => {
                          if (markedPapers.includes(entry)) {
                            dispatch(
                              actionOverview.setMarkedPapers(
                                markedPapers.filter((p) => p !== entry)
                              )
                            );
                          } else {
                            dispatch(
                              actionOverview.setMarkedPapers([
                                ...markedPapers,
                                entry,
                              ])
                            );
                          }
                        }}
                      />
                    </td>
                    <td
                      onClick={() => {
                        if (!seedPapers.includes(entry)) {
                          dispatch(
                            actionOverview.setSeedPapers([...seedPapers, entry])
                          );
                        }
                      }}
                    >
                      <strong>{entry.title.slice(0, 50)}</strong>
                    </td>
                    <td>{entry.year}</td>
                    <td>{entry.numReferencing}</td>
                    <td>{entry.numReferenced}</td>
                    <td>
                      <SimilaritiesBar
                        similarities={entry.keywordSims}
                        maxOfSum={keywordSimsMaxOfSum}
                      />
                    </td>
                    <td>
                      <SimilaritiesBar
                        similarities={entry.seedPaperSims}
                        maxOfSum={seedPaperSimsMaxOfSum}
                      />
                    </td>
                    <td>
                      <SimilaritiesBar
                        similarities={entry.referencedBySeedPapers}
                        maxOfSum={referencedBySeedPapersMaxOfSum}
                      />
                    </td>
                    <td>
                      <SimilaritiesBar
                        similarities={entry.referencesSeedPapers}
                        maxOfSum={referencesSeedPapersMaxOfSum}
                      />
                    </td>
                    <td>{entry.score}</td>
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
