import React, { useEffect } from "react";

// Components
import { SatelliteSchemaEntry } from "./SatelliteSchemaEntry";

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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  accordionbody: {
    backgroundColor: theme.palette.action.hover,
    width: "1000px",
    overflow: "hidden",
  },
  accordionheader: {
    display: "flex",
  },
  accordioncount: {
    marginRight: "10px",
  },
  accordianDetails: {
    marginTop: -15,
  },
  description: {
    margin: "5px 10px 10px 10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginTop: 5,
    marginLeft: 2.5,
  },
}));

export const SatelliteSchemaAccordion = ({
  errors,
  schema,
  entries,
  setFieldValue,
  editing,
}) => {

  const classes = useStyles();

  useEffect(() => {
    if (!entries) setFieldValue(schema.name, []);
  }, [entries]);

  const onAddField = async () => {
    const schemaFields = schema.fields.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: "" }),
      {}
    );
    const newEntries = [...entries, schemaFields];
    await setFieldValue(schema.name, newEntries);
  };

  const handleEntryDelete = (schemaName, index) => {
    let newEntries = entries.map((entry) => entry);
    newEntries.splice(index, 1);
    setFieldValue(schemaName, newEntries);
  };

  return (
    <>
      <Accordion className={classes.accordionbody}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={`${schema.name}-accord-header`}
        >
          <div className={classes.accordionheader}>
            <Chip
              className={classes.accordioncount}
              size="small"
              label={entries?.length ? entries.length : "0"}
            />
            <Typography variant="body1">{schema.name}</Typography>
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
                deleteEntry={handleEntryDelete}
                setFieldValue={setFieldValue}
                editing={editing}
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
