import React, { useState } from "react";

// @material-ui
import { IconButton, makeStyles, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: 20,
    backgroundColor: theme.palette.grid.background,
  },
}));

export const SearchBar = ({ filter, setFilter, selector, setSelector }) => {
  const classes = useStyles();
  return (
    <TextField
      variant="outlined"
      placeholder="Search Schemas…"
      value={filter}
      onChange={(e) => {
        setSelector({
          $or: [
            { noradID: { $in: filter.split(",") } },
            // { "type.type": "manMade" },
          ],
        });
        setFilter(e.target.value);
        console.log("selector", selector);
        console.log("filter", filter);
      }}
      className={classes.textField}
      InputProps={{
        startAdornment: (
          <SearchIcon fontSize="small" style={{ marginRight: 5 }} />
        ),
        endAdornment: (
          <IconButton
            title="Clear"
            aria-label="Clear"
            size="small"
            onClick={() => {
              setSelector({});
              setFilter("");
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
    />
  );
};
