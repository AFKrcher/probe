import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
// Components
import { SatelliteSchemaEntry } from "./SatelliteSchemaEntry";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import { _ } from "meteor/underscore";

// @material-ui
import { Typography, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Button, makeStyles, Tooltip, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  accordionBody: {
    backgroundColor: theme.palette.action.hover,
    width: "100%",
    overflow: "hidden"
  },
  accordionHeader: {
    display: "flex"
  },
  accordionTitle: {
    marginRight: "5px",
    marginLeft: "10px"
  },
  helpIcon: {
    color: theme.palette.text.disabled,
    fontSize: "medium"
  },
  iconButtons: {
    display: "flex",
    pointerEvents: "auto"
  },
  editIcon: {
    padding: 6,
    margin: "-6px 0em -6px 0px"
  },
  closeIcon: {
    padding: 6,
    margin: "-6px 10px -6px -20px"
  },
  saveIcon: {
    padding: 6,
    margin: "-6px 0px -6px 0px"
  },
  accordianDetails: {
    marginTop: -15
  },
  description: {
    margin: "5px 10px 10px 10px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginTop: 5,
    marginLeft: 2.5
  }
}));

// breakpoints based on device width / height
const gridSpaceTitleChipBreak = 1000;
const accordionActionsBreak = 800;

export const SatelliteSchemaAccordion = ({
  errors,
  setErrors,
  setFieldValue,
  editing,
  setSatSchema,
  values,
  setValues,
  satelliteValidatorShaper,
  setTouched,
  touched,
  editingOne,
  setEditingOne,
  initValues,
  setOpenSnack,
  setSnack,
  schema,
  entries,
  schemaIndex,
  accordionBeingEdited,
  setAccordionBeingEdited
}) => {
  const classes = useStyles();

  const [editingSchema, setEditingSchema] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [width] = useWindowSize();

  useEffect(() => {
    if (!entries) setFieldValue(schema.name, []);
  }, [entries]);

  const onAddField = async () => {
    setTouched({});
    const schemaFields = schema.fields.reduce((acc, cur) => ({ ...acc, [cur.name]: "" }), {});
    const newEntries = [...entries, schemaFields];
    await setFieldValue(schema.name, newEntries);
    await setSatSchema(satelliteValidatorShaper(values, initValues));
  };

  const handleEditSchema = async () => {
    setEditingSchema(!editingSchema);
    setEditingOne(!editingOne);
    if (editingSchema) {
      setAccordionBeingEdited(-1);
      await setValues(initValues);
      setErrors({});
    } else {
      setAccordionBeingEdited(schemaIndex);
    }
    setTimeout(() => setExpanded(true)); // keep accordion expanded
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (values) => {
    Meteor.call("updateSatellite", values, initValues, (err, res) => {
      if (res || err) {
        console.log(res || err);
      } else {
        setOpenSnack(false);
        setSnack(
          <span>
            Changes on <strong>{schema.name}</strong>
            {" in "}
            <strong>{values.names && values.names[0] ? values.names[0].name : "N/A"}</strong>
            {" saved!"}
          </span>
        );
        setOpenSnack(true);
        setEditingSchema(false);
        setAccordionBeingEdited(-1);
      }
      setEditingOne(false);
    });
  };

  return (
    <React.Fragment>
      <Accordion className={classes.accordionBody} expanded={expanded}>
        <AccordionSummary onClick={handleExpand} expandIcon={<ExpandMoreIcon />} id={`${schema.name}-accord-header`}>
          <Grid container spacing={editingSchema ? 1 : 4}>
            <Grid item className={classes.accordionHeader} xs={width > gridSpaceTitleChipBreak ? 11 : 10}>
              <Chip size="small" label={entries?.length ? entries.length : "0"} />
              <Typography variant="body1" className={classes.accordionTitle}>
                {schema.name}
              </Typography>
              <Tooltip title={schema.description} placement="top-start" arrow>
                <HelpIcon fontSize="small" className={classes.helpIcon} />
              </Tooltip>
            </Grid>
            {!editing && width > accordionActionsBreak && (accordionBeingEdited === schemaIndex || accordionBeingEdited === -1) ? (
              <Grid item className={classes.iconButtons} xs="auto">
                {!editingSchema ? (
                  // not using ProtectedFunctionality due to rendering lag during .map() of accordions
                  Meteor.user({ fields: { "emails.verified": 1 } })?.emails[0].verified && (
                    <IconButton className={classes.editIcon} onClick={handleEditSchema}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )
                ) : (
                  <React.Fragment>
                    <IconButton className={classes.closeIcon} onClick={handleEditSchema}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      className={classes.saveIcon}
                      disabled={!_.isEmpty(errors) || _.isEmpty(touched) ? true : false}
                      onClick={() => {
                        handleSubmit(values);
                      }}
                      color="primary">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </React.Fragment>
                )}
              </Grid>
            ) : null}
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <Grid container spacing={1}>
            {entries?.map((entry, entryIndex) => (
              <SatelliteSchemaEntry
                errors={errors}
                key={entryIndex}
                entryIndex={entryIndex}
                schema={schema}
                entry={entry}
                setFieldValue={setFieldValue}
                editing={editing}
                editingSchema={editing ? editing : editingSchema}
                entries={entries}
                setSatSchema={setSatSchema}
                initValues={initValues}
                satelliteValidatorShaper={satelliteValidatorShaper}
                setTouched={setTouched}
                values={values}
                setExpanded={setExpanded}
                width={width}
              />
            ))}
            <Grid item xs={12} className={classes.buttonContainer}>
              {editing || editingSchema ? (
                <Button variant="contained" size="medium" color="default" onClick={onAddField} className={classes.button}>
                  + Add Entry
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
};

// Prop checking
SatelliteSchemaAccordion.propTypes = {
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
  setOpenSnack: PropTypes.func,
  setSnack: PropTypes.func,
  newSat: PropTypes.bool,
  schema: PropTypes.object,
  entries: PropTypes.array,
  schemaIndex: PropTypes.number,
  accordionBeingEdited: PropTypes.number,
  setAccordionBeingEdited: PropTypes.func
};
