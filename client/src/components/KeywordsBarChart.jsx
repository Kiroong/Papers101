import React from 'react';

const KeywordsBarChart = ({ svgWidth, svgHeight, wordCounts }) => {
    return (
        <svg width={svgWidth} height={svgHeight}>
            {wordCounts.map(({word, count, isSelected}) => (
                <rect x={0} y={0} width={svgWidth} height={30} fill={isSelected ? 'red' : 'green'} />
            ))}
        </svg>
    )
}

export default KeywordsBarChart;