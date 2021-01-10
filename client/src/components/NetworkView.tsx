import cytoscape from "cytoscape";
// @ts-ignore
import popper from "cytoscape-popper";
import * as d3 from "d3";
import React, { useLayoutEffect, useRef, useState } from "react";
import { PaperEntry } from "../redux/state/overview";

cytoscape.use(popper);

interface Props {
  seedPapers: PaperEntry[];
  selectedEntry: PaperEntry | null;
  cohesivenesses: number[];
}

const NetworkView: React.FC<Props> = ({
  seedPapers,
  selectedEntry,
  cohesivenesses,
}) => {
  const networkGraphContainer = useRef<HTMLDivElement>(null);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  useLayoutEffect(() => {
    if (networkGraphContainer.current) {
      const papers = [...seedPapers];
      if (selectedEntry) {
        papers.push(selectedEntry);
      }
      setCy(
        cytoscape({
          container: networkGraphContainer.current,
          elements: [
            // nodes
            ...papers.map((entry, index) => ({
              data: {
                id: `NODE_${entry.doi}`,
                entry,
              },
              style: {
                width: 15,
                height: 15,
                label: entry.title.includes(":")
                  ? entry.title.split(":")[0].split(" ").slice(0, 3).join(" ")
                  : entry.title.split(" ").slice(0, 2).join(" "),
                "font-size": "0.5em",
                "background-color":
                  (entry.doi === selectedEntry?.doi && !seedPapers.map(p => p.doi).includes(selectedEntry.doi))
                    ? d3.schemeGreys[4][1]
                    : cohesivenesses[seedPapers.indexOf(entry)] === undefined
                    ? d3.interpolatePurples(0.5)
                    : d3.interpolateBlues(0.3 + 0.7 * cohesivenesses[seedPapers.indexOf(entry)]),
              },
            })),
            // edges
            ...papers
              .map((entry) => {
                return entry.referencing.map((toDoi) => ({
                  toDoi,
                  fromDoi: entry.doi,
                }));
              })
              .reduce((a, b) => a.concat(b), [])
              .filter(
                ({ fromDoi, toDoi }) =>
                  papers.map((x) => x.doi).includes(toDoi) && fromDoi !== toDoi
              )
              .map(({ fromDoi, toDoi }) => ({
                data: {
                  id: `EDGE_${fromDoi}_${toDoi}`,
                  source: `NODE_${fromDoi}`,
                  target: `NODE_${toDoi}`,
                  distance: 1,
                },
              })),
          ],

          style: [
            // the stylesheet for the graph
            {
              selector: "node",
              style: {
                "background-color": "#666",
              },
            },
            {
              selector: "edge",
              style: {
                // width: 5,
                "line-color": "#ccc",
                "target-arrow-color": "#ccc",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
              },
            },
          ],

          layout: {
            name: "cose",
            idealEdgeLength: (edge) => {
              return edge._private.data.distance;
            },
            // edgeElasticity: edge => 10,
            animate: false,
          },
          userZoomingEnabled: false,
        })
      );
    }
  }, [networkGraphContainer, seedPapers, selectedEntry, cohesivenesses]);

  useLayoutEffect(() => {
    if (cy) {
      cy.nodes().unbind("click");
      cy.nodes().bind("click", (event) => {
        // const node = event.target;
        // const issueKey = ((node as any)._private.data.id as string).slice(5);
        // onClick(issueKey);
      });
    }
  }, [cy]);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      ref={networkGraphContainer}
    ></div>
  );
};

export default NetworkView;
