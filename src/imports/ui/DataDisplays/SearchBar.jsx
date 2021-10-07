import React, { useState, useEffect } from "react";

// @material-ui
import {
  Chip,
  IconButton,
  makeStyles,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: 20,
    backgroundColor: theme.palette.grid.background,
  },
}));

export const SearchBar = ({
  placeholder = "Search...",
  filter,
  setFilter,
  selector,
  setSelector,
}) => {
  const classes = useStyles();
  useEffect(() => {}, [filter, setFilter, selector, setSelector]);

  return (
    <div>
      <Autocomplete
        multiple
        freeSolo
        filterSelectedOptions
        options={[]}
        onChange={(e, values) => {
          let val = values.join().toUpperCase().split(",");
          let obj = {
            $or: [
              {
                noradID: {
                  $in: val,
                },
              },
              {
                "orbit.orbit": {
                  $in: val,
                },
              },
            ],
          };
          values.map((val) => {
            console.log(val);
          });
          // let val = e.target.value.replace(/\s/g, "").toUpperCase().split(",");
          // let obj = {
          //   $or: [
          //     {
          //       noradID: {
          //         $in: val,
          //       },
          //     },
          //     {
          //       "orbit.orbit": {
          //         $in: val,
          //       },
          //     },
          //   ],
          // };
          // let val2 = e.target.value.split(", ");
          // val2.map((v) => {
          //   if (v.replace(/\s/g, "") !== "") {
          //     obj.$or.push({
          //       "descriptionShort.descriptionShort": {
          //         $regex: v,
          //         $options: "i",
          //       },
          //     });
          //   }
          // });
          // !val && selector !== {} ? setSelector({}) : setSelector(obj);
        }}
        // onInputChange={(event, values) => console.log(values)}
        renderInput={(params) => (
          <TextField
            {...params}
            // variant="standard"
            label="Search"
            placeholder="Press enter to add another search term"
          />
        )}
      />
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          let val = e.target.value.replace(/\s/g, "").toUpperCase().split(",");
          let obj = {
            $or: [
              {
                noradID: {
                  $in: val,
                },
              },
              {
                "orbit.orbit": {
                  $in: val,
                },
              },
            ],
          };
          let val2 = e.target.value.split(", ");
          val2.map((v) => {
            if (v.replace(/\s/g, "") !== "") {
              obj.$or.push({
                "descriptionShort.descriptionShort": {
                  $regex: v,
                  $options: "i",
                },
              });
            }
          });
          !val && selector !== {} ? setSelector({}) : setSelector(obj);
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
    </div>
  );
};
