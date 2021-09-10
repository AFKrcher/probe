import React, { useState, useContext } from "react";
// Imports
import HelpersContext from "../helpers/HelpersContext.jsx";

// Components
import AlertDialog from "../helpers/AlertDialog.jsx";
import { Field } from "formik";
import { SatelliteSchemaAccordion } from "./SatelliteSchemaAccordion";

// @material-ui
import { TextField } from "formik-material-ui";
import {
  Grid,
  Button,
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  accordion: {
    display: "flex",
  },
  addSchemaContainer: {
    textAlign: "center",
    margin: 10,
  },
  addItem: {
    alignItems: "center",
  },
  noradID: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
  },
}));

export const SatelliteForm = ({
  errors,
  values,
  schemas,
  setValues,
  setFieldValue,
  editing,
  initValues,
  newSat,
}) => {
  const { setOpenAlert, alert, setAlert } = useContext(HelpersContext);
  const [schemaAddition, setSchemaAddition] = useState(false);
  const [addSchema, setAddSchema] = useState("");
  const [flag, setFlag] = useState(true);
  const classes = useStyles();

  const handleNewSchema = async () => {
    initValues[`${addSchema}`] = [];
    setAddSchema("");
    setFlag(!flag);
    toggleAddSchema();
  };

  const handleDelete = (name) => {
    setFieldValue(name, []);
    delete initValues[`${name}`];
    setFlag(!flag);
    setOpenAlert(false);
  };

  const handleDeleteDialog = (name) => {
    setAlert({
      title: (
        <span>
          Delete <strong>{name}</strong> Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete <strong>{name}</strong> and all of its
          data?
        </span>
      ),
      actions: (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disableElevation
          onClick={() => handleDelete(name)}
        >
          Confirm
        </Button>
      ),
      closeAction: "Cancel",
    });
    setOpenAlert(true);
  };

  const onSchemaChange = (e) => {
    setAddSchema(e.target.value);
  };

  const toggleAddSchema = () => {
    setSchemaAddition(!schemaAddition);
  };

  return (
    <Grid container spacing={1}>
      <AlertDialog bodyAlert={alert} />
      <Grid container item>
        <Grid item xs={12}>
          <Paper className={classes.noradID}>
            <Field
              name="noradID"
              label="NORAD ID"
              margin="dense"
              required
              fullWidth
              variant="outlined"
              disabled={!editing}
              component={TextField}
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {schemas.map((schema, schemaIndex) => {
          // this first map forces "names" schema to always be on top
          // the second map below this one renders the rest of the schemas in randomized order
          return schema.name === "names" ? (
            <span key={schemaIndex} className={classes.accordion}>
              <SatelliteSchemaAccordion
                errors={errors}
                key={schemaIndex}
                schema={schema}
                entries={values[`${schema.name}`]}
                setFieldValue={setFieldValue}
                editing={editing}
                setValues={setValues}
                newSat={newSat}
              />
              {editing && (
                <Tooltip title={`Delete ${schema.name}`}>
                  <IconButton
                    color="default"
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => handleDeleteDialog(schema.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </span>
          ) : (
            []
          );
        })}
        {schemas.map((schema, schemaIndex) => {
          return initValues[schema.name] && schema.name !== "names" ? (
            <span key={schemaIndex} className={classes.accordion}>
              <SatelliteSchemaAccordion
                errors={errors}
                schema={schema}
                entries={values[`${schema.name}`]}
                setFieldValue={setFieldValue}
                editing={editing}
                setValues={setValues}
              />
              {editing && (
                <Tooltip title={`Delete ${schema.name}`}>
                  <IconButton
                    color="default"
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => handleDeleteDialog(schema.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </span>
          ) : (
            []
          );
        })}
      </Grid>
      {editing && schemaAddition && (
        <Grid item container xs={12} className={classes.addItem}>
          <Grid item xs={10}>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel htmlFor={`satellite-field`}>
                Available Schemas
              </InputLabel>
              <Field
                label="Available Schemas"
                inputProps={{
                  id: `satellite-field`,
                  name: `satellite-field`,
                }}
                component={Select}
                value={addSchema}
                onChange={onSchemaChange}
              >
                <MenuItem disabled value={""}>
                  <em>Available Schemas</em>
                </MenuItem>
                {schemas.map((schema, schemaIndex) => {
                  if (
                    schema.name !== "name" &&
                    (initValues[`${schema.name}`] ? false : true)
                  ) {
                    return (
                      <MenuItem
                        key={schemaIndex}
                        dense
                        value={`${schema.name}`}
                      >
                        {schema.name}
                      </MenuItem>
                    );
                  }
                })}
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs style={{ marginLeft: 10, marginTop: 5 }}>
            <Button
              id="add-schema"
              variant="contained"
              color="primary"
              onClick={handleNewSchema}
              className={classes.addField}
              fullWidth
              disabled={!addSchema}
            >
              + Add
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12} className={classes.addSchemaContainer}>
        {editing && !schemaAddition && (
          <Button
            variant="contained"
            color="default"
            onClick={toggleAddSchema}
            className={classes.addField}
          >
            + Add Schema
          </Button>
        )}
        {editing && schemaAddition && (
          <Button
            variant="contained"
            color="default"
            onClick={toggleAddSchema}
            className={classes.addField}
          >
            Close Add Schema
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
