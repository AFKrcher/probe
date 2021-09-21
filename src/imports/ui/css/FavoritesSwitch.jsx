import * as React from "react";

// @material-ui
import { styled, FormGroup, FormControlLabel, Switch } from "@material-ui/core";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 9,
  "& .MuiSwitch-track": {
    borderRadius: 11,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
  },
  "& .MuiSwitch-thumb": {
    width: 20,
    height: 20,
    margin: 0,
  },
}));

export default function FavoritesSwitch(props) {
  return (
    <FormGroup>
      <FormControlLabel control={<CustomSwitch {...props} />} />
    </FormGroup>
  );
}
