import * as d3 from "d3";
import { Box } from "grommet";
import React, { useLayoutEffect, useRef, useState } from "react";

interface Props {
  similarities: number[];
  maxOfSum: number;
}

const SimilaritiesBar: React.FC<Props> = ({ similarities, maxOfSum }) => {
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
    <Box justify="center" fill={true} direction="row" ref={container}>
      {width && height && similarities.map((sim, i) => (
        <Box
          height={`${height}px`}
          width={`${sim / maxOfSum * width}px`}
          background={d3.schemeTableau10[Math.min(9, i)]}
        />
      ))}
    </Box>
  );
};

export default SimilaritiesBar;
