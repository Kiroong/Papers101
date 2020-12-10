import React from 'react';

const KeywordsBarChart = ({ svgWidth, wordCounts, onClick }) => {
    const maxCount = wordCounts.reduce((a, b) => Math.max(a, b.count), 0);
    console.log({ maxCount })
    return (
        <svg width={svgWidth} height={wordCounts.length * 35}>
            {wordCounts.map(({word, count, isSelected}, i) => (
                <>
                    <rect x={svgWidth / 2 } y={i * 35} onClick={() => onClick(word)} width={count / maxCount * svgWidth * 0.4} height={30} fill={isSelected ? 'red' : 'green'} />
                    <text x={0} y={i * 35 + 15}>{word}</text>
                </>
            ))}
        </svg>
    )
}

export default KeywordsBarChart;