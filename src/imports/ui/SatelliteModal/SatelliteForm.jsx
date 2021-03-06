import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
// Imports
import { Field } from "formik";
import { _ } from "meteor/underscore";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import { SatelliteSchemaAccordion } from "./SatelliteSchemaAccordion";

// @material-ui
import { TextField } from "formik-material-ui";
import { Grid, Button, makeStyles, IconButton, Tooltip, Paper } from "@material-ui/core";
import MuiTextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  noradID: {
    margin: "0px 0px 15px 0px",
    padding: "0px 1px 0px 1px"
  },
  accordion: {
    display: "flex"
  },
  addSchemaContainer: {
    textAlign: "center",
    margin: 15
  },
  addFieldContainer: { marginLeft: 10 },
  addItem: {
    alignItems: "center",
    marginTop: 10
  },
  helpIcon: {
    color: theme.palette.text.disabled,
    cursor: "help",
    fontSize: "small",
    margin: "0px 0px 5px 3px"
  },
  deleteIcon: { alignSelf: "flex-start" }
}));

export const SatelliteForm = ({
  errors,
  setErrors,
  values,
  setValues,
  schemas,
  setFieldValue,
  editing,
  initValues,
  setSatSchema,
  satelliteValidatorShaper,
  touched,
  setTouched,
  dirty,
  setValidating
}) => {
  const classes = useStyles();

  const { setOpenAlert, setAlert } = useContext(HelpersContext);

  const [schemaAddition, setSchemaAddition] = useState(false);
  const [addSchema, setAddSchema] = useState("");
  const [flag, setFlag] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const handleChange = (event) => {
    // set object to touched explicitly
    let obj = {};
    obj[`${event.target.name}`] = true;
    setTouched(obj);

    setFieldValue(event.target.name, event.target.value);
  };

  const handleNewSchema = async () => {
    initValues[`${addSchema}`] = [];
    setAddSchema("");
    setFlag(!flag);
    toggleAddSchema();

    await setSatSchema(satelliteValidatorShaper(values, initValues));
  };

  const handleDelete = async (name) => {
    setFieldValue(name, []);
    delete initValues[`${name}`];
    setFlag(!flag);
    setOpenAlert(false);

    await setSatSchema(satelliteValidatorShaper(values, initValues));

    let obj = {};
    obj[name] = true;
    setTouched(obj);
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
          Are you sure you want to delete <strong>{name}</strong> and all of its data?
        </span>
      ),
      actions: (
        <Button variant="contained" size="small" color="secondary" disableElevation onClick={() => handleDelete(name)}>
          <DeleteIcon /> Delete
        </Button>
      ),
      closeAction: "Cancel"
    });
    setOpenAlert(true);
  };

  const onSchemaChange = (optionName) => {
    setAddSchema(optionName);
  };

  const toggleAddSchema = () => {
    setSchemaAddition(!schemaAddition);
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Field
          className={classes.noradID}
          value={values.noradID || ""}
          name="noradID"
          label="NORAD ID"
          margin="dense"
          required
          fullWidth
          variant="outlined"
          component={TextField}
          disabled={!editing}
          autoComplete="off"
          onChange={handleChange}
          error={errors["noradID"] && !_.isEmpty(touched) ? true : false}
          helperText={errors["noradID"] && !_.isEmpty(touched) ? errors["noradID"] : ""}
        />
      </Grid>
      {schemas.map(
        (schema, schemaIndex) =>
          initValues[schema.name] && (
            <Grid item xs={12} key={schemaIndex} className={classes.accordion}>
              <SatelliteSchemaAccordion
                errors={errors}
                setErrors={setErrors}
                schema={schema}
                entries={values[`${schema.name}`]}
                setFieldValue={setFieldValue}
                editing={editing}
                setValues={setValues}
                setSatSchema={setSatSchema}
                values={values}
                satelliteValidatorShaper={satelliteValidatorShaper}
                touched={touched}
                setTouched={setTouched}
                initValues={initValues}
                disabled={disabled}
                setDisabled={setDisabled}
                dirty={dirty}
                setValidating={setValidating}
              />
              {editing && (
                <Tooltip title={`Delete ${schema.name}`}>
                  <IconButton
                    tabIndex={1000}
                    color="default"
                    className={classes.deleteIcon}
                    onClick={() => handleDeleteDialog(schema.name)}
                    disabled={disabled}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
          )
      )}
      {editing && schemaAddition && (
        <Grid item container xs={12} className={classes.addItem}>
          <Grid item xs={10}>
            <Autocomplete
              options={schemas.filter((schema) => !initValues[schema.name])}
              onChange={(e, option) => onSchemaChange(option.name)}
              getOptionLabel={(option) => option.name}
              renderOption={(option) => (
                <span>
                  {option.name}
                  <Tooltip title={`${option.description}`} arrow placement="right">
                    <HelpIcon className={classes.helpIcon} />
                  </Tooltip>
                </span>
              )}
              autoComplete
              autoHighlight
              autoSelect
              renderInput={(params) => (
                <MuiTextField {...params} label="Available Schemas" variant="outlined" size="small" />
              )}
            />
          </Grid>
          <Grid item xs className={classes.addFieldContainer}>
            <Button
              id="add-schema"
              variant="contained"
              color="primary"
              onClick={handleNewSchema}
              className={classes.addField}
              fullWidth
              disabled={!addSchema}>
              + Add
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12} className={classes.addSchemaContainer}>
        {editing && !schemaAddition && (
          <Button variant="contained" color="default" onClick={toggleAddSchema} className={classes.addField}>
            + Add Schema
          </Button>
        )}
        {editing && schemaAddition && (
          <Button variant="contained" color="default" onClick={toggleAddSchema} className={classes.addField}>
            Close Add Schema
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

// Prop checking
SatelliteForm.propTypes = {
  errors: PropTypes.object,
  setErrors: PropTypes.func,
  values: PropTypes.object,
  schemas: PropTypes.array,
  setValues: PropTypes.func,
  setFieldValue: PropTypes.func,
  editing: PropTypes.bool,
  initValues: PropTypes.object,
  setSatSchema: PropTypes.func,
  satelliteValidatorShaper: PropTypes.func,
  touched: PropTypes.object,
  setTouched: PropTypes.func,
  editingOne: PropTypes.bool,
  setEditingOne: PropTypes.func,
  dirty: PropTypes.bool,
  setSnack: PropTypes.func,
  setOpenSnack: PropTypes.func,
  setAlert: PropTypes.func,
  setOpenAlert: PropTypes.func,
  setValidating: PropTypes.func
};
