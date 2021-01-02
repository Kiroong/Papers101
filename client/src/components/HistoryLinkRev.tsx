import { Box } from 'grommet'
import React, { useRef, useEffect, useState, Ref } from 'react'
import { PaperEntry } from '../redux/state/overview'
import * as d3 from 'd3'

interface Props {
    histories: PaperEntry[][]
    offsetHeight: number
    svgWidth: number
    cellHeight: number
    onSelectHistory: (historyIndex: number) => any
    numHistories: number
    hoveredEntry: PaperEntry | null
    setHoveredEntry: (entry: PaperEntry) => any
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
    histories,
    offsetHeight,
    cellHeight,
    svgWidth,
    numHistories,
    hoveredEntry,
    setHoveredEntry,
}) => {
    const svgHeight: number = cellHeight * 50
    const [prevEntries, setPrevEntries] = useState<PaperEntry[]>([])
    const root = useRef<HTMLDivElement>(null)

    let isEntriesEqual = (newEntries: PaperEntry[]): boolean => {
        let prevDois: string[] = prevEntries.map((d) => d.doi)
        let nextDois: string[] = newEntries.map((d) => d.doi)
        if (prevEntries.length === 0) {
            return true
        }
        if (prevDois.length != nextDois.length) {
            return true
        }

        for (let i in prevDois) {
            if (prevDois[i] !== nextDois[i]) {
                return true
            }
        }
        return false
    }


    useEffect(() => {
        console.log('num change')
        if(numHistories >= 5) {

        }
        else {

        }
    }, [numHistories])

    useEffect(() => {
        console.log('hover')

    }, [hoveredEntry])

    return (
        <div ref={root} style={{ width: svgWidth }}>
            <div
                className={'history-header'}
                style={{ width: svgWidth, height: offsetHeight }}
            >
            
                {[...Array(numHistories)].map((n, i) => {
                    return(
                        <div style={{ width: svgWidth/numHistories, height: offsetHeight, float:'left'}}>
                            버튼공간
                        </div>
                    )
                })
                }
            </div>
            <svg height={svgHeight} width={svgWidth}>
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
