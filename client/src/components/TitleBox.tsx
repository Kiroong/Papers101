import { Layer, Table, TableBody, TableCell, TableRow } from "grommet";
import React, { useState } from "react";
import { PaperEntry } from "../redux/state/overview";

interface Props {
  onMouseOver: any;
  onMouseOut: any;
  onClick: any;
  style: any;
  entry: PaperEntry;
}

const TitleBox: React.FC<Props> = ({ entry, onMouseOver, onMouseOut, onClick, style }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={() => {
        // setShow(true);
        onClick();
      }}
      style={{
        ...style,
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      <strong
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {entry.title}
      </strong>
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell scope="row">Title</TableCell>
                <TableCell>{entry.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">Year</TableCell>
                <TableCell>{entry.year}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">Abstract</TableCell>
                <TableCell>{entry.abstract}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Layer>
      )}
    </div>
  );
};

export default TitleBox;
