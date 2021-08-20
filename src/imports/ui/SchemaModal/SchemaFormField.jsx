import React from "react";
import { Field, ErrorMessage } from "formik";
// Components
import { MultiSelectTextInput } from "./MultiSelectTextInput";

// @material-ui
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
} from "@material-ui/core";

export const SchemaFormField = ({
  touched,
  errors,
  index,
  field,
  setFieldValue,
  editing,
}) => {
  const nameErrors =
    (errors.fields?.length && errors.fields[index]?.name) || {};
  const typeErrors =
    (errors.fields?.length && errors.fields[index]?.type) || {};

  const onNameChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onTypeChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onRequiredChange = (event) => {
    setFieldValue(event.target.name, event.target.checked);
  };

  return (
    <Grid container item>
      <Grid container item spacing={2}>
        <Grid item xs>
          <Field
            inputProps={{
              name: `fields.${index}.name`,
            }}
            value={field.name}
            onChange={onNameChange}
            label="Field Name or Units"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            disabled={!editing}
            component={TextField}
            error={nameErrors === "Required" ? true : false}
          />
          <ErrorMessage name={`fields.${index}.name`} component="div" />
        </Grid>
        <Grid item xs>
          <FormControl
            disabled={!editing}
            variant="outlined"
            margin="dense"
            required
            fullWidth
          >
            <InputLabel
              htmlFor={`schema-field-${index}-data-type-label`}
              error={typeErrors === "Required" ? true : false}
            >
              Data type
            </InputLabel>
            <Field
              label="Data Type"
              inputProps={{
                id: `schema-field-${index}-data-type-label`,
                name: `fields.${index}.type`,
              }}
              value={field.type}
              onChange={onTypeChange}
              disabled={!editing}
              component={Select}
              error={typeErrors === "Required" ? true : false}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Field>
            <ErrorMessage name={`fields.${index}.type`} component="div" />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "date" ? (
          ""
        ) : (
          <>
            <MultiSelectTextInput
              index={index}
              allowedValues={field.allowedValues}
              disabled={!editing}
              setFieldValue={setFieldValue}
            />
          </>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Field
            inputProps={{
              id: `schema-field-${index}-required-label`,
              name: `fields.${index}.required`,
            }}
            checked={field.required}
            onChange={onRequiredChange}
            margin="dense"
            disabled={!editing}
            component={Checkbox}
            type="checkbox"
          />
          <InputLabel htmlFor={`schema-field-${index}-required-label`}>
            Required Input?
          </InputLabel>
        </div>
      </Grid>
    </Grid>
  );
};
