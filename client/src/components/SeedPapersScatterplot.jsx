import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

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
  // console.log(svgHeight)
  // console.log(seedPapers, markedPapers)
  // console.log("THRESHOLD: ", xThreshold, yThreshold)
  // console.log(seedPapers.map((item) => item[xLabel]), seedPapers.map((item) => item[yLabel]))
  // console.log(markedPapers.map((item) => item[xLabel]), markedPapers.map((item) => item[yLabel]))


  let margin = { top: 5, bottom: 5, left: 5, right: 5 }
  let height = svgHeight - margin.top - margin.bottom
  let width = svgWidth - margin.left - margin.right
  const container = useRef(null);

  useEffect(() => {
    d3.select('.seed-scatter').selectAll('*').remove()

    let svg = d3.select('.seed-scatter')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let y = d3
      .scaleLinear()
      .domain(d3.extent(papers.map((paper) => paper[yLabel])))
      .range([height, 0]);
    let x = d3
      .scaleLinear()
      .domain(d3.extent(papers.map((paper) => paper[xLabel])))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .call(d3.axisLeft(y));

    if(xThreshold != null){
      svg.append('line')
      .style('stroke', 'gray')
      .style('stroke-width', 1)
      .attr('x1', x(xThreshold))
      .attr('y1', 0)
      .attr('x2', x(xThreshold))
      .attr('y2', height)
    }

    if(yThreshold != null && (seedPapers.length != 0 || markedPapers.length != 0)){
      svg.append('line')
      .style('stroke', 'gray')
      .style('stroke-width', 1)
      .attr('x1', 0)
      .attr('y1', y(yThreshold))
      .attr('x2', width)
      .attr('y2', y(yThreshold))
    }


    let seedCircle = svg.selectAll('circle')
      .data(seedPapers)

    seedCircle.enter()
      .append('circle')
      .attr('fill', 'red')
      .attr('cx', d => x(d[xLabel]))
      .attr('cy', d => y(d[yLabel]))
      .attr('r', 3)
      .style('opacity', 0.5)


    let markedCircle = svg.selectAll('circle')
      .data(markedPapers)

    markedCircle.enter()
      .append('circle')
      .attr('fill', 'blue')
      .attr('cx', d => x(d[xLabel]))
      .attr('cy', d => y(d[yLabel]))
      .attr('r', 3)
      .style('opacity', 0.5)

  })


  const y = d3
    .scaleLinear()
    .domain(d3.extent(papers.map((paper) => paper[yLabel])))
    .range([0, svgHeight]);
  const x = d3
    .scaleLinear()
    .domain(d3.extent(papers.map((paper) => paper[xLabel])))
    .range([0, svgWidth]);
  return (
    <>
      <div className='seed-scatter'></div>
      {/* <svg style={{ width: svgWidth, height: svgHeight }}>
      {seedPapers.map((paper) => (
        <circle
          key={paper.doi}
          cx={x(paper[xLabel])}
          cy={y(paper[yLabel])}
          r={10}
          fill="blue"
          onClick={() => onClick(paper)}
        />
      ))}
      {markedPapers.map((paper) => (
        <circle
          key={paper.doi}
          cx={x(paper[xLabel])}
          cy={y(paper[yLabel])}
          r={10}
          fill="red"
          onClick={() => onClick(paper)}
        />
      ))}
    </svg> */}
    </>
  );
};

export default SeedPapersScatterplot;
