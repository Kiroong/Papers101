import * as Icons from "grommet-icons";
import * as d3 from "d3";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Layer,
  Stack,
  Text,
} from "grommet";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import {
  setHoveredEntry as _setHoveredEntry,
  setSelectedEntry as _setSelectedEntry,
  useThunkDispatch,
} from "../redux/action/root-action";
import { PaperEntry } from "../redux/state/overview";
import { useRootSelector } from "../redux/state/root-state";
import AdjustWeightModal from "./AdjustWeightModal";
import HistoryLink from "./HistoryLinkRev";
import SimilaritiesBar from "./SimilaritiesBar";
import TitleBox from "./TitleBox";

const PapersTabularView: React.FC = () => {
  const histories = useRootSelector((state) => [
    ...state.overview.histories,
    state.overview,
  ]);
  const historiesDiff = histories
    .map((history, i) => {
      if (i === 0) {
        return { type: "undefined" };
      }
      const prevHistory = histories[i - 1];
      if (history.keywords.length > prevHistory.keywords.length) {
        return {
          type: "+K",
          keywords: history.keywords.filter(
            (keyword) => !prevHistory.keywords.includes(keyword)
          ),
        };
      }
      if (history.keywords.length < prevHistory.keywords.length) {
        return {
          type: "-K",
          keywords: prevHistory.keywords.filter(
            (keyword) => !history.keywords.includes(keyword)
          ),
        };
      }
      if (history.seedPapers.length > prevHistory.seedPapers.length) {
        return {
          type: "+S",
          papers: history.seedPapers.filter(
            (paper) =>
              !prevHistory.seedPapers.map((d) => d.doi).includes(paper.doi)
          ),
        };
      }
      if (history.seedPapers.length < prevHistory.seedPapers.length) {
        return {
          type: "-S",
          papers: prevHistory.seedPapers.filter(
            (paper) => !history.seedPapers.map((d) => d.doi).includes(paper.doi)
          ),
        };
      }
      return {
        type: "CW",
      };
    })
    .slice(1);
  const numHistories = 5;
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const keywords = useRootSelector((state) => state.overview.keywords);
  const paperEntries = useRootSelector((state) =>
    state.overview.paperEntries
      .filter((entry) => !seedPapers.map((e) => e.doi).includes(entry.doi))
      .slice(0, 30)
  );
  const markedPapers = useRootSelector((state) => state.overview.markedPapers);
  const weights = useRootSelector((state) => state.overview.weights);
  const weightsHash = `${weights.recentlyPublished.maxVal}:${weights.keywordSimilarity.maxVal}:${weights.seedPaperSimilarity.maxVal}:${weights.referencedBySeedPapers.maxVal}:${weights.referencesSeedPapers.maxVal}`;

  const hoveredEntry = useRootSelector((state) => state.ui.hoveredEntry);
  const setHoveredEntry = (entry: PaperEntry) => {
    if (hoveredEntry?.doi !== entry.doi) {
      dispatch(_setHoveredEntry(entry));
    }
  };

  const selectedEntry = useRootSelector((state) => state.ui.selectedEntry);
  const setSelectedEntry = (entry: PaperEntry) => {
    if (selectedEntry?.doi !== entry.doi) {
      dispatch(_setSelectedEntry(entry));
    }
  };

  const dispatch = useThunkDispatch();
  const [showWeightModal, setShowWeightModal] = useState(false);

  return (
    <Card
      fill={true}
      background="white"
      overflow={{ vertical: "scroll" }}
      className="styled-scroll"
    >
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
        {histories.length > 1 ? (
          <Grid columns={["auto", "1fr"]} fill={true}>
            <HistoryLink
              histories={histories.map((history) =>
                history.paperEntries.filter(
                  (entry) =>
                    !history.seedPapers.map((e) => e.doi).includes(entry.doi)
                )
              )}
              historiesDiff={historiesDiff}
              onSelectHistory={(historyIndex: number) => {
                dispatch(actionOverview.selectHistory(histories[historyIndex]));
              }}
              offsetHeight={50}
              cellHeight={20}
              svgWidth={35 * numHistories}
              numHistories={numHistories}
              hoveredEntry={hoveredEntry}
              setHoveredEntry={setHoveredEntry}
            />
            <div style={{ height: "100%" }}>
              <Grid
                fill={true}
                rows={["50px", ...paperEntries.map((_) => "20px")]}
                columns={[
                  "auto",
                  "4fr",
                  `${weights.recentlyPublished.maxVal}fr`,
                  `${weights.keywordSimilarity.maxVal}fr`,
                  `${weights.seedPaperSimilarity.maxVal}fr`,
                  `${weights.referencedBySeedPapers.maxVal}fr`,
                  `${weights.referencesSeedPapers.maxVal}fr`,
                ]}
              >
                <div>Rank</div>
                <div style={{ paddingLeft: 5, paddingRight: 5 }}>Title</div>
                <div
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  Year
                </div>
                <div
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  Keyword Similarity
                </div>
                <div
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  Seed Paper Similarity
                </div>
                <div
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  Referenced by Seed Papers
                </div>
                <div
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  References Seed Papers
                </div>
                {paperEntries &&
                  paperEntries.map((entry, i) => (
                    <>
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          textAlign: "center",
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        {i + 1}
                      </div>
                      <TitleBox
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                        entry={entry}
                      />
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        <Stack fill={true} anchor="left">
                          <SimilaritiesBar
                            key={weightsHash}
                            similarities={[entry.recentlyPublished]}
                            maxOfSum={1}
                            color={[d3.schemeReds[9][1]]}
                          />
                          <Text size="xsmall">{entry.year}</Text>
                        </Stack>
                      </div>
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        <SimilaritiesBar
                          key={weightsHash}
                          similarities={entry.keywordSims}
                          maxOfSum={1}
                          color={d3.schemeTableau10}
                        />
                      </div>
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        <SimilaritiesBar
                          key={weightsHash}
                          similarities={entry.seedPaperSims}
                          maxOfSum={1}
                          color={d3.schemePurples[9].slice(3)}
                        />
                      </div>
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        <SimilaritiesBar
                          key={weightsHash}
                          similarities={entry.referencedBySeedPapers}
                          maxOfSum={1}
                          color={d3.schemePurples[9].slice(3)}
                        />
                      </div>
                      <div
                        onMouseOver={() => setHoveredEntry(entry)}
                        onClick={() => setSelectedEntry(entry)}
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          backgroundColor:
                            hoveredEntry?.doi === entry.doi
                              ? "rgba(0,0,255,0.1)"
                              : "white",
                        }}
                      >
                        <SimilaritiesBar
                          key={weightsHash}
                          similarities={entry.referencesSeedPapers}
                          maxOfSum={1}
                          color={d3.schemePurples[9].slice(3)}
                        />
                      </div>
                    </>
                  ))}
              </Grid>
            </div>
          </Grid>
        ) : (
          <Text>Enter search keywords on the left</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default PapersTabularView;
