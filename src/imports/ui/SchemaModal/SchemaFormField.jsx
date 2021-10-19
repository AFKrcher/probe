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
  firstRow: {
    marginBottom: 10,
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
  const [currentStringMax, setCurrentStringMax] = useState(field.stringMax);
  const classes = useStyles();

  const onNameChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onMinChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onMaxChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onStringMaxChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
    setCurrentStringMax(event.target.value);
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

  const errorDetermination = (index, field) => {
    let determination = false;
    if (errors.fields) {
      if (errors.fields[index]) {
        if (errors.fields[index][field]) {
          determination = errors.fields[index][field];
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
        <Grid item xs className={classes.firstRow}>
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
            error={errorDetermination(index, "name") && touched ? true : false}
            maxLength={255}
          />
          {editing ? (
            errorDetermination(index, "name") && touched ? (
              <Typography variant="caption" className={classes.helpersError}>
                {errorDetermination(index, "name")}
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
              error={
                errorDetermination(index, "type") && touched ? true : false
              }
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
              error={
                errorDetermination(index, "type") && touched ? true : false
              }
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="url">URL</MenuItem>
              <MenuItem value="changelog" disabled>
                Changelog
              </MenuItem>
              <MenuItem value="verified" style={{ display: "none" }}>
                Verified
              </MenuItem>
              <MenuItem value="validated" style={{ display: "none" }}>
                Validated
              </MenuItem>
            </Field>
          </FormControl>
          {editing && errorDetermination(index, "type") && touched ? (
            <Typography variant="caption" className={classes.helpersError}>
              {errorDetermination(index, "type")}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "date" || field.type === "url" || !field.type
          ? null
          : null}
        {field.type === "number" ? (
          <React.Fragment>
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
                  error={errorDetermination(index, "max")}
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
          </React.Fragment>
        ) : null}
        {field.type === "string" ? (
          <React.Fragment>
            <Grid container item spacing={2}>
              <Grid item xs>
                <MultiSelectTextInput
                  index={index}
                  allowedValues={field.allowedValues}
                  disabled={!editing}
                  setFieldValue={setFieldValue}
                  editing={editing}
                  currentStringMax={currentStringMax}
                  errors={errors}
                />
              </Grid>
              <Grid item xs>
                <Field
                  inputProps={{
                    name: `fields.${index}.stringMax`,
                    min: "1",
                  }}
                  onChange={onStringMaxChange}
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
                    OPTIONAL: Provide a maximum character count, cannot exceed
                    20,000
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
          </React.Fragment>
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
