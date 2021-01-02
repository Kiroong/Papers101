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
  const weightsHash = `${weights.recentlyPublished.maxVal}:${weights.keywordSimilarity.maxVal}:${weights.seedPaperSimilarity.maxVal}:${weights.referencedBySeedPapers.maxVal}:${weights.referencesSeedPapers.maxVal}`;

  const hoveredEntry = useRootSelector((state) => state.hoveredEntry);
  const setHoveredEntry = (entry: PaperEntry) => {
    if (hoveredEntry?.doi !== entry.doi) {
      dispatch(_setHoveredEntry(entry));
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
        <Grid columns={["auto", "1fr"]} fill={true}>
          <MemoizedHistoryLink
            histories={histories.map((history) =>
              history.paperEntries.filter(
                (entry) =>
                  !history.seedPapers.map((e) => e.doi).includes(entry.doi)
              )
            )}
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
          <div>
            <Grid
              rows={["50px", ...paperEntries.map((_) => "20px")]}
              columns={[
                "auto",
                "4fr",
                "auto",
                `${weights.recentlyPublished.maxVal}fr`,
                `${weights.keywordSimilarity.maxVal}fr`,
                `${weights.seedPaperSimilarity.maxVal}fr`,
                `${weights.referencedBySeedPapers.maxVal}fr`,
                `${weights.referencesSeedPapers.maxVal}fr`,
              ]}
            >
              <div></div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>Title</div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>Year</div>
              <div
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <Icons.Clock /> Recently Published
              </div>
              <div
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Keyword Similarity
              </div>
              <div
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Seed Paper Similarity
              </div>
              <div
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <Icons.Descend /> Referenced by Seed Papers
              </div>
              <div
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <Icons.List />
                References Seed Papers
              </div>
              {paperEntries &&
                paperEntries.map((entry, i) => (
                  <>
                    <Box
                      direction="row"
                      align="baseline"
                      pad={{ horizontal: "small" }}
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        paddingLeft: 5,
                        paddingRight: 5,
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
                      entry={entry}
                    />
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
                      style={{
                        paddingLeft: 5,
                        paddingRight: 5,
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
                        similarities={[entry.recentlyPublished]}
                        maxOfSum={1}
                        color={[d3.schemeGreys[3][1]]}
                      />
                    </div>
                    <div
                      onMouseOver={() => setHoveredEntry(entry)}
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
      </CardBody>
    </Card>
  );
};

export default PapersTabularView;
