import React from "react";
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
            margin="dense"
            required
            fullWidth
            variant="outlined"
            disabled={!editing}
            component={TextField}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            name="description"
            label="Schema Description"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            multiline
            color="primary"
            rows={4}
            disabled={!editing}
            component={TextField}
          />
        </Grid>
      </Grid>
      <FieldArray
        name="fields"
        render={() =>
          formValues.fields.map((field, i) => {
            if (field.name === "reference") return;

            return (
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
                      <DeleteIcon fontSize="default" />
                    </IconButton>
                  </Grid>
                )}
              </React.Fragment>
            );
          })
        }
      />
      <Grid item xs={12} className={classes.addFieldContainer}>
        {editing && (
          <Button
            variant="contained"
            color="primary"
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
