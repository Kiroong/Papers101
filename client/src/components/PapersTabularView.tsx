import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Layer,
} from "grommet";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { PaperEntry } from "../redux/state/overview";
import { useRootSelector } from "../redux/state/root-state";
import AdjustWeightModal from "./AdjustWeightModal";
import HistoryLink from "./HistoryLink";
import SimilaritiesBar from "./SimilaritiesBar";
import TitleBox from "./TitleBox";

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
  const weights = useRootSelector((state) => state.overview.weights);
  const setMarkedPapers = (newMarked: PaperEntry[]) =>
    dispatch(actionOverview.setMarkedPapers(newMarked));

  const dispatch = useThunkDispatch();
  const [showWeightModal, setShowWeightModal] = useState(false);

  return (
    <Card fill={true} background="white" overflow={{ vertical: "scroll" }}>
      <CardHeader pad="small">
        <Box direction="row" gap="small" align="baseline">
          <Heading level="4">Papers</Heading>
          <Button
            color="blue"
            onClick={() => {
              setShowWeightModal(true);
            }}
          >
            Adjust weight
          </Button>
          {showWeightModal && (
            <Layer
              onEsc={() => setShowWeightModal(false)}
              onClickOutside={() => setShowWeightModal(false)}
            >
              <AdjustWeightModal onClose={() => setShowWeightModal(false)} />
            </Layer>
          )}
        </Box>
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
              const historyBefore = histories.slice(
                -(numHistories - 1 - i + 2)
              )[0];
              const historyAfter = histories.slice(
                -(numHistories - 1 - i + 1)
              )[0];
              return (
                <HistoryLink
                  fromEntries={historyBefore.paperEntries
                    .filter(
                      (entry) =>
                        !historyBefore.seedPapers
                          .map((e) => e.doi)
                          .includes(entry.doi)
                    )
                    .slice(0, 100)}
                  toEntries={historyAfter.paperEntries
                    .filter(
                      (entry) =>
                        !historyAfter.seedPapers
                          .map((e) => e.doi)
                          .includes(entry.doi)
                    )
                    .slice(0, 100)}
                  markedEntries={markedPapers}
                  setMarkedEntries={setMarkedPapers}
                  onSelect={() => {
                    dispatch(actionOverview.selectHistory(historyBefore));
                  }}
                  offsetHeight={40}
                  cellHeight={20}
                />
              );
            })}
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
              {paperEntries &&
                paperEntries.map((entry, i) => (
                  <>
                    <div>
                      <input
                        type="checkbox"
                        style={{ height: 12 }}
                        checked={markedPapers
                          .map((p) => p.doi)
                          .includes(entry.doi)}
                        onChange={() => {
                          if (
                            markedPapers.map((p) => p.doi).includes(entry.doi)
                          ) {
                            dispatch(
                              actionOverview.setMarkedPapers(
                                markedPapers.filter((p) => p.doi !== entry.doi)
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
                    <TitleBox
                      entry={entry}
                      onClick={() => {
                        if (!seedPapers.includes(entry)) {
                          dispatch(
                            actionOverview.setSeedPapers([...seedPapers, entry])
                          );
                        }
                      }}
                    />
                    <div>{entry.year}</div>
                    <div>{entry.numReferencing}</div>
                    <div>{entry.numReferenced}</div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.keywordSims}
                        maxOfSum={1}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.seedPaperSims}
                        maxOfSum={1}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.referencedBySeedPapers}
                        maxOfSum={1}
                      />
                    </div>
                    <div>
                      <SimilaritiesBar
                        similarities={entry.referencesSeedPapers}
                        maxOfSum={1}
                      />
                    </div>
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
