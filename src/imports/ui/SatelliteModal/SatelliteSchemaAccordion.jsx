import React, { useEffect } from "react";
// Imports

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
  },
  accordionheader: {
    display: "flex",
  },
  accordioncount: {
    marginRight: "10px",
  },
}));

export const SatelliteSchemaAccordion = ({
  schema,
  entries,
  setFieldValue,
  editing,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!entries) setFieldValue(schema.name, []);
  }, [entries]);

  const onAddField = () => {
    const schemaFields = schema.fields.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: "" }),
      {}
    );
    const newEntries = [...entries, schemaFields];
    setFieldValue(schema.name, newEntries);
  };

  const handleEntryDelete = (schemaName, index) => {
    const newEntries = entries;
    newEntries.splice(index, 1);
    setFieldValue(schemaName, newEntries);
  };

  return (
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
          <Typography variant="subtitle1">{schema.name}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} justifycontent="center">
          <Grid item xs={12}>
            <Typography>{schema.description}</Typography>
          </Grid>
          {entries?.map((entry, index) => (
            <SatelliteSchemaEntry
              key={index}
              index={index}
              schema={schema}
              entry={entry}
              deleteEntry={handleEntryDelete}
              setFieldValue={setFieldValue}
              editing={editing}
            />
          ))}
          <Grid item xs={12}>
            {editing && (
              <Button variant="outlined" color="primary" onClick={onAddField}>
                Add Schema Entry
              </Button>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
