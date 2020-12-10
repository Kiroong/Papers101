import { Box } from 'grommet'
import React, { useRef, useEffect, useState, Ref } from 'react'
import { PaperEntry } from '../redux/state/overview'
import * as d3 from 'd3'

interface Props {
    fromEntries: PaperEntry[]
    toEntries: PaperEntry[]
    markedEntries: PaperEntry[]
    offsetHeight: number
    cellHeight: number
    onSelect: () => any
}

interface HistoryLine {
    fromIndex: number
    fromDoi: string
    toIndex: number
    toDoi: string
}

function translate(x: number, y: number) {
    return `translate(${x}, ${y})`
}

const HistoryLink: React.FC<Props> = ({
    fromEntries,
    toEntries,
    markedEntries,
    offsetHeight,
    cellHeight,
    onSelect,
}) => {
    const svgHeight: number = offsetHeight + cellHeight * 100
    const svgWidth: number = 200
    const root = useRef<HTMLDivElement>(null)
    let selectHistory = () => {}
    /*
    useEffect(() => {
        console.log('fromEntries')
        let _root = d3.select(root.current)

        _root
            .selectAll('.cell-history')
            .data(fromEntries)
            .join('rect')
            .classed('cell-history', true)
            .attr('x', 0)
            .attr('y', (d, i) => i * cellHeight)
            .attr('height', cellHeight)
            .attr('width', svgWidth / 4)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'red')
    }, [fromEntries])
    */
   /*
    useEffect(() => {
        let _root = d3.select(root.current)
        let _lineData: HistoryLine[] = []
        toEntries.forEach((te, ti) => {
            let fi = fromEntries.findIndex((fe) => fe.doi === te.doi)
            _lineData.push({
                fromIndex: fi,
                fromDoi: fi >= 0 ? fromEntries[fi].doi : '',
                toIndex: ti,
                toDoi: te.doi,
            })
        })

        _root
            .selectAll('.line-history')
            .data(_lineData)
            .join('line')
            .classed('line-history', true)
            .attr('x1', svgWidth / 4)
            .attr('y1', (d: HistoryLine) =>
                d.fromIndex >= 0 ? d.fromIndex * cellHeight : 100 * cellHeight
            )
            .attr('x2', svgWidth)
            .attr('y2', (d: HistoryLine) => d.toIndex * cellHeight)
            .attr('stroke', 'black')
            .attr('stroke-width', cellHeight)
            .attr('opacity', 0.6)
    }, [toEntries])
      */
    useEffect(() => {}, [markedEntries])

    useEffect(() => {}, [offsetHeight, cellHeight])

    let matchToFrom = (toDoi: string): number => {
      return fromEntries.findIndex((fe) => fe.doi === toDoi)
    }
    return (
        <div ref={root} style={{ width: svgWidth }}>
            <svg height={svgHeight} width={svgWidth}>
                <g
                    className={'history-header'}
                    height={offsetHeight}
                    width={svgWidth}
                >
                    <text> History </text>
                    <button onClick={selectHistory}> Select </button>
                </g>
                <g
                    className={'history'}
                    height={cellHeight * 100}
                    width={svgWidth}
                    transform={translate(0, offsetHeight)}
                >
                    {fromEntries.map((fe, fi) => (
                        <rect
                            className={'cell-history'}
                            width={svgWidth / 4}
                            height={cellHeight}
                            x={0}
                            y={cellHeight * fi}
                            fill={'white'}
                            stroke={'black'}
                            stroke-width={1}
                        />
                    ))}

                    {toEntries.map((te, ti) => (
                        <line
                            className={'line-history'}
                            x1={svgWidth}
                            y1={(ti+0.5)*cellHeight}
                            x2={svgWidth/4}
                            y2={(matchToFrom(te.doi)+0.5)*cellHeight}
                            stroke={'black'}
                            stroke-width={cellHeight*0.8}
                            opacity={0.6}
                        />
                    ))}
                </g>
            </svg>
        </div>
    )
}

export default HistoryLink
