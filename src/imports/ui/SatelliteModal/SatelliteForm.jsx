import React, { useState, useContext } from "react";
// Imports
import HelpersContext from "../Dialogs/HelpersContext.jsx";

// Components
import AlertDialog from "../Dialogs/AlertDialog.jsx";
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
import HelpIcon from "@material-ui/icons/Help";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

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
  helpIcon: {
    color: theme.palette.text.disabled,
    fontSize: "small",
    marginLeft: 5,
    marginTop: -5,
  },
}));

export const SatelliteForm = ({
  errors,
  dirty,
  values,
  schemas,
  setValues,
  setFieldValue,
  editing,
  initValues,
  setSatSchema,
  isUniqueList,
  satelliteValidatorShaper,
  setTouched,
  editingOne,
  setEditingOne,
  setOpenSnack,
  setSnack,
  newSat,
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
          schema={schema}
          schemas={schemas}
          entries={values[`${schema.name}`]}
          setFieldValue={setFieldValue}
          editing={editing}
          setValues={setValues}
          setSatSchema={setSatSchema}
          values={values}
          isUniqueList={isUniqueList}
          satelliteValidatorShaper={satelliteValidatorShaper}
          setTouched={setTouched}
          initValues={initValues}
          setOpenSnack={setOpenSnack}
          setSnack={setSnack}
          dirty={dirty}
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
  };

  const handleDelete = (name) => {
    setFieldValue(name, []);
    delete initValues[`${name}`];
    setFlag(!flag);
    setOpenAlert(false);

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

  const onSchemaChange = (e) => {
    setAddSchema(e.target.value);
  };

  const toggleAddSchema = () => {
    setSchemaAddition(!schemaAddition);
  };

  const fieldProps = {
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
    disabled: !editing,
    autoComplete: "off",
  };
  return (
    <Grid container spacing={1}>
      <AlertDialog bodyAlert={alert} />
      <Grid container item>
        <Grid item xs={12}>
          <Paper className={classes.noradID}>
            <Field {...fieldProps} />
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
                  <TextField
                    variant="outlined"
                    placeholder="Search Schemas…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={classes.textField}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon
                          fontSize="small"
                          style={{ marginRight: 5 }}
                        />
                      ),
                      endAdornment: (
                        <IconButton
                          title="Clear"
                          aria-label="Clear"
                          size="small"
                          onClick={() => setFilter("")}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                  />
                </MenuItem>
                {schemas.map((schema, schemaIndex) => {
                  if (
                    schema.name !== "name" &&
                    (initValues[`${schema.name}`] ? false : true)
                  ) {
                    return (
                      <MenuItem
                        className="schemaIndex"
                        dense
                        value={`${schema.name}`}
                        key={schemaIndex}
                      >
                        {schema.name}
                        <Tooltip
                          title={schema.description}
                          placement="bottom-start"
                          arrow
                        >
                          <HelpIcon
                            fontSize="small"
                            className={classes.helpIcon}
                          />
                        </Tooltip>
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
