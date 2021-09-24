import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import { SchemaCollection } from "../../api/schemas";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";

// Components
import { Link } from "react-router-dom";
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginBottom: 25,
    marginTop: 10,
  },
  table: {
    overflow: "auto",
    height: "100%",
    backgroundColor: theme.palette.grid.background,
  },
  header: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  spinner: {
    color: theme.palette.text.primary,
  },
  link: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
}));

const newSchemaValues = {
  name: "",
  description: "",
  fields: [
    {
      name: "reference",
      description: "",
      type: "url",
      allowedValues: [],
      min: null,
      max: null,
      required: true,
    },
  ],
};

export const SchemasTable = () => {
  const classes = useStyles();

  const [width] = useWindowSize();

  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
  };

  const handleRowClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
  };

  const AddSchemaButton = () => {
    return (
      <Grid
        container
        item
        xs
        justifyContent={width > 650 ? "flex-end" : "flex-start"}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewSchema}
        >
          + Add Schema
        </Button>
      </Grid>
    );
  };


  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Schemas</Typography>
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          {width > 650 ? (
            <ProtectedFunctionality
              component={AddSchemaButton}
              loginRequired={true}
            />
          ) : null}
        </Grid>
        {width < 650 ? (
          <div style={{ margin: "10px 0px 10px 0px" }}>
            {
              <ProtectedFunctionality
                component={AddSchemaButton}
                loginRequired={true}
              />
            }
          </div>
        ) : null}
      </Grid>
      <Typography gutterBottom variant="body2" className={classes.description}>
        Each <strong>schema</strong> is built to store sets of data that
        characterize a satellite. Please see the satellites on the{" "}
        <Tooltip title="Bring me to the schemas page">
          <Link to="/satellites" className={classes.link}>
            previous page
          </Link>
        </Tooltip>{" "}
        for usage examples. Each <strong>schema</strong> has a reference for
        where the data was found, a description describing what the data is, and
        a number of data fields that contain the actual information. Click on a
        desired <strong>schema</strong> below to view its details and edit the
        entry fields.
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" aria-label="Schema table">
          <TableHead>
            <TableRow color="secondary">
              <TableCell className={classes.header}>
                <Typography variant="body2">SCHEMA NAME</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">SCHEMA DESCRIPTION</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress className={classes.spinner} />
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              schemas.map((schema, i) => (
                <TableRow
                  key={`schema-row-${i}`}
                  className={classes.tableRow}
                  onClick={() => handleRowClick(schema)}
                >
                  <TableCell
                    key={`schema-name-${i}`}
                    className={classes.tableNameCol}
                  >
                    {schema.name}
                  </TableCell>
                  <TableCell key={`schema-desc-${i}`}>
                    {schema.description || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SchemaModal
        show={showModal}
        newSchema={newSchema}
        initValues={initialSchemaValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
