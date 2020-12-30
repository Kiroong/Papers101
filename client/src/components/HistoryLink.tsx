import { Box } from 'grommet'
import React, { useRef, useEffect, useState, Ref } from 'react'
import { PaperEntry } from '../redux/state/overview'
import * as d3 from 'd3'

interface Props {
    fromEntries: PaperEntry[]
    toEntries: PaperEntry[]
    markedEntries: PaperEntry[]
    setMarkedEntries: (entry: PaperEntry[]) => any
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
    setMarkedEntries,
    offsetHeight,
    cellHeight,
    onSelect,
}) => {
    const svgHeight: number = cellHeight * 100
    const svgWidth: number = 200
    const root = useRef<HTMLDivElement>(null)
    let selectHistory = () => {
      onSelect()
    }

    let handleCellClick = (event: any, d: any) => {
        if (markedEntries.map((me) => me.doi).includes(d.doi)) {
            setMarkedEntries(markedEntries.filter((me) => d.doi !== me.doi))
        } else {
            setMarkedEntries(markedEntries.concat([d]))
        }
    }

    let handleLinkClick = (event: any, d: any) => {
        const entry: PaperEntry = toEntries.filter(
            (te) => te.doi === d.toDoi
        )[0]
        if (markedEntries.map((me) => me.doi).includes(entry.doi)) {
            setMarkedEntries(markedEntries.filter((me) => entry.doi !== me.doi))
        } else {
            setMarkedEntries(markedEntries.concat([entry]))
        }
    }
    /*
    let handleCellMouseover = (event: any, d: any) => {
        let _root = d3.select(root.current).select('svg').select('.history')
        
        _root
            .selectAll('.cell-history')
            .filter((dd: any) => dd.doi === d.doi)
            .classed('hovered', true)
            .attr('fill', 'green')
            .raise()

        _root
            .selectAll('.line-history')
            .filter((dd: any) => dd.toDoi === d.doi)
            .classed('hovered', true)
            .attr('stroke', 'green')
            .raise()
    }
    */
    let handleLinkMouseover = (event: any, d: any) => {
        let _root = d3.select(root.current).select('svg').select('.history')
        /*
        _root
            .selectAll('.cell-history')
            .filter((dd: any) => dd.doi === d.toDoi)
            .classed('hovered', true)
            .attr('fill', 'green')
            .raise()
        */
        _root
            .selectAll('.line-history')
            .filter((dd: any) => dd.toDoi === d.toDoi)
            .classed('hovered', true)
            .attr('stroke', 'green')
            .raise()
    }

    let handleMouseout = (event: any, d: any) => {
        let _root = d3.select(root.current).select('svg').select('.history')
        /*
        _root
            .selectAll('.cell-history')
            .selectAll('.hovered')
            .classed('hovered', false)
            .attr('fill', 'white')
        */
        _root
            .selectAll('.line-history')
            .selectAll('.hovered')
            .classed('hovered', false)
            .attr('stroke', 'black')
    }

    useEffect(() => {
        // Init

        let _root = d3.select(root.current).select('svg').select('.history')
        _root
            .append('line')
            .classed('pillar', true)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', svgHeight)
            .style('stroke', 'black')
            .style('stroke-width', 5)

    }, [])

    useEffect(() => {
        let _root = d3.select(root.current).select('svg').select('.history')
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

        // 기존에 존재하는 history를 과거에 묻기
        _root
            .selectAll('.line-history')
            .classed('line-history', false)
            .classed('line-previous', true)

        // 새로운 히스토리 우측 안보이는곳에 생성하기
        _root
            .selectAll('.line-history')
            .data(_lineData)
            .join('line')
            .classed('line-history', true)
            .attr('x1', (d: HistoryLine) =>
                d.fromIndex >= 0 ? svgWidth : svgWidth * (0.95) + svgWidth
                //d.fromIndex >= 0 ? 0 : svgWidth * (0.95)
            )
            .attr('y1', (d: HistoryLine) =>
                d.fromIndex >= 0
                    ? (d.fromIndex + 0.5) * cellHeight
                    : (d.toIndex + 0.5) * cellHeight
            )
            .attr('x2', 2*svgWidth)
            .attr('y2', (d: HistoryLine) => (d.toIndex + 0.5) * cellHeight)
            .attr('stroke', (d) => {
                if(markedEntries.map((me) => me.doi).includes(d.toDoi)) {
                    return d3.schemeSet1[3];
                }
                else if(d.fromIndex > d.toIndex) {
                    return d3.schemeSet1[0]
                }
                else {
                    return d3.schemeSet1[8];
                }
            })
            .attr('stroke-width', 3)//cellHeight * 0.6)
            .attr('stroke-linecap', 'round')
            .attr('opacity', (d) => {
                if(markedEntries.map((me) => me.doi).includes(d.toDoi)) {
                    return 0.5;
                }
                else if(d.fromIndex > d.toIndex) {
                    return 0.5
                }
                else {
                    return 0.1;
                }
            })
            .attr('trasform', translate(svgWidth, 0))
            .on('click', (e, d) => handleLinkClick(e, d))

        
        // 애니메이션으로 옮기기

        _root
            .selectAll('line')
            .transition()
            .duration(1000)
            .attr('transform', translate(-svgWidth, 0))
            
        _root
            .selectAll('.line-previous')
            .transition()
            .remove()
        
        //.on('mouseover', (e, d) => handleLinkMouseover(e, d))
        //.on('mouseout', (e, d) => handleMouseout(e, d))
    }, [toEntries])
    /*
    useEffect(() => {
        let _root = d3.select(root.current).select('svg').select('.history')

        _root
            .selectAll('.cell-history')
            .filter((d: any) => {
                return markedEntries.map((me) => me.doi).includes(d.doi)
            })
            .attr('fill', 'red')
            .raise()

        _root
            .selectAll('.line-history')
            .filter((d: any) => {
                return markedEntries.map((me) => me.doi).includes(d.toDoi)
            })
            .attr('stroke', 'red')
            .raise()
    }, [markedEntries])
    */
    useEffect(() => {}, [offsetHeight, cellHeight])

    let matchToFrom = (toDoi: string): number => {
        return fromEntries.findIndex((fe) => fe.doi === toDoi)
    }
    return (
        <div ref={root} style={{ width: svgWidth }}>
            <div
                className={'history-header'}
                style={{ width: svgWidth, height: offsetHeight }}
            >
                <button onClick={selectHistory}>Restore</button>
            </div>
            <svg height={svgHeight} width={svgWidth}>
                <g
                    className={'history'}
                    height={cellHeight * 100}
                    width={svgWidth}
                ></g>
            </svg>
        </div>
    )
}

export default HistoryLink