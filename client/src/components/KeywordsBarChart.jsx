import * as d3 from "d3";
import React from "react";

const KeywordsBarChart = ({
  svgWidth,
  userInputKeywords,
  wordCounts,
  onClick,
}) => {
  const maxCount = wordCounts.reduce((a, b) => Math.max(a, b.count), 0);
  console.log({ maxCount });
  let defaultColor = "rgba(128, 128, 128, 0.3)"
  let barHeight = 25
  let padding = 5
  let textMargin = 15
  return (
    <svg width={svgWidth} height={wordCounts.length * barHeight}>
      {wordCounts.map(({ word, count, isSelected }, i) => {
        return (
        <>
          <rect
            x={svgWidth / 2}
            y={i * barHeight}
            onClick={() => onClick(word)}
            width={(count / maxCount) * svgWidth * 0.4}
            height={barHeight - padding}
            fill={
              isSelected
                ? d3.schemeTableau10[
                    Math.min(9, isSelected.index)
                  ]
                : defaultColor
            }
          />
          <text x={0} y={i * barHeight + textMargin}>
            {word}
          </text>
        </>
      )})}
    </svg>
  );
};

export default KeywordsBarChart;
