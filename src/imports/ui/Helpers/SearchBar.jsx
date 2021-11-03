import React, { useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui
import { makeStyles, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  textField: {
    backgroundColor: theme.palette.grid.background,
    width: "100%",
  },
}));

export const SearchBar = ({
  setSelector,
  multiple = true,
  placeholder = "Press ENTER to add another search term",
}) => {
  const classes = useStyles();

  useEffect(() => {
    // flag for re-render on change in the selector from parent component
  }, [setSelector]);

  return (
    <div>
      <Autocomplete
        multiple={multiple}
        freeSolo
        filterSelectedOptions
        options={[]}
        onInputChange={(e, values) => {
          if (!multiple) {
            setSelector(values);
          }
        }}
        onChange={(e, values) => {
          let val = values.join().toUpperCase().trim().split(",");
          let obj = {
            $or: [
              {
                noradID: {
                  $in: val,
                },
              },
              {
                "orbits.orbit": {
                  $in: val,
                },
              },
            ],
            isDeleted: false,
          };
          val.map((v) => {
            if (v.replace(/\s/g, "") !== "") {
              obj.$or.push({
                "descriptionShort.descriptionShort": {
                  $regex: v,
                  $options: "i",
                },
              });
            }
          });
          val.map((v) => {
            if (v.replace(/\s/g, "") !== "") {
              obj.$or.push({
                "names.name": {
                  $regex: v,
                  $options: "i",
                },
              });
            }
          });
          val.map((v) => {
            if (v.replace(/\s/g, "") !== "") {
              obj.$or.push({
                "types.type": {
                  $regex: v,
                  $options: "i",
                },
              });
            }
          });
          val[0] === "" ? setSelector({ isDeleted: false }) : setSelector(obj);
        }}
        renderInput={(params) => {
          params.InputProps.startAdornment
            ? params.InputProps.startAdornment.unshift(
                <SearchIcon fontSize="small" style={{ marginRight: 5 }} />
              )
            : (params.InputProps.startAdornment = (
                <SearchIcon fontSize="small" style={{ marginRight: 5 }} />
              ));
          return (
            <TextField
              {...params}
              placeholder={placeholder}
              className={classes.textField}
              variant="outlined"
            />
          );
        }}
      />
    </div>
  );
};

// Prop checking
SearchBar.propTypes = {
  setSelector: PropTypes.func,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
};
