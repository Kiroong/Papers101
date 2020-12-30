import * as d3 from "d3";
import React, { useLayoutEffect, useRef, useState } from "react";

interface Props {
  similarities: number[];
  maxOfSum: number;
  color: readonly string[];
}

const SimilaritiesBar: React.FC<Props> = ({ similarities, maxOfSum, color }) => {
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
      style={{
        display: "flex",
        justifyContent: "start",
        width: "100%",
        height: "100%",
      }}
      ref={container}
    >
      {width &&
        height &&
        similarities.map((sim, i) => (
          <div
            style={{
              marginTop: height * 0.25,
              height: height * 0.5,
              width: (sim / maxOfSum) * width * 0.8,
              backgroundColor: color[Math.min(color.length-1, i)],
            }}
          />
        ))}
    </div>
  );
};

export default SimilaritiesBar;
