import React, { useState, useContext } from "react";
// Imports
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { FastField, Field } from "formik";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import { SatelliteSchemaAccordion } from "./SatelliteSchemaAccordion";

// @material-ui
import { TextField } from "formik-material-ui";
import {
  Grid,
  Button,
  makeStyles,
  IconButton,
  Tooltip,
  Paper,
} from "@material-ui/core";
import MuiTextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  accordion: {
    display: "flex",
  },
  addSchemaContainer: {
    textAlign: "center",
    margin: 15,
  },
  addItem: {
    alignItems: "center",
    marginTop: 10,
  },
  noradID: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
  },
  helpIcon: {
    color: theme.palette.text.disabled,
    fontSize: "small",
    marginLeft: 5,
    marginTop: -10,
  },
}));

export const SatelliteForm = ({
  errors,
  setErrors,
  dirty,
  values,
  schemas,
  setValues,
  setFieldValue,
  editing,
  initValues,
  setSatSchema,
  satelliteValidatorShaper,
  setTouched,
  editingOne,
  setEditingOne,
  setOpenSnack,
  setSnack,
  newSat,
  touched,
}) => {
  const { setOpenAlert, alert, setAlert } = useContext(HelpersContext);
  const [schemaAddition, setSchemaAddition] = useState(false);
  const [addSchema, setAddSchema] = useState("");
  const [accordionBeingEdited, setAccordionBeingEdited] = useState(-1);
  const [flag, setFlag] = useState(true);
  const classes = useStyles();

  const renderAccordion = (schema, schemaIndex) => {
    return (
      <span key={schemaIndex} className={classes.accordion}>
        <SatelliteSchemaAccordion
          accordionBeingEdited={accordionBeingEdited}
          setAccordionBeingEdited={setAccordionBeingEdited}
          schemaIndex={schemaIndex}
          editingOne={editingOne}
          setEditingOne={setEditingOne}
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
          setTouched={setTouched}
          initValues={initValues}
          setOpenSnack={setOpenSnack}
          setSnack={setSnack}
          dirty={dirty}
          touched={touched}
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
    );
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
          <DeleteIcon /> Delete
        </Button>
      ),
      closeAction: "Cancel",
    });
    setOpenAlert(true);
  };

  const onChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
    if (newSat) {
      let obj = {};
      obj[event.target.name] = true;
      setTouched(obj);
    }
    if (event.target.value?.length === 0) {
      setTouched({});
    }
  };

  const onSchemaChange = (optionName) => {
    setAddSchema(optionName);
  };

  const toggleAddSchema = () => {
    setSchemaAddition(!schemaAddition);
  };

  const noradIDProps = (fast) => {
    return {
      value: values.noradID || "",
      name: "noradID",
      label: "NORAD ID",
      margin: "dense",
      required: true,
      fullWidth: true,
      variant: "outlined",
      component: TextField,
      onChange: onChange,
      onInput: onChange,
      disabled: !fast,
      autoComplete: "off",
    };
  };

  return (
    <Grid container spacing={1}>
      <AlertDialog bodyAlert={alert} />
      <Grid container item>
        <Grid item xs={12}>
          <Paper className={classes.noradID}>
            {editing ? (
              <FastField {...noradIDProps(true)} />
            ) : (
              <Field {...noradIDProps(false)} />
            )}
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {schemas.map((schema, schemaIndex) => {
          // this first map forces "names" schema to always be on top
          // the second map below this one renders the rest of the schemas in a created-by order
          return schema.name === "names"
            ? renderAccordion(schema, schemaIndex)
            : [];
        })}
        {schemas.map((schema, schemaIndex) => {
          return initValues[schema.name] && schema.name !== "names"
            ? renderAccordion(schema, schemaIndex)
            : [];
        })}
      </Grid>
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
                  <Tooltip
                    title={`${option.description}`}
                    arrow
                    placement="right"
                  >
                    <HelpIcon className={classes.helpIcon} />
                  </Tooltip>
                </span>
              )}
              autoComplete
              autoHighlight
              autoSelect
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Available Schemas"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs style={{ marginLeft: 10 }}>
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
