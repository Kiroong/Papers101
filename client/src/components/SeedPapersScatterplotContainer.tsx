import React, { useLayoutEffect, useRef, useState } from "react";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";
import SeedPapersScatterplot from "./SeedPapersScatterplot";

const SeedPapersScatterplotContainer: React.FC = () => {
  const dispatch = useThunkDispatch();
  const seedPapers = useRootSelector((state) => state.overview.seedPapers);
  const targetPapers = useRootSelector((state) => state.overview.paperEntries.slice(0, 50));
  console.log({ markedPapers: targetPapers })
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (container.current && (!width || !height)) {
      setWidth(container.current.getBoundingClientRect().width);
      setHeight(container.current.getBoundingClientRect().height);
    }
  });
  return (
    <div
      style={{ height: "100%", width: "100%" }}
      ref={container}
    >
      {width && height && (
        <SeedPapersScatterplot
          seedPapers={seedPapers}
          markedPapers={targetPapers}
          svgWidth={width * 0.9}
          svgHeight={height * 0.9}
          onClick={() => {}}
          xLabel="score"
          yLabel="year" 
          xThreshold={null}
          yThreshold={2017}
        />
      )}
    </div>
  );
};

export default SeedPapersScatterplotContainer;
