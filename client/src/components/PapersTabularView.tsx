import { Card, CardBody, CardHeader, Grid, Heading } from "grommet";
import React from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import { maxOfSum } from "../utils";
import HistoryLink from "./HistoryLink";
import SimilaritiesBar from "./SimilaritiesBar";

const PapersTabularView: React.FC = () => {
  const histories = useRootSelector((state) => [
    ...state.overview.histories,
    state.overview,
  ]);
  const numHistories = Math.min(2, histories.length - 1);
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
            .map((_, i) => (
              <HistoryLink
                fromEntries={
                  histories.slice(-(numHistories - 1 - i + 1))[0].paperEntries
                }
                toEntries={
                  histories.slice(-(numHistories - 1 - i + 2))[0].paperEntries
                }
                markedEntries={markedPapers}
                onSelect={() => {}}
                offsetHeight={40}
                cellHeight={20}
              />
            ))}
          <div>
            <Grid
              rows={["40px", ...paperEntries.map((_) => "20px")]}
              columns={[
                "auto",
                "4fr",
                "1fr",
                "1fr",
                "1fr",
                "1fr",
                "1fr",
                "1fr",
                "1fr",
                "1fr",
              ]}
            >
              <div></div>
              <div>Title</div>
              <div>Year</div>
              <div># References</div>
              <div># Referenced</div>
              <div>Keyword Similarity</div>
              <div>Seed Paper Similarity</div>
              <div>Referenced by Seed Papers</div>
              <div>References Seed Papers</div>
              <div>score</div>
              {paperEntries &&
                paperEntries.map((entry, i) => (
                  <>
                    <div>
                      <input
                        type="checkbox"
                        style={{ height: 12 }}
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
                    </div>
                    <div
                      onClick={() => {
                        if (!seedPapers.includes(entry)) {
                          dispatch(
                            actionOverview.setSeedPapers([...seedPapers, entry])
                          );
                        }
                      }}
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      <strong
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.title}
                      </strong>
                    </div>
                    <div>{entry.year}</div>
                    <div>{entry.numReferencing}</div>
                    <div>{entry.numReferenced}</div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.keywordSims}
                        maxOfSum={keywordSimsMaxOfSum}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.seedPaperSims}
                        maxOfSum={seedPaperSimsMaxOfSum}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.referencedBySeedPapers}
                        maxOfSum={referencedBySeedPapersMaxOfSum}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.referencesSeedPapers}
                        maxOfSum={referencesSeedPapersMaxOfSum}
                      />
                    </div>
                    <div>{entry.score}</div>
                  </>
                ))}
            </Grid>
          </div>
        </Grid>
      </CardBody>
    </Card>
  );
};

export default PapersTabularView;
