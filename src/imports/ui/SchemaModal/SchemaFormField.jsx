import React, { useState } from "react";
import { Field } from "formik";
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
    alignItems: "center",
  },
  helpersError: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 8,
    color: theme.palette.error.main,
  },
  helpers: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 8,
    color: theme.palette.text.disabled,
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

  const onIsUniqueChange = (event) => {
    setFieldValue(event.target.name, event.target.checked);
  };

  const maxErrorMessage = (index) => {
    let contents = null;
    if (editing && errors["fields"]) {
      if (editing && errors.fields[index]) {
        if (errors.fields[index].max) {
          let err = errors.fields[index].max;
          const toIndex = err.indexOf("to ");
          const to = err.substr(toIndex);
          const numberIndex = to.indexOf(" ");
          const number = to.substr(numberIndex);
          const message = `Maximum Value must be greater than the Minimum Value of ${number}`;
          contents = (
            <FormHelperText className={classes.helpersError}>
              {message}
            </FormHelperText>
          );
        }
      } else {
        contents = (
          <FormHelperText className={classes.helpers}>
            OPTIONAL: Provide a minimum and/or maximum value for the number
          </FormHelperText>
        );
      }
    } else {
      contents = (
        <FormHelperText className={classes.helpers}>
          OPTIONAL: Provide a minimum and/or maximum value for the number
        </FormHelperText>
      );
    }
    return contents;
  };

  const maxErrorDetermination = (index) => {
    let determination = false;
    if (errors.fields) {
      if (errors.fields[index]) {
        if (errors.fields[index].max) {
          determination = true;
        }
      }
    }
    return determination;
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
            placeholder="camelCase"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            disabled={!editing}
            component={TextField}
            onBlur={handleBlur}
            error={nameErrors === "Required" && touched ? true : false}
            maxLength={255}
          />
          {editing ? (
            nameErrors === "Required" && touched ? (
              <Typography variant="caption" className={classes.helpersError}>
                {nameErrors}
              </Typography>
            ) : (
              <Typography variant="caption" className={classes.helpers}>
                {`${field.name.length} / 50`}
              </Typography>
            )
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
              <MenuItem value="url">URL</MenuItem>
              <MenuItem value="changelog">Changelog</MenuItem>
              <MenuItem value="verified" style={{ display: "none" }}>
                Verified
              </MenuItem>
              <MenuItem value="validated" style={{ display: "none" }}>
                Validated
              </MenuItem>
            </Field>
          </FormControl>
          {editing && typeErrors === "Required" && touched ? (
            <Typography variant="caption" className={classes.helpersError}>
              {typeErrors}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "date" || field.type === "url" || !field.type
          ? null
          : null}
        {field.type === "number" ? (
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
                  error={maxErrorDetermination(index)}
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
            {maxErrorMessage(index)}
          </>
        ) : null}
        {field.type === "string" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs>
                <MultiSelectTextInput
                  index={index}
                  allowedValues={field.allowedValues}
                  disabled={!editing}
                  setFieldValue={setFieldValue}
                  editing={editing}
                />
              </Grid>
              <Grid item xs>
                <Field
                  inputProps={{
                    name: `fields.${index}.stringMax`,
                    min: "1",
                  }}
                  onChange={onMaxChange}
                  defaultValue={field.stringMax}
                  label="Maximum Length"
                  margin="dense"
                  fullWidth
                  type="number"
                  step="any"
                  variant="outlined"
                  max={20000}
                  disabled={!editing}
                  component={TextField}
                />
                {editing && (
                  <FormHelperText className={classes.helpers}>
                    OPTIONAL: Provide a maximum string length
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <div className={classes.field}>
              <Field
                inputProps={{
                  id: `schema-field-${index}-isUnique-label`,
                  name: `fields.${index}.isUnique`,
                }}
                checked={field.isUnique || false || false}
                onChange={onIsUniqueChange}
                margin="dense"
                disabled={!editing}
                component={Checkbox}
                type="checkbox"
              />
              <InputLabel htmlFor={`schema-field-${index}-isUnique-label`}>
                Unique Identifier (UUID)?
              </InputLabel>
            </div>
          </>
        ) : null}
        <div className={classes.field}>
          <Field
            inputProps={{
              id: `schema-field-${index}-required-label`,
              name: `fields.${index}.required`,
            }}
            checked={field.required || false}
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
