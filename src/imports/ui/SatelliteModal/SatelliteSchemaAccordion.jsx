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
  accordianDetails: {
    marginTop: -10,
  },
  description: {
    margin: "5px 10px 5px 10px",
  },
  button: {
    marginTop: 5,
    marginLeft: 2.5,
  },
}));

export const SatelliteSchemaAccordion = ({
  schema,
  entries,
  setFieldValue,
  editing,
  newSat,
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

  const onDeleteSchema = () => {
    console.log(schema);
  };

  const handleEntryDelete = (schemaName, index) => {
    const newEntries = entries;
    newEntries.splice(index, 1);
    setFieldValue(schemaName, newEntries);
  };

  return (
    <Accordion
      className={classes.accordionbody}
      defaultExpanded={schema.name === "names" && newSat ? true : false}
    >
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
        <Grid container spacing={1} justifycontent="center">
          <Typography className={classes.description}>
            {schema.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."}
          </Typography>

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
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={onAddField}
                className={classes.button}
              >
                Add Schema Entry
              </Button>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
