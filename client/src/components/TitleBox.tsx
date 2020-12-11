import { Layer, Table, TableBody, TableCell, TableRow } from "grommet";
import React, { useState } from "react";
import { PaperEntry } from "../redux/state/overview";

interface Props {
  entry: PaperEntry;
  onClick: () => any;
}

const TitleBox: React.FC<Props> = ({ entry, onClick }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      onClick={() => {
        setShow(true);
      }}
      style={{
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
