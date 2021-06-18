import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab'
import { Chip, TextField } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Field } from 'formik';

export const MultiSelectTextInput = ({ index, allowedValues, disabled, setFieldValue }) => {
  const fieldName = `fields.${index}.allowed`;
  const [inputText, setInputText] = useState("");

  const handleChange = (event, values) => {
    console.log(fieldName);
    console.log(values);
    setFieldValue(fieldName, values);
  }

  const handleInputChange = (event, newInputValue) => {
    console.log(allowedValues);

    const options = newInputValue.split(/[ ,]+/);
    const fieldValue = [...allowedValues, ...options].map(x => x.trim()).filter(x => x);
    console.log(event, newInputValue);

    if (options.length > 1) {
      handleChange(event, fieldValue);
    } else {
      setInputText(newInputValue);
    }
  }

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
          label="Allowed values"
          variant="outlined"
          fullWidth
          margin="dense" 
        />
      )}
      component={Autocomplete}
    />
  )
};