import React, { useState } from "react";
import { Field, FastField } from "formik";

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

  const onChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  const onStringMaxChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
    setCurrentStringMax(event.target.value);
  };

  const onCheck = (event) => {
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

  const nameProps = (fast) => {
    return {
      inputProps: {
        name: `fields.${index}.name`,
      },
      value: field.name,
      onChange: onChange,
      label: "Field Name or Units",
      placeholder: "camelCase",
      margin: "dense",
      required: true,
      fullWidth: true,
      variant: "outlined",
      disabled: !fast,
      component: TextField,
      onBlur: handleBlur,
      error: errorDetermination(index, "name") && touched ? true : false,
      maxLength: 255,
    };
  };

  const dataTypeProps = (fast) => {
    return {
      label: "Data Type",
      inputProps: {
        id: `schema-field-${index}-data-type-label`,
        name: `fields.${index}.type`,
      },
      value: field.type,
      onChange: onChange,
      disabled: !fast,
      component: Select,
      onBlur: handleBlur,
      error: errorDetermination(index, "type") && touched ? true : false,
    };
  };

  const decideFastNumberFields = () => {
    const minProps = (fast) => {
      return {
        inputProps: {
          name: `fields.${index}.min`,
        },
        onChange: onChange,
        label: "Minimum Value",
        margin: "dense",
        defaultValue: field.min,
        fullWidth: true,
        type: "number",
        step: "any",
        variant: "outlined",
        component: TextField,
        disabled: !fast,
      };
    };
    const maxProps = (fast) => {
      return {
        inputProps: {
          name: `fields.${index}.max`,
        },
        onChange: onChange,
        defaultValue: field.max,
        error: errorDetermination(index, "max"),
        label: "Maximum Value",
        margin: "dense",
        fullWidth: true,
        type: "number",
        step: "any",
        variant: "outlined",
        component: TextField,
        disabled: !fast,
      };
    };
    if (editing) {
      return (
        <Grid container item spacing={2}>
          <Grid item xs>
            <FastField {...minProps(true)} />
          </Grid>
          <Grid item xs>
            <FastField {...maxProps(true)} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container item spacing={2}>
          <Grid item xs>
            <Field {...minProps(false)} />
          </Grid>
          <Grid item xs>
            <Field {...maxProps(false)} />
          </Grid>
        </Grid>
      );
    }
  };

  const decideFastStringFields = () => {
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
    const stringMaxProps = (fast) => {
      return {
        inputProps: {
          name: `fields.${index}.stringMax`,
          min: "1",
        },
        onChange: onStringMaxChange,
        defaultValue: field.stringMax,
        label: "Maximum Length",
        margin: "dense",
        fullWidth: true,
        type: "number",
        step: "any",
        variant: "outlined",
        max: 20000,
        disabled: !fast,
        component: TextField,
      };
    };

    const uuidProps = (fast) => {
      return {
        inputProps: {
          id: `schema-field-${index}-isUnique-label`,
          name: `fields.${index}.isUnique`,
        },
        checked: field.isUnique || false,
        onChange: onCheck,
        margin: "dense",
        disabled: !fast,
        component: Checkbox,
        type: "checkbox",
      };
    };

    if (editing) {
      return (
        <React.Fragment>
          <Grid container item spacing={2}>
            <Grid item xs>
              {MultiSelect}
            </Grid>
            <Grid item xs>
              <FastField {...stringMaxProps(true)} />
              <FormHelperText className={classes.helpers}>
                OPTIONAL: Provide a maximum character count, cannot exceed
                20,000
              </FormHelperText>
            </Grid>
          </Grid>
          <div className={classes.field}>
            <Field {...uuidProps(true)} />
            {uuidLabel}
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid container item spacing={2}>
            <Grid item xs>
              {MultiSelect}
            </Grid>
            <Grid item xs>
              <Field {...stringMaxProps(false)} />
            </Grid>
          </Grid>
          <div className={classes.field}>
            <Field {...uuidProps(false)} />
            {uuidLabel}
          </div>
        </React.Fragment>
      );
    }
  };

  const requiredProps = (fast) => {
    return {
      inputProps: {
        id: `schema-field-${index}-required-label`,
        name: `fields.${index}.required`,
      },
      checked: field.required || false,
      onChange: onCheck,
      margin: "dense",
      disabled: !fast,
      component: Checkbox,
      type: "checkbox",
    };
  };

  return (
    <Grid container item>
      <Grid container item spacing={2}>
        <Grid item xs className={classes.firstRow}>
          {editing ? (
            <FastField {...nameProps(true)} />
          ) : (
            <Field {...nameProps(false)} />
          )}
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
            {editing ? (
              <FastField {...dataTypeProps(true)}>
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="url">URL</MenuItem>
                <MenuItem value="changelog" style={{ display: "none" }}>
                  Changelog
                </MenuItem>
                <MenuItem value="verified" style={{ display: "none" }}>
                  Verified
                </MenuItem>
                <MenuItem value="validated" style={{ display: "none" }}>
                  Validated
                </MenuItem>
              </FastField>
            ) : (
              <Field {...dataTypeProps(false)}>
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="url">URL</MenuItem>
                <MenuItem value="changelog" style={{ display: "none" }}>
                  Changelog
                </MenuItem>
                <MenuItem value="verified" style={{ display: "none" }}>
                  Verified
                </MenuItem>
                <MenuItem value="validated" style={{ display: "none" }}>
                  Validated
                </MenuItem>
              </Field>
            )}
          </FormControl>
          {editing && errorDetermination(index, "type") && touched && (
            <Typography variant="caption" className={classes.helpersError}>
              {errorDetermination(index, "type")}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {field.type === "number" && (
          <React.Fragment>
            {decideFastNumberFields()}
            {maxErrorMessage(index)}
          </React.Fragment>
        )}
        {field.type === "string" && decideFastStringFields()}
        <div className={classes.field}>
          {editing ? (
            <FastField {...requiredProps(true)} />
          ) : (
            <Field {...requiredProps(false)} />
          )}
          <InputLabel htmlFor={`schema-field-${index}-required-label`}>
            Required Input?
          </InputLabel>
        </div>
      </Grid>
    </Grid>
  );
};
