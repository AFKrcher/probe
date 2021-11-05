import React from "react";
import PropTypes from "prop-types";
// Imports
import { Field, FieldArray } from "formik";

// Components
import { SchemaFormField } from "./SchemaFormField";

// @material-ui
import {
  Divider,
  Grid,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  alert: {
    width: "100%",
  },
  divider: {
    marginTop: 5,
    marginBottom: 5,
  },
  addField: {
    marginTop: 10,
  },
  addFieldContainer: {
    textAlign: "center",
  },
  helpers: {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 8,
    color: theme.palette.text.disabled,
  },
}));

export const SchemaForm = ({
  touched,
  errors,
  formValues,
  setValues,
  setFieldValue,
  editing,
  initValues,
}) => {
  const classes = useStyles();

  const onAddField = () => {
    const fields = [
      ...formValues.fields,
      {
        name: "",
        type: "",
        allowedValues: [],
        required: false,
        min: null,
        max: null,
        stringMax: null,
      },
    ];
    setValues({ ...formValues, fields });
  };

  const handleFieldDelete = (index) => {
    const fields = [...formValues.fields];
    fields.splice(index, 1);
    setValues({ ...formValues, fields });
  };

  return (
    <Grid container spacing={1}>
      <Grid container item>
        <Grid item xs={12}>
          <Field
            name="name"
            label="Schema Name"
            placeholder="camelCase"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            disabled={!editing}
            component={TextField}
            maxLength={255}
            autoComplete="off"
          />
        </Grid>
        <Typography variant="caption" className={classes.helpers}>
          {editing ? `${formValues.name?.length} / 50` : null}
        </Typography>
        <Grid item xs={12}>
          <Field
            name="description"
            label="Schema Description"
            placeholder="Use this field to describe why this schema is important and how a user should enter data into the fields that are defined in this schema."
            margin="dense"
            required
            fullWidth
            variant="outlined"
            multiline={true}
            color="primary"
            rows={4}
            disabled={!editing}
            component={TextField}
            maxLength={500}
            autoComplete="off"
          />
          {editing && (
            <Typography variant="caption" className={classes.helpers}>
              {editing ? `${formValues.description?.length} / 255` : null}
            </Typography>
          )}
        </Grid>
      </Grid>
      <FieldArray
        name="fields"
        render={() =>
          formValues.fields?.map((field, i) => {
            return !field.hidden ? (
              <React.Fragment key={`fragment-${i}`}>
                <Grid
                  key={`divider-${i}`}
                  item
                  xs={12}
                  className={classes.divider}
                >
                  <Divider />
                </Grid>
                <Grid key={`grid-${i}`} item container xs alignItems="center">
                  <SchemaFormField
                    touched={touched}
                    errors={errors}
                    key={`form-field-${i}`}
                    index={i}
                    field={field}
                    setFieldValue={setFieldValue}
                    editing={editing}
                    initValues={initValues}
                  />
                </Grid>
                {editing && (
                  <Grid container item xs={1} alignContent="center">
                    <IconButton
                      aria-label="delete field"
                      onClick={() => handleFieldDelete(i)}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </Grid>
                )}
              </React.Fragment>
            ) : null;
          })
        }
      />
      <Grid item xs={12} className={classes.addFieldContainer}>
        {editing && (
          <Button
            variant="contained"
            onClick={onAddField}
            className={classes.addField}
          >
            + Add Field
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

// Prop checking
SchemaForm.propTypes = {
  touched: PropTypes.object,
  errors: PropTypes.object,
  formValues: PropTypes.object,
  setValues: PropTypes.func,
  setFieldValue: PropTypes.func,
  editing: PropTypes.bool,
  initValues: PropTypes.object,
};
