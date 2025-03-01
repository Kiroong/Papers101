import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { PaperEntry } from "../redux/state/overview";
import { useRootSelector } from "../redux/state/root-state";
import { extractKeywords } from "../utils";
import KeywordsBarChart from "./KeywordsBarChart";

interface Props {
  targetPapers: PaperEntry[];
}

const KeywordsBarChartContainer: React.FC<Props> = ({ targetPapers }) => {
  const dispatch = useThunkDispatch();
  const userInputKeywords = useRootSelector((state) => state.overview.keywords);
  const wordCounts = useMemo(() => {
    const count = {} as { [word: string]: number };
    targetPapers.forEach((entry) => {
      extractKeywords(entry.title + " " + entry.abstract).forEach((word) =>
        count[word] ? (count[word] += 1) : (count[word] = 1)
      );
      entry.keywords
        .map((word) => word.toLocaleLowerCase().split(" "))
        .reduce((a, b) => a.concat(b), [])
        .forEach((word) =>
          count[word] ? (count[word] += 1) : (count[word] = 1)
        );
    });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([word, count]) => ({
        word,
        count,
        isSelected: userInputKeywords
          .map((keyword, index) => ({ keyword, index }))
          .find(({ keyword, index }) => keyword.split(" ").includes(word)),
      }));
  }, [userInputKeywords, targetPapers]);
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (container.current && !width) {
      setWidth(container.current.getBoundingClientRect().width);
    }
  });
  return (
    <div
      className="styled-scroll"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
      ref={container}
    >
      {width && (
        <KeywordsBarChart
          svgWidth={width * 0.9}
          userInputKeywords={userInputKeywords}
          wordCounts={wordCounts}
          onClick={(keyword: string) => {
            if (userInputKeywords.includes(keyword.toLocaleLowerCase())) {
              dispatch(
                actionOverview.setKeywords(
                  userInputKeywords.filter((k) => k !== keyword)
                )
              );
            } else {
              dispatch(
                actionOverview.setKeywords([...userInputKeywords, keyword])
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default KeywordsBarChartContainer;
