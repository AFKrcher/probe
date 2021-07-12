import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Button, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Field } from 'formik';
import { SatelliteSchemaEntry } from './SatelliteSchemaEntry';

const useStyles = makeStyles((theme) => ({
  accordionbody: {
    backgroundColor: "#515151",
  },
  accordionheader: {
    display: "flex"
  },
  accordioncount: {
    marginRight: "10px"
  }
}))

export const SatelliteSchemaAccordion = ( {schema, entries, setFieldValue, editing} ) => {
  const classes = useStyles();

  const onAddField = () => {
    const schemaFields = schema.fields.reduce((acc, cur) => ({ ...acc, [cur.name]: ""}), {});
    const newEntries = [...entries, schemaFields];
    setFieldValue(schema.name, newEntries);
  }

  const handleEntryDelete = (schemaName, index) => {
    const newEntries = entries;
    newEntries.splice(index, 1);
    console.log(schema);
    console.log(schemaName);
    console.log(newEntries);
    setFieldValue(schemaName, newEntries);
  }
  
  return (
    <Accordion className={classes.accordionbody}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={`${schema.name}-accord-header`}
      >
        <div className={classes.accordionheader}>
          <Chip className={classes.accordioncount} size="small" label={entries.length} />
          <Typography variant="subtitle1">{schema.name}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <Typography>{schema.description}</Typography>
          </Grid>
          {entries.map((entry, index) => (
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
          { editing && (
              <Button
                variant="outlined"
                color="primary"
                onClick={onAddField}
              >
                Add schema entry
              </Button>
            )
          }
        </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
};
