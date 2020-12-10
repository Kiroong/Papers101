import * as d3 from "d3";
import React from "react";

const SeedPapersScatterplot = ({
  svgWidth,
  svgHeight,
  papers,
  xLabel,
  yLabel,
  xThreshold,
  yThreshold,
  onClick,
}) => {
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
      {papers.map((paper) => (
        <circle
          key={paper.doi}
          cx={x(paper[xLabel])}
          cy={y(paper[yLabel])}
          r={5}
          onClick={() => onClick(paper)}
        />
      ))}
    </svg>
  );
};

export default SeedPapersScatterplot;
