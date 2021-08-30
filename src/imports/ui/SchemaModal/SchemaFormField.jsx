import React, { useState } from "react";
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
  FormHelperText,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  field: {
    display: "flex", 
    alignItems: "center"
  },
  helpers: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 4,
  },
  helpersError: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 4,
    color: theme.palette.error.main,
  },
}));

export const SchemaFormField = ({
  errors,
  index,
  field,
  setFieldValue,
  editing,
}) => {
  const [touched, setTouched] = useState(false);
  const classes = useStyles();

  const nameErrors =
    (errors.fields?.length && errors.fields[index]?.name) || {};
  const typeErrors =
    (errors.fields?.length && errors.fields[index]?.type) || {};

  const onNameChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onMinChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onMaxChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onTypeChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onRequiredChange = (event) => {
    setFieldValue(event.target.name, event.target.checked);
  };

  const handleBlur = () => {
    setTouched(true);
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
            onBlur={handleBlur}
            error={nameErrors === "Required" && touched ? true : false}
          />
          {nameErrors === "Required" && touched ? (
            <Typography variant="caption" className={classes.helpersError}>
              {nameErrors}
            </Typography>
          ) : null}
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
              error={typeErrors === "Required" && touched ? true : false}
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
              onBlur={handleBlur}
              error={typeErrors === "Required" && touched ? true : false}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Field>
          </FormControl>
          {typeErrors === "Required" && touched ? (
            <Typography variant="caption" className={classes.helpersError}>
              {typeErrors}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "date" || !field.type ? (
          ""
        ) : field.type === "number" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs>
                <Field
                  inputProps={{
                    name: `fields.${index}.min`,
                  }}
                  onChange={onMinChange}
                  label="Minimum Value"
                  margin="dense"
                  defaultValue={field.min}
                  fullWidth
                  type="number"
                  step="any"
                  variant="outlined"
                  disabled={!editing}
                  component={TextField}
                />
              </Grid>
              <Grid item xs>
                <Field
                  inputProps={{
                    name: `fields.${index}.max`,
                  }}
                  onChange={onMaxChange}
                  defaultValue={field.max}
                  label="Maximum Value"
                  margin="dense"
                  fullWidth
                  type="number"
                  step="any"
                  variant="outlined"
                  disabled={!editing}
                  component={TextField}
                />
              </Grid>
            </Grid>
            <FormHelperText className={classes.helpers}>
              OPTIONAL: Provide a minimum and maximum value for the number
            </FormHelperText>
          </>
        ) : (
          <>
            <Grid container item spacing={2}>
              <Grid item xs>
                <Field
                  inputProps={{
                    name: `fields.${index}.stringMax`,
                    min: "1"
                  }}
                  onChange={onMaxChange}
                  defaultValue={field.stringMax}
                  label="Maximum Length"
                  margin="dense"
                  fullWidth
                  type="number"
                  step="any"
                  variant="outlined"
                  disabled={!editing}
                  component={TextField}
                />
              <FormHelperText className={classes.helpers}>
                OPTIONAL: Provide a maximum string length
                {/* Example: Please note that the DataGrid's descriptionShort column can fit ~85 characters (on a 1920 x 1080 screen) before overflow happens */}
              </FormHelperText>
              </Grid>
              <Grid item xs>
                <MultiSelectTextInput
                  index={index}
                  allowedValues={field.allowedValues}
                  disabled={!editing}
                  setFieldValue={setFieldValue}
                />
              </Grid>
            </Grid>
          </>
        )}
        <div className={classes.field}>
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
