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
    svgWidth: number
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
    svgWidth,
    offsetHeight,
    cellHeight,
    onSelect,
}) => {
    const svgHeight: number = cellHeight * 100
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
        console.log('cell')
        let _root = d3.select(root.current).select('svg').select('.history')

        /*
        _root
            .selectAll('.cell-history')
            .data(fromEntries)
            .join('rect')
            .classed('cell-history', true)
            .attr('x', 0)
            .attr('y', (d, i) => i * cellHeight)
            .attr('height', cellHeight*0.8)
            .attr('width', svgWidth / 4)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', (d: PaperEntry) => 
              markedEntries.map((me) => me.doi).includes(d.doi)
                    ? 'red'
                    : 'white'
            )
            .on('click', (e, d) => handleCellClick(e, d))
        //.on('mouseover', (e, d) => handleCellMouseover(e, d))
        //.on('mouseout', (e, d) => handleMouseout(e, d))
        */
    }, [fromEntries])

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

        _root
            .selectAll('.line-history')
            .data(_lineData)
            .join('line')
            .classed('line-history', true)
            .attr('x1', (d: HistoryLine) =>
                d.fromIndex >= 0 ? 0 : svgWidth * (0.95)
            )
            .attr('y1', (d: HistoryLine) =>
                d.fromIndex >= 0
                    ? (d.fromIndex + 0.5) * cellHeight
                    : (d.toIndex + 0.5) * cellHeight
            )
            .attr('x2', svgWidth)
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
            .attr('opacity', (d) => 0.5)
            .on('click', (e, d) => handleLinkClick(e, d))
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
                <button onClick={selectHistory}>R</button>
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