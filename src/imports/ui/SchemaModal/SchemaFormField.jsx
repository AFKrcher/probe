import React, { useState } from 'react';
// import Form from 'react-bootstrap/Form'
// import Col from 'react-bootstrap/Col'
// import Select from 'react-select';
import { MultiSelectTextInput } from './MultiSelectTextInput';
import { FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import { Field } from 'formik';

const useStyles = makeStyles((theme) => ({
  formfield: {

  }
}));

const typeOptions = [ "Number", "String"];

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaFormField = ( { className, index, field, setFieldValue, handleFieldChange, editing} ) => {
  const classes = useStyles();

  const onNameChange = (event) => {
    setFieldValue(event.target.name, event.target.value.toLowerCase());
  }

  const onTypeChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  }

  const handleKeyDown = (event) => {
    if (!allowedInputText) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        newField = field;
        newField.allowedValues = [...field.allowedValues, createOption(allowedInputText)];
        setAllowedInputText("");
        event.preventDefault();
    }
  }
  
  return (
      <Grid container>
        <Grid container item spacing={2}>
          <Grid item xs>
            <Field
              inputProps={{
                name: `fields.${index}.name`
              }}
              onChange={onNameChange}
              label="Field name"
              margin="dense"
              required
              fullWidth
              variant="outlined"
              component={TextField}
            />
          </Grid>
          <Grid item xs>
            <FormControl 
              variant="outlined"
              margin="dense"
              fullWidth
            >
              <InputLabel htmlFor={`schema-field-${index}-data-type-label`}>
                Data type
              </InputLabel>
              <Field 
                label="Data type"
                inputProps={{
                  id: `schema-field-${index}-data-type-label`,
                  name: `fields.${index}.type`
                }}
                value={field.type}
                onChange={onTypeChange}
                disabled={!editing}
                component={Select}
              >
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="number">Number</MenuItem>
              </Field>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {console.log(field.allowed)}
          <MultiSelectTextInput
            index={index}
            allowedValues={field.allowed} 
            disabled={!editing}
            setFieldValue={setFieldValue}
          />
        </Grid>
      </Grid>

      // <Form.Row>
      //   <Col>
      //     <Form.Control disabled={!editing} onChange={handleNameChange} value={field.name} placeholder="Field name" />
      //   </Col>
      //   <Col>
      //     <Select 
      //       options={typeOptions}
      //       value={field.type}
      //       onChange={handleTypeChange}
      //       placeholder="Data type"
      //       isDisabled={!editing}
      //     />
      //   </Col>
      // </Form.Row>
      // <Form.Row className="pt-2">
      //   <Col>
      //     <MultiSelectTextInput 
      //       inputText={allowedInputText} 
      //       value={field.allowedValues}
      //       handleChange={handleAllowedChange}
      //       handleInputChange={handleInputChange}
      //       handleKeyDown={handleKeyDown}
      //       disabled={!editing}
      //     />
      //   </Col>
      // </Form.Row>
  )
};
