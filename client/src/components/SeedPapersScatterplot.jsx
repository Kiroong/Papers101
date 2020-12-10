import * as d3 from "d3";
import React from "react";

const SeedPapersScatterplot = ({
  svgWidth,
  svgHeight,
  seedPapers,
  markedPapers,
  xLabel,
  yLabel,
  xThreshold,
  yThreshold,
  onClick,
}) => {
  const papers = [...seedPapers, ...markedPapers];
  const y = d3
    .scaleLinear()
    .domain(d3.extent(papers.map((paper) => paper[yLabel])))
    .range([0, svgHeight]);
  const x = d3
    .scaleLinear()
    .domain(d3.extent(papers.map((paper) => paper[xLabel])))
    .range([0, svgWidth]);
  return (
    <svg style={{ width: svgWidth, height: svgHeight }}>
      {seedPapers.map((paper) => (
        <circle
          key={paper.doi}
          cx={x(paper[xLabel])}
          cy={y(paper[yLabel])}
          r={5}
          fill="black"
          onClick={() => onClick(paper)}
        />
      ))}
      {markedPapers.map((paper) => (
        <circle
          key={paper.doi}
          cx={x(paper[xLabel])}
          cy={y(paper[yLabel])}
          r={5}
          fill="gray"
          onClick={() => onClick(paper)}
        />
      ))}
    </svg>
  );
};

export default SeedPapersScatterplot;
