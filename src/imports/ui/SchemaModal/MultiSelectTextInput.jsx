import React, { useState } from "react";

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
    color: theme.palette.text.disabled,
  },
}));

export const MultiSelectTextInput = ({
  editing,
  index,
  allowedValues,
  disabled,
  setFieldValue,
}) => {
  const classes = useStyles();
  const [inputText, setInputText] = useState("");

  const fieldName = `fields.${index}.allowedValues`;

  const handleChange = (event, values) => {
    setFieldValue(fieldName, values);
  };

  const handleInputChange = (event, newInputValue) => {
    const options = newInputValue.split(/[,]+/);
    const fieldValue = [...allowedValues, ...options]
      .map((x) => x.trim())
      .filter((x) => x);

    if (options.length > 1) {
      handleChange(event, fieldValue);
    } else {
      setInputText(newInputValue);
    }
  };

  return (
    <React.Fragment>
      <Field
        multiple
        disableClearable
        options={[]}
        freeSolo
        renderTags={(options, getTagProps) =>
          options.map((option, index) => (
            <Chip
              key={index}
              deleteIcon={<Close />}
              size="small"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        value={allowedValues}
        inputValue={inputText}
        onChange={handleChange}
        onInputChange={handleInputChange}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Allowed Strings"
            variant="outlined"
            fullWidth
            margin="dense"
          />
        )}
        component={Autocomplete}
      />
      {editing && (
        <FormHelperText className={classes.helpers}>
          OPTIONAL: Provide a list of allowed values delineated by commas. (E.g.
          foo, baz, bar)
        </FormHelperText>
      )}
    </React.Fragment>
  );
};
