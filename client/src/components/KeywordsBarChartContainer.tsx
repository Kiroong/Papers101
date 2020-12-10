import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRootSelector } from "../redux/state/root-state";
import KeywordsBarChart from "./KeywordsBarChart";

interface Props {
}

const KeywordsBarChartContainer: React.FC<Props> = () => {
  const userInputKeywords = useRootSelector((state) => state.overview.keywords);
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const wordCounts = useMemo(() => {
    const count = {} as { [word: string]: number };
    seedPapers.forEach((entry) => {
      entry.abstract
        .split(" ")
        .forEach((word) =>
          count[word] ? (count[word] += 1) : (count[word] = 1)
        );
      entry.keywords.forEach((word) =>
        count[word] ? (count[word] += 1) : (count[word] = 1)
      );
      entry.title
        .split(" ")
        .forEach((word) =>
          count[word] ? (count[word] += 1) : (count[word] = 1)
        );
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 50)
      .map(([word, count]) => ({
        word,
        count,
        isSelected: userInputKeywords.includes(word),
      }))
    ;
  }, [userInputKeywords, seedPapers]);
  console.log({ wordCounts })
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (container.current && !(width)) {
      setWidth(container.current.getBoundingClientRect().width);
    }
  });
  return (
    <div style={{ height: "100%", width: "100%", overflowY: "scroll" }} ref={container}>
      {width && (
        <KeywordsBarChart svgWidth={width} svgHeight={wordCounts.length * 30} wordCounts={wordCounts} />
      )}
    </div>
  );
};

export default KeywordsBarChartContainer;
