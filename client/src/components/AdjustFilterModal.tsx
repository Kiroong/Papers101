import { Box, Button, Grid } from "grommet";
import React, { useState } from "react";
import { actionOverview } from "../redux/action/overview-actions";
import { useThunkDispatch } from "../redux/action/root-action";
import { useRootSelector } from "../redux/state/root-state";

interface Props {
  onClose: () => any;
}

const AdjustWeightModal: React.FC<Props> = ({ onClose }) => {
  const [filter, setFilter] = useState(
    useRootSelector(
      (state) =>
        state.overview.filter || {
          year: { from: 1980, to: 2020 },
          authors: [],
        }
    )
  );
  const dispatch = useThunkDispatch();
  return (
    <Box direction="column" pad="medium">
      <Grid columns={["1fr", "1fr"]} gap="small">

        <div>Year From</div>
        <input
          type="number"
          value={filter!.year.from}
          onChange={(e) =>
            setFilter({
              ...filter,
              year: {
                ...filter!.year,
                from: +e.target.value,
              },
            })
          }
        />

        <div>Year To</div>
        <input
          type="number"
          value={filter!.year.to}
          onChange={(e) =>
            setFilter({
              ...filter,
              year: {
                ...filter!.year,
                to: +e.target.value,
              },
            })
          }
        />

      </Grid>
      <Box fill={true} justify="center" margin={{ top: "small" }}>
        <Button
          primary
          color="dark-2"
          label="Apply"
          onClick={() => {
            dispatch(actionOverview.setFilter(filter));
            onClose();
          }}
        />
      </Box>
    </Box>
  );
};

export default AdjustWeightModal;
