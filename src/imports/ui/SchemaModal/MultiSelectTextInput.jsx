import React, { useState } from "react";
import { Field } from "formik";
// @material-ui
import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

export const MultiSelectTextInput = ({
  index,
  allowedValues,
  disabled,
  setFieldValue,
}) => {
  const fieldName = `fields.${index}.allowedValues`;
  const [inputText, setInputText] = useState("");

  const handleChange = (event, values) => {
    setFieldValue(fieldName, values);
  };

  const handleInputChange = (event, newInputValue) => {
    const options = newInputValue.split(/[ ,]+/);
    const fieldValue = [...allowedValues, ...options]
      .map((x) => x.trim())
      .filter((x) => x);
    console.log(event, newInputValue);

    if (options.length > 1) {
      handleChange(event, fieldValue);
    } else {
      setInputText(newInputValue);
    }
  };

  return (
    <Field
      multiple
      disableClearable
      options={[]}
      freeSolo
      renderTags={(options, getTagProps) =>
        options.map((option, index) => (
          <Chip
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
          helperText={
            <>
              OPTIONAL: separate each string constraint with a comma (e.g.{" "}
              <strong>foo, bar, baz</strong>)
            </>
          }
        />
      )}
      component={Autocomplete}
    />
  );
};
