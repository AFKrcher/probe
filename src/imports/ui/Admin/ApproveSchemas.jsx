import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";

// Components
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";

// @material-ui
import {
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
} from "@material-ui/core";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    paddingTop: 5,
    paddingBottom: 5,
  },
  table: {
    margin: "10px 10px 10px 10px",
    width: "auto",
    overflow: "auto",
    height: "100%",
    backgroundColor: theme.palette.grid.background,
  },
  header: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  warningIcon: {
    fill: theme.palette.warning.light,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
    marginLeft: 15,
  },
  errorIcon: {
    fill: theme.palette.error.light,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
    marginLeft: 15,
  },
  spinner: {
    color: theme.palette.text.primary,
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
      stringMax: null,
    },
  ],
};

export const ApproveSchemas = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);

  const [schemasDeleted, schemasModified, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemasDeleted = SchemaCollection.find({ isDeleted: true }).fetch();
    const schemasModified = SchemaCollection.find({
      adminCheck: false,
    }).fetch();
    return [schemasDeleted, schemasModified, !sub.ready()];
  });

  const handleRowClick = (schemaObject) => {
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
  };

  const cells = (schema, i) => {
    console.log(schemasDeleted);
    return (
      <TableRow
        key={`schema-row-${i}`}
        className={classes.tableRow}
        onClick={() => handleRowClick(schema)}
      >
        <TableCell key={`schema-name-${i}`} className={classes.tableNameCol}>
          {schema.name}
        </TableCell>
        <TableCell key={`schema-approve-${i}`}>
          {!schema.adminCheck ? (
            <ErrorOutlinedIcon
              fontSize="small"
              className={classes.warningIcon}
            />
          ) : null}
        </TableCell>
        <TableCell key={`schema-delete-${i}`}>
          {schema.isDeleted ? (
            <ErrorOutlinedIcon fontSize="small" className={classes.errorIcon} />
          ) : null}
        </TableCell>
        <TableCell key={`schema-modOn-${i}`}>
          {`${schema.modifiedOn || schema.createdOn}`}
        </TableCell>
        <TableCell key={`schema-modBy-${i}`}>
          {`${schema.modifiedBy || schema.createdBy}`}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.table} elevation={5}>
        <Table size="small" aria-label="Schema table">
          <TableHead>
            <TableRow color="secondary">
              <TableCell className={classes.header}>
                <Typography variant="body2">SCHEMA NAME</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">ADMIN REVIEW</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">DELETION</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">MODIFIED ON</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">MODIFIED BY</Typography>
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
              schemasDeleted.map((schema, i) => {
                return cells(schema, i);
              })}
            {!isLoading &&
              schemasModified.map((schema, i) => {
                return cells(schema, i);
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <SchemaModal
        show={showModal}
        initValues={initialSchemaValues}
        handleClose={() => setShowModal(false)}
        admin={true}
      />
    </div>
  );
};
