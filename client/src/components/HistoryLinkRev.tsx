import * as Icons from 'grommet-icons';
import { Box, Button } from 'grommet'
import React, { useRef, useEffect, useState, Ref } from 'react'
import { PaperEntry } from '../redux/state/overview'
import {ReactComponent as KeywordIcon} from './keyword-research.svg';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import * as d3 from 'd3'

interface Props {
    histories: PaperEntry[][]
    historiesDiff: {type: string, keywords?: string[], papers?: PaperEntry[]}[]
    offsetHeight: number
    svgWidth: number
    cellHeight: number
    onSelectHistory: (historyIndex: number) => any
    numHistories: number
    hoveredEntry: PaperEntry | null
    setHoveredEntry: (entry: PaperEntry) => any
}

interface HistoryLine {
    doi: string
    fromIndex: number
    toIndex: number
}

function translate(x: number, y: number) {
    return `translate(${x}, ${y})`
}

const HistoryLink: React.FC<Props> = ({
    histories,
    historiesDiff,
    offsetHeight,
    cellHeight,
    svgWidth,
    numHistories,
    hoveredEntry,
    setHoveredEntry,
    onSelectHistory,
}) => {
    const svgHeight: number = cellHeight * 30
    const [prevHistoryLength, setPrevHistoryLength] = useState<number>(0)
    const root = useRef<HTMLDivElement>(null)
    const topk: number = 10;

    useEffect(() => {
        // Init

        let _root = d3
            .select(root.current)
            .select('.root-svg')
            .select('.history-content')
    }, [])

    /*
        If the length of the histories change,
        then move every existing elements to the left
        and add new group at the end of the svg.
    */
    useEffect(() => {
        if (histories.length !== prevHistoryLength) {
            console.log(histories)
            console.log(numHistories)
            // update
            const _root = d3
                .select(root.current)
                .select('.root-svg')
                .select('.history-content')
            // Update previous history length
            setPrevHistoryLength(histories.length)

            if (histories.length === 1) {
                const _lineData: HistoryLine[] = []
                const _newHistory = histories[histories.length - 1].slice(0, 50)
                const topKDois: string[] = _newHistory.slice(0, topk).map((d) => d.doi)

                const newHistory = _root.append('g').classed('hg0', true)
                newHistory
                    .selectAll('.node')
                    .data(_lineData)
                    .join('circle')
                    .classed('node', true)
                    .attr('cx', svgWidth)
                    .attr('cy', (d: HistoryLine, i: number) => {
                        return (i + 0.5) * cellHeight
                    })
                    .attr('r', 3)
                    .attr('opacity', (d: HistoryLine) => {
                        if (topKDois.includes(d.doi)) {
                            return 0.7
                        } else {
                            return 0.1
                        }
                    })
            } else if (histories.length > 1) {
                const _lineData: HistoryLine[] = []
                const _newHistory = histories[histories.length - 1].slice(0, 50)
                const topKDois: string[] = _newHistory.slice(0, topk).map((d) => d.doi)
                const _prevHistory = histories[histories.length - 2].slice(
                    0,
                    50
                )
                // move existing elements to the left
                for (let n = numHistories - 1; n >= 0; n--) {
                    console.log('hg' + n)
                    _root
                        .selectAll('.hg' + n)
                        .classed('hg' + n, false)
                        .classed('hg' + (n + 1), true)
                }

                _root
                    .transition()
                    .duration(1000)
                    .selectAll('.parallel')
                    .attr('stroke', (d: any) => {
                        if (topKDois.includes(d.doi)) {
                            return d3.schemeSet1[3]
                        } else {
                            return d3.schemeSet1[8]
                        }
                    })
                    .attr('opacity', (d: any) => {
                        if (topKDois.includes(d.doi)) {
                            return 0.7
                        } else {
                            return 0.1
                        }
                    })

                _root
                    .transition()
                    .duration(1000)
                    .selectAll('.node')
                    .attr('opacity', (d: any) => {
                        if (topKDois.includes(d.doi)) {
                            return 0.7
                        } else {
                            return 0.1
                        }
                    })
                // add new elment

                _newHistory.forEach((te, ti) => {
                    let fi = _prevHistory.findIndex((fe) => fe.doi === te.doi)
                    _lineData.push({
                        fromIndex: fi,
                        toIndex: ti,
                        doi: te.doi,
                    })
                })
                const newHistory = _root.append('g').classed('hg0', true)

                newHistory
                    .selectAll('.parallel')
                    .data(_lineData)
                    .join('line')
                    .classed('history', true)
                    .classed('parallel', true)
                    .attr(
                        'x1',
                        (d: HistoryLine) =>
                            d.fromIndex >= 0 ? svgWidth : svgWidth * 1.19
                        //d.fromIndex >= 0 ? 0 : svgWidth * (0.95)
                    )
                    .attr('y1', (d: HistoryLine) =>
                        d.fromIndex >= 0
                            ? (d.fromIndex + 0.5) * cellHeight
                            : (d.toIndex + 0.5) * cellHeight
                    )
                    .attr('x2', svgWidth + svgWidth / 5)
                    .attr(
                        'y2',
                        (d: HistoryLine) => (d.toIndex + 0.5) * cellHeight
                    )
                    .attr('stroke', (d) => {
                        if (topKDois.includes(d.doi)) {
                            return d3.schemeSet1[3]
                        } else {
                            return d3.schemeSet1[8]
                        }
                    })
                    .attr('stroke-width', 3) //cellHeight * 0.6)
                    .attr('stroke-linecap', 'round')
                    .attr('opacity', (d) => {
                        if (topKDois.includes(d.doi)) {
                            return 0.7
                        } else {
                            return 0.1
                        }
                    })

                newHistory
                    .selectAll('.node')
                    .data(_lineData)
                    .join('circle')
                    .classed('node', true)
                    .attr('cx', svgWidth + svgWidth / 5)
                    .attr('cy', (d: HistoryLine, i: number) => {
                        return (i + 0.5) * cellHeight
                    })
                    .attr('r', 3)
                    .attr('opacity', (d: HistoryLine) => {
                        if (topKDois.includes(d.doi)) {
                            return 0.7
                        } else {
                            return 0.1
                        }
                    })

                for (let n = 0; n <= numHistories; n++) {
                    _root
                        .selectAll('.hg' + n)
                        .transition()
                        .duration(1000)
                        .attr(
                            'transform',
                            translate((-svgWidth / 5) * (n + 1), 0)
                        )
                }

                _root.selectAll('.hg5').remove()
            }
        }
    }, [histories])

    useEffect(() => {
        //console.log('hover')

            const topKDois: string[] = histories[histories.length - 1].slice(0, topk).map(d => d.doi)
            const _root = d3
                .select(root.current)
                .select('.root-svg')
                .select('.history-content')

            _root
                .selectAll('.hovered')
                .classed('hovered', false)
                .classed('unhovered', true)
                .attr('stroke-width', 3)
                .attr('opacity', (d: any) => {
                    if (topKDois.includes(d.doi)) {
                        return 0.7
                    } else {
                        return 0.1
                    }
                })
                
        if (hoveredEntry !== null) {
            _root
                .selectAll('.parallel')
                .filter((d: any) => d.doi == hoveredEntry.doi)
                .classed('hovered', true)
                .attr('stroke-width', cellHeight)
                .attr('opacity', 0.9)
        }
    }, [hoveredEntry])

    //    History 버튼 눌렸을 때 애니메이션 만들기용 Effect
    //    useEffect(() => {
    //
    //    }, [])

    return (
        <div ref={root} style={{ width: svgWidth }}>
            <div
                className={'history-header'}
                style={{ width: svgWidth, height: offsetHeight, display: "flex", justifyContent: "flex-end" }}
            >
                {[...historiesDiff.slice(-numHistories)].map((diff, index, nodes) => {
                    const baseIndex = historiesDiff.indexOf(nodes[0]);
                    const restore = () => onSelectHistory(baseIndex + index);
                    return (
                        <div
                            style={{
                                width: svgWidth / numHistories,
                                height: offsetHeight,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {
                                diff.type === "+K" ? (

                                    <Popup 
                                        trigger={
                                            <KeywordIcon style={{fill: "green", width: 24, height: 24 }}/>
                                        }
                                        on={["hover"]}
                                    >
                                        Added a keyword: {diff.keywords?.join(', ') || ''}
                                        <br />
                                        {/* {baseIndex + index > 0 && <Button onClick={restore} size="small" label="revert" />} */}
                                    </Popup>

                                ) : diff.type === "-K" ? (
                                    <Popup 
                                        trigger={
                                            <KeywordIcon style={{fill: "red", width: 24, height: 24 }}/>
                                        }
                                        on={["hover"]}
                                    >
                                        Deleted a keyword: {diff.keywords?.join(', ') || ''}
                                        <br />
                                        {/* {baseIndex + index > 0 && <Button onClick={restore} size="small" label="revert" />} */}
                                    </Popup>

                                ) : diff.type === "+S" ? (
                                    <Popup 
                                        trigger={
                                            <div>
                                                <Icons.DocumentText color="green" />
                                            </div>
                                        }
                                        on={["hover"]}
                                    >
                                        Added a paper: {diff.papers?.map(p => p.title).join(', ') || ''}
                                        <br />
                                        {/* {baseIndex + index > 0 && <Button onClick={restore} size="small" label="revert" />} */}
                                    </Popup>

                                ) : diff.type === "-S" ? (
                                    <Popup 
                                        trigger={
                                            <div>
                                                <Icons.DocumentText color="red" />
                                            </div>
                                        }
                                        on={["hover"]}
                                    >
                                        Deleted a paper: {diff.papers?.map(p => p.title).join(', ') || ''}
                                        <br />
                                        {/* {baseIndex + index > 0 && <Button onClick={restore} size="small" label="revert" />} */}
                                    </Popup>

                                ) : diff.type === "CW" ? (
                                    <Popup 
                                        trigger={
                                            <div>
                                                <Icons.Calculator color="brown" />
                                            </div>
                                            }
                                            on={["hover"]}
                                        >
                                            Changed weight or filter
                                            <br />
                                            {/* {baseIndex + index > 0 && <Button onClick={restore} size="small" label="revert" />} */}
                                        </Popup>

                                    ) : <div />
                            }
                        </div>
                    )
                })}
            </div>
            <svg className="root-svg" height={svgHeight} width={svgWidth}>
                <g
                    className={'history-content'}
                    height={svgHeight}
                    width={svgWidth}
                ></g>
            </svg>
        </div>
    )
}

export default HistoryLink
