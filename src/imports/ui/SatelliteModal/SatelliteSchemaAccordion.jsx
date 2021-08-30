import React, { useEffect, useContext } from "react";
// Imports
import HelpersContext from "../helpers/HelpersContext.jsx";

// Components
import { SatelliteSchemaEntry } from "./SatelliteSchemaEntry";
import AlertDialog from "../helpers/AlertDialog.jsx";

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
  setValues,
  values,
  setShape
}) => {
  const { setOpenAlert, alert, setAlert } = useContext(HelpersContext);

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
    setAlert({
      title: (
        <span>
          Delete <strong>{schemaName}</strong> Schema?
        </span>
      ),
      text: (
        <span>
          Are you sure you want to delete <strong>{schemaName}</strong> and all
          of its data?
        </span>
      ),
      actions: (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disableElevation
          onClick={() => {
            let newEntries = entries.splice(index, 1)
            setFieldValue(schemaName, newEntries);
            setOpenAlert(false);
          }}
        >
          Confirm
        </Button>
      ),
      closeAction: "Cancel",
    });
    setOpenAlert(true);
  };

  return (
    <>
      <AlertDialog bodyAlert={alert} />
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
              {schema.description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."}
            </Typography>
            {entries?.map((entry, index) => (
              <SatelliteSchemaEntry
                errors={errors}
                key={index}
                index={index}
                schema={schema}
                entry={entry}
                deleteEntry={handleEntryDelete}
                setFieldValue={setFieldValue}
                editing={editing}
                setShape={setShape}
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
    </>
  );
};
