import React, { useEffect } from "react";
import PropTypes from "prop-types";
// Components
import { SatelliteSchemaEntry } from "./SatelliteSchemaEntry";
import useWindowSize from "../hooks/useWindowSize.jsx";

// @material-ui
import { Typography, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Button, makeStyles, Tooltip } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";

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

export const SatelliteSchemaAccordion = ({
  initValues,
  schema,
  entries,
  editing,
  values,
  setFieldValue,
  satelliteValidatorShaper,
  setSatSchema,
  setTouched,
  errors,
  disabled,
  setDisabled,
  setValidating
}) => {
  const classes = useStyles();

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

  const handleDeleteEntry = (schema, entryIndex) => {
    let obj = {};
    obj[`${schema.name}.${entryIndex}`] = true;
    setTouched(obj);

    entries.splice(entryIndex, 1);
    setFieldValue(schema.name, entries);

    setSatSchema(satelliteValidatorShaper(values, initValues));
  };

  return (
    <React.Fragment>
      <Accordion className={classes.accordionBody}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${schema.name}-accord-header`}>
          <Grid container spacing={4}>
            <Grid item className={classes.accordionHeader} xs={width > gridSpaceTitleChipBreak ? 11 : 10}>
              <Chip size="small" label={entries?.length ? entries.length : "0"} />
              <Typography variant="body1" className={classes.accordionTitle}>
                {schema.name}
              </Typography>
              <Tooltip title={schema.description} placement="top-start" arrow>
                <HelpIcon fontSize="small" className={classes.helpIcon} />
              </Tooltip>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <Grid container spacing={1}>
            {entries?.map((entry, entryIndex) => (
              <SatelliteSchemaEntry
                key={entryIndex}
                errors={errors}
                entryIndex={entryIndex}
                schema={schema}
                entry={entry}
                setFieldValue={setFieldValue}
                editing={editing}
                entries={entries}
                setTouched={setTouched}
                disabled={disabled}
                setDisabled={setDisabled}
                width={width}
                handleDeleteEntry={handleDeleteEntry}
                setValidating={setValidating}
              />
            ))}
            <Grid item xs={12} className={classes.buttonContainer}>
              {editing ? (
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
  values: PropTypes.object,
  initValues: PropTypes.object,
  schema: PropTypes.object,
  entries: PropTypes.array,
  schemas: PropTypes.array,
  editing: PropTypes.bool,
  newSat: PropTypes.bool,
  setValues: PropTypes.func,
  setFieldValue: PropTypes.func,
  satelliteValidatorShaper: PropTypes.func,
  editingOne: PropTypes.bool,
  setEditingOne: PropTypes.func,
  setSatSchema: PropTypes.func,
  schemaIndex: PropTypes.number,
  accordionBeingEdited: PropTypes.number,
  setAccordionBeingEdited: PropTypes.func,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  touched: PropTypes.object,
  setTouched: PropTypes.func,
  errors: PropTypes.object,
  setErrors: PropTypes.func,
  dirty: PropTypes.bool,
  setSnack: PropTypes.func,
  setOpenSnack: PropTypes.func,
  setAlert: PropTypes.func,
  setOpenAlert: PropTypes.func,
  setValidating: PropTypes.func
};
