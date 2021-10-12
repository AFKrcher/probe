import React, { useState, useEffect } from "react";

// Components
import { SatelliteSchemaEntry } from "./SatelliteSchemaEntry";
import useWindowSize from "../Hooks/useWindowSize.jsx";

// @material-ui
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Button,
  makeStyles,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  accordionBody: {
    backgroundColor: theme.palette.action.hover,
    width: "1000px",
    overflow: "hidden",
  },
  accordionHeader: {
    display: "flex",
    alignItems: "center",
  },
  accordionTitle: {
    marginRight: "5px",
    marginLeft: "10px",
  },
  helpIcon: {
    color: theme.palette.text.disabled,
    fontSize: "medium",
  },
  iconButtons: {
    display: "flex",
    pointerEvents: "auto",
  },
  editIcon: {
    padding: 6,
    margin: "-6px 5px -6px -15px",
  },
  closeIcon: {
    padding: 6,
    margin: "-6px 20px -6px -15px",
  },
  saveIcon: {
    padding: 6,
    margin: "-6px 0px -6px -15px",
  },
  accordianDetails: {
    marginTop: -15,
  },
  description: {
    margin: "5px 10px 10px 10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    marginTop: 5,
    marginLeft: 2.5,
  },
}));

export const SatelliteSchemaAccordion = ({
  dirty,
  errors,
  schema,
  schemas,
  entries,
  setFieldValue,
  editing,
  setSatSchema,
  values,
  isUniqueList,
  satelliteValidatorShaper,
  setTouched,
  editingOne,
  setEditingOne,
  schemaIndex,
  accordionBeingEdited,
  setAccordionBeingEdited,
  initValues,
  setOpenSnack,
  setSnack,
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
    const schemaFields = schema.fields.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: "" }),
      {}
    );
    const newEntries = [...entries, schemaFields];
    await setFieldValue(schema.name, newEntries);
    setSatSchema(satelliteValidatorShaper(schemas, values, isUniqueList));
  };

  const handleEditSchema = () => {
    setEditingSchema(!editingSchema);
    setEditingOne(!editingOne);
    if (editingSchema) {
      setAccordionBeingEdited(-1);
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
            <strong>
              {values.names && values.names[0] ? values.names[0].name : "N/A"}
            </strong>
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
        <AccordionSummary
          onClick={handleExpand}
          expandIcon={<ExpandMoreIcon />}
          id={`${schema.name}-accord-header`}
        >
          <Grid container spacing={editingSchema ? 1 : 4}>
            <Grid item className={classes.accordionHeader} xs={11}>
              <Chip
                size="small"
                label={entries?.length ? entries.length : "0"}
              />
              <Typography variant="body1" className={classes.accordionTitle}>
                {schema.name}
              </Typography>
              <Tooltip title={schema.description} placement="top-start" arrow>
                <HelpIcon fontSize="small" className={classes.helpIcon} />
              </Tooltip>
            </Grid>
            {!editing &&
            width > 800 &&
            (accordionBeingEdited === schemaIndex ||
              accordionBeingEdited === -1) ? (
              <Grid item className={classes.iconButtons}>
                {!editingSchema ? (
                  Meteor.userId() ? ( // not using ProtectedFunctionality on this due to slow load times on .map() of accordions
                    <Tooltip
                      title={
                        <React.Fragment>
                          Edit <strong>{schema.name}</strong> entry
                        </React.Fragment>
                      }
                      placement="top-end"
                      arrow
                    >
                      <IconButton
                        className={classes.editIcon}
                        onClick={handleEditSchema}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : null
                ) : (
                  <React.Fragment>
                    <Tooltip title="Cancel Changes" placement="top" arrow>
                      <IconButton
                        className={classes.closeIcon}
                        onClick={handleEditSchema}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Changes" placement="top" arrow>
                      <span>
                        <IconButton
                          className={classes.saveIcon}
                          disabled={!dirty}
                          onClick={() => {
                            handleSubmit(values);
                          }}
                          color="primary"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </React.Fragment>
                )}
              </Grid>
            ) : null}
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordianDetails}>
          <Grid container spacing={1}>
            <Typography className={classes.description}>
              {schema.description || "N/A"}
            </Typography>
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
                isUniqueList={isUniqueList}
                schemas={schemas}
                satelliteValidatorShaper={satelliteValidatorShaper}
                setTouched={setTouched}
                values={values}
                setExpanded={setExpanded}
                width={width}
              />
            ))}
            <Grid item xs={12} className={classes.buttonContainer}>
              {editing || editingSchema ? (
                <Button
                  variant="contained"
                  size="medium"
                  color="default"
                  onClick={onAddField}
                  className={classes.button}
                >
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
