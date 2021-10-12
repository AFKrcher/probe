import React, { useState, useEffect } from "react";

// @material-ui
import { makeStyles, TextField, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: 25,
    backgroundColor: theme.palette.grid.background,
    width: "50%",
  },
}));

export const SearchBar = ({
  setSelector,
  multiple = true,
  placeholder = "Press ENTER to add another search term",
}) => {
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {}, [setSelector]);

  return (
    <div>
      <Autocomplete
        multiple={multiple}
        // value={value}
        // inputValue={inputValue}
        freeSolo
        filterSelectedOptions
        options={[]}
        onInputChange={(e, values) => {
          console.log(values)
          if (!multiple) {
            setSelector(values);
          }
        }}
        onKeyDown={(e) => {
          if (e.code === "Tab" || e.key === "Tab" || e.keyIdentifier === "Tab") {
            console.log('tab')
            setValue(inputValue);
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
                "orbit.orbit": {
                  $in: val,
                },
              },
            ],
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
          setInputValue(values)
          val[0] === "" ? setSelector({}) : setSelector(obj);
        }}
        renderInput={(params) => {
          // params.inputProps.onKeyDown = handleOnKeyDown;
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
