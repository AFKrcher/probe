import React, { useState } from "react";
import PropTypes from "prop-types";
// Imports
import { Field } from "formik";

// @material-ui
import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField, FormHelperText, makeStyles } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  helpers: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 4,
    color: theme.palette.text.disabled
  },
  helpersError: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 4,
    color: theme.palette.error.main
  }
}));

export const MultiSelectTextInput = ({ editing, index, allowedValues, setFieldValue, currentStringMax, errors }) => {
  const classes = useStyles();
  const [inputText, setInputText] = useState("");

  const fieldName = `fields.${index}.allowedValues`;

  const handleChange = (event, values) => {
    setFieldValue(fieldName, values);
  };

  const handleInputChange = (event, newInputValue) => {
    const options = newInputValue.split(/[,]+/);
    const filteredOptions = options.map((option) => {
      if (currentStringMax) {
        if (option.length > currentStringMax) {
          return option.substr(0, currentStringMax);
        } else {
          return option;
        }
      } else {
        return option;
      }
    });
    const fieldValue = [...allowedValues, ...filteredOptions].map((x) => x.trim()).filter((x) => x);

    if (options.length > 1) {
      handleChange(event, fieldValue);
    } else {
      setInputText(newInputValue);
    }
  };

  const allowedValuesErrorDetermination = (index) => {
    let determination = false;
    if (errors.fields) {
      if (errors.fields[index]) {
        if (errors.fields[index].allowedValues) {
          determination = errors.fields[index].allowedValues;
        }
      }
    }
    return determination;
  };

  return (
    <React.Fragment>
      <Field
        multiple
        disableClearable
        options={[]}
        freeSolo
        renderTags={(options, getTagProps) =>
          options.map((option, index) => <Chip key={index} deleteIcon={<Close />} size="small" label={option} {...getTagProps({ index })} />)
        }
        value={allowedValues}
        inputValue={inputText}
        onChange={handleChange}
        onInputChange={handleInputChange}
        disabled={!editing}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Allowed Strings"
            error={allowedValuesErrorDetermination(index) ? true : false}
            variant="outlined"
            fullWidth
            margin="dense"
          />
        )}
        component={Autocomplete}
      />
      {editing && (
        <FormHelperText className={allowedValuesErrorDetermination(index) ? classes.helpersError : classes.helpers}>
          {allowedValuesErrorDetermination(index) || "OPTIONAL: Provide a list of allowed values delineated by commas"}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};

// Prop checking
MultiSelectTextInput.propTypes = {
  editing: PropTypes.bool,
  index: PropTypes.number,
  allowedValues: PropTypes.array,
  setFieldValue: PropTypes.func,
  currentStringMax: PropTypes.string,
  errors: PropTypes.object
};
