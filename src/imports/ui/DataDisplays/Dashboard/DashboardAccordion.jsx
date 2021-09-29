import React, { useEffect } from "react";

// Components
import { SatelliteSchemaEntry } from "./DashboardSchemaEntry";

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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  accordionBody: {
    backgroundColor: theme.palette.action.hover,
    width: "1000px",
    overflow: "hidden",
  },
  accordionHeader: {
    display: "flex",
  },
  accordionTitle: {
    marginRight: "5px",
    marginLeft: "10px",
  },
  helpIcon: {
    color: theme.palette.text.disabled,
    fontSize: "medium",
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

export const DashboardAccordion = ({
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
}) => {
  const classes = useStyles();

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
    setSatSchema(satelliteValidatorShaper(schemas, values, isUniqueList)); //
  };

  return (
    <>
      <Accordion className={classes.accordionBody}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={`${schema.name}-accord-header`}
        >
          <div className={classes.accordionHeader}>
            <Chip size="small" label={entries?.length ? entries.length : "0"} />
            <Typography variant="body1" className={classes.accordionTitle}>
              {schema.name}
            </Typography>
            <Tooltip title={schema.description} placement="top-start" arrow>
              <HelpIcon fontSize="small" className={classes.helpIcon} />
            </Tooltip>
          </div>
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
                entries={entries}
                setSatSchema={setSatSchema}
                isUniqueList={isUniqueList}
                schemas={schemas}
                satelliteValidatorShaper={satelliteValidatorShaper}
                setTouched={setTouched}
                values={values}
              />
            ))}
            <Grid item xs={12} className={classes.buttonContainer}>
              {editing && (
                <Button
                  variant="contained"
                  size="medium"
                  color="default"
                  onClick={onAddField}
                  className={classes.button}
                >
                  + Add Entry
                </Button>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
