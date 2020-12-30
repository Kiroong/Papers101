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
import {
  setHoveredEntry as _setHoveredEntry,
  useThunkDispatch,
} from "../redux/action/root-action";
import { PaperEntry } from "../redux/state/overview";
import { useRootSelector } from "../redux/state/root-state";
import AdjustWeightModal from "./AdjustWeightModal";
import MemoizedHistoryLink from "./HistoryLink";
import SimilaritiesBar from "./SimilaritiesBar";
import TitleBox from "./TitleBox";

const PapersTabularView: React.FC = () => {
  const histories = useRootSelector((state) => [
    ...state.overview.histories,
    state.overview,
  ]);
  const numHistories = 5;
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const paperEntries = useRootSelector((state) =>
    state.overview.paperEntries
      .filter((entry) => !seedPapers.map((e) => e.doi).includes(entry.doi))
      .slice(0, 50)
  );
  const markedPapers = useRootSelector((state) => state.overview.markedPapers);
  const weights = useRootSelector((state) => state.overview.weights);

  const hoveredEntry = useRootSelector((state) => state.hoveredEntry);
  const setHoveredEntry = (entry: PaperEntry) => {
    if (hoveredEntry?.doi !== entry.doi) {
      dispatch(_setHoveredEntry(entry));
    }
  };

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
              const width = 35;
              if (histories.length - 1 < numHistories - i) {
                return <div style={{ width }} />;
              }
              const historyBefore = histories.slice(
                -(numHistories - 1 - i + 2)
              )[0];
              const historyAfter = histories.slice(
                -(numHistories - 1 - i + 1)
              )[0];

              const lastRight = histories
                .slice(-1)[0]
                .paperEntries.slice(0, 50)
                .map((p) => p.doi);
              const topK = lastRight.slice(0, 5);

              return (
                <MemoizedHistoryLink
                  fromEntries={historyBefore.paperEntries
                    .filter(
                      (entry) =>
                        !historyBefore.seedPapers
                          .map((e) => e.doi)
                          .includes(entry.doi)
                    )
                    .slice(0, 50)}
                  toEntries={historyAfter.paperEntries
                    .filter(
                      (entry) =>
                        !historyAfter.seedPapers
                          .map((e) => e.doi)
                          .includes(entry.doi)
                    )
                    .slice(0, 50)}
                  topKDois={topK}
                  onSelect={() => {
                    dispatch(actionOverview.selectHistory(historyBefore));
                  }}
                  offsetHeight={40}
                  cellHeight={20}
                  svgWidth={width}
                  hoveredEntry={hoveredEntry}
                  setHoveredEntry={setHoveredEntry}
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
                    <Box
                      direction="row"
                      align="baseline"
                      gap="small"
                      margin={{ horizontal: "small" }}
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      <Button
                        onClick={() => {
                          if (!seedPapers.includes(entry)) {
                            dispatch(
                              actionOverview.setSeedPapers([
                                ...seedPapers,
                                entry,
                              ])
                            );
                          }
                        }}
                      >
                        SEED
                      </Button>
                    </Box>
                    <TitleBox
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                      entry={entry} />
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      {entry.year}
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      {entry.numReferencing}
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      {entry.numReferenced}
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      <SimilaritiesBar
                        similarities={entry.keywordSims}
                        maxOfSum={1}
                      />
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      <SimilaritiesBar
                        similarities={entry.seedPaperSims}
                        maxOfSum={1}
                      />
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
                      <SimilaritiesBar
                        similarities={entry.referencedBySeedPapers}
                        maxOfSum={1}
                      />
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        backgroundColor:
                          hoveredEntry?.doi === entry.doi
                            ? "rgba(0,0,255,0.1)"
                            : "white",
                      }}
                    >
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
