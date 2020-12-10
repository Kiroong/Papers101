import { Box } from "grommet";
import React from "react";
import { PaperEntry } from "../redux/state/overview";

interface Props {
  fromEntries: PaperEntry[];
  toEntries: PaperEntry[];
  markedEntries: PaperEntry[];
  offsetHeight: number;
  cellHeight: number;
  onSelect: () => any;
}

const HistoryLink: React.FC<Props> = ({
  fromEntries,
  toEntries,
  markedEntries,
  offsetHeight,
  cellHeight,
  onSelect,
}) => {
  return (
    <div style={{ width: 200 }}>
      <div
        style={{
          height: offsetHeight,
          backgroundColor: "lightgreen",
          border: "1px solid green",
        }}
      />
      {fromEntries.map((_) => (
        <div
          style={{
            height: cellHeight,
            backgroundColor: "pink",
            border: "1px solid red",
          }}
        />
      ))}
    </div>
  );
};

export default HistoryLink;
