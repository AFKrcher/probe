import React, { useState } from "react";
import PropTypes from "prop-types";
// Imports
import { Field } from "formik";
import {
  dataTypeOptions,
  errorDetermination,
  maxErrorMessage,
} from "../utils/schemaDataFuncs";

// Components
import { MultiSelectTextInput } from "./MultiSelectTextInput";

// @material-ui
import {
  FormControl,
  Grid,
  InputLabel,
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

  const handleChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const handleStringMaxChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
    setCurrentStringMax(event.target.value);
  };

  const handleCheck = (event) => {
    setFieldValue(event.target.name, event.target.checked);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const nameFields = () => {
    const nameProps = {
      inputProps: {
        name: `fields.${index}.name`,
      },
      value: field.name,
      onChange: handleChange,
      label: "Field Name or Units",
      placeholder: "camelCase",
      margin: "dense",
      required: true,
      fullWidth: true,
      variant: "outlined",
      disabled: !editing,
      component: TextField,
      onBlur: handleBlur,
      error:
        errorDetermination(errors, index, "name") && touched ? true : false,
      maxLength: 255,
    };

    return (
      <React.Fragment>
        <Field {...nameProps} />
        {editing &&
          (errorDetermination(errors, index, "name") && touched ? (
            <Typography variant="caption" className={classes.helpersError}>
              {errorDetermination(errors, index, "name")}
            </Typography>
          ) : (
            <Typography variant="caption" className={classes.helpers}>
              {`${field.name.length} / 50`}
            </Typography>
          ))}
      </React.Fragment>
    );
  };

  const dataTypeFields = () => {
    const dataTypeProps = {
      label: "Data Type",
      inputProps: {
        id: `schema-field-${index}-data-type-label`,
        name: `fields.${index}.type`,
      },
      value: field.type,
      onChange: handleChange,
      disabled: !editing,
      component: Select,
      onBlur: handleBlur,
      error:
        errorDetermination(errors, index, "type") && touched ? true : false,
    };

    return (
      <React.Fragment>
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
              errorDetermination(errors, index, "type") && touched
                ? true
                : false
            }
          >
            Data type
          </InputLabel>
          <Field {...dataTypeProps}>{dataTypeOptions()}</Field>
        </FormControl>
        {editing && errorDetermination(errors, index, "type") && touched && (
          <Typography variant="caption" className={classes.helpersError}>
            {errorDetermination(errors, index, "type")}
          </Typography>
        )}
      </React.Fragment>
    );
  };

  const numberFields = () => {
    const minProps = {
      inputProps: {
        name: `fields.${index}.min`,
      },
      onChange: handleChange,
      label: "Minimum Value",
      margin: "dense",
      defaultValue: field.min,
      fullWidth: true,
      type: "number",
      step: "any",
      variant: "outlined",
      component: TextField,
      disabled: !editing,
    };

    const maxProps = {
      inputProps: {
        name: `fields.${index}.max`,
      },
      onChange: handleChange,
      defaultValue: field.max,
      error: errorDetermination(errors, index, "max"),
      label: "Maximum Value",
      margin: "dense",
      fullWidth: true,
      type: "number",
      step: "any",
      variant: "outlined",
      component: TextField,
      disabled: !editing,
    };

    return (
      <Grid container item spacing={2}>
        <Grid item xs>
          <Field {...minProps} />
        </Grid>
        <Grid item xs>
          <Field {...maxProps} />
        </Grid>
      </Grid>
    );
  };

  const stringFields = () => {
    const MultiSelect = (
      <MultiSelectTextInput
        index={index}
        allowedValues={field.allowedValues}
        setFieldValue={setFieldValue}
        editing={editing}
        currentStringMax={currentStringMax}
        errors={errors}
      />
    );
    const uuidLabel = (
      <InputLabel htmlFor={`schema-field-${index}-isUnique-label`}>
        Unique Identifier (UUID)?
      </InputLabel>
    );
    const stringMaxProps = {
      inputProps: {
        name: `fields.${index}.stringMax`,
        min: "1",
      },
      onChange: handleStringMaxChange,
      defaultValue: field.stringMax,
      label: "Maximum Length",
      margin: "dense",
      fullWidth: true,
      type: "number",
      step: "any",
      variant: "outlined",
      max: 20000,
      disabled: !editing,
      component: TextField,
    };

    const uuidProps = {
      inputProps: {
        id: `schema-field-${index}-isUnique-label`,
        name: `fields.${index}.isUnique`,
      },
      checked: field.isUnique || false,
      onChange: handleCheck,
      margin: "dense",
      disabled: !editing,
      component: Checkbox,
      type: "checkbox",
    };

    return (
      <React.Fragment>
        <Grid container item spacing={2}>
          <Grid item xs>
            {MultiSelect}
          </Grid>
          <Grid item xs>
            <Field {...stringMaxProps} />
            {!editing && (
              <FormHelperText className={classes.helpers}>
                OPTIONAL: Provide a maximum character count, cannot exceed
                20,000
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        <div className={classes.field}>
          <Field {...uuidProps} />
          {uuidLabel}
        </div>
      </React.Fragment>
    );
  };

  const requiredFields = () => {
    const requiredProps = {
      inputProps: {
        id: `schema-field-${index}-required-label`,
        name: `fields.${index}.required`,
      },
      checked: field.required || false,
      onChange: handleCheck,
      margin: "dense",
      disabled: !editing,
      component: Checkbox,
      type: "checkbox",
    };

    return (
      <div className={classes.field}>
        <Field {...requiredProps} />
        <InputLabel htmlFor={`schema-field-${index}-required-label`}>
          Required Input?
        </InputLabel>
      </div>
    );
  };

  return (
    <Grid container item>
      <Grid container item spacing={2}>
        <Grid item xs className={classes.firstRow}>
          {nameFields()}
        </Grid>
        <Grid item xs>
          {dataTypeFields()}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "number" && (
          <React.Fragment>
            {numberFields()}
            {maxErrorMessage(editing, errors, classes, index)}
          </React.Fragment>
        )}
        {field.type === "string" && stringFields()}
        {requiredFields()}
      </Grid>
    </Grid>
  );
};

// Prop checking
SchemaFormField.propTypes = {
  errors: PropTypes.object,
  index: PropTypes.number,
  field: PropTypes.object,
  setFieldValue: PropTypes.func,
  editing: PropTypes.bool,
};
