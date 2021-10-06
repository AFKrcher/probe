import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { ErrorsCollection } from "../../api/errors";

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
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  spinner: {
    color: theme.palette.text.primary,
  },
}));

export const ErrorLog = () => {
  const classes = useStyles();

  const [errors, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("errors");
    const errors = ErrorsCollection.find().fetch();
    return [errors, !sub.ready()];
  });

  const deleteError = (id) => {
    Meteor.call("deleteError", id, (err, res) => {
      if (err || res) console.log(err || res);
    });
  };

  const viewError = (error) => {
    alert(JSON.stringify(error.error));
  };

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" aria-label="Schema table">
          <TableHead>
            <TableRow color="secondary">
              <TableCell className={classes.header}>
                <Typography variant="body2">ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">MESSAGE</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">SOURCE</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">TIME</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">USER</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" style={{ textAlign: "center" }}>
                  ACTIONS
                </Typography>
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
              errors.map((error, i) => {
                return (
                  <TableRow key={`error-row-${i}`} className={classes.tableRow}>
                    <TableCell key={`error-id-${i}`}>{error._id}</TableCell>
                    <TableCell key={`error-message-${i}`}>
                      {error.msg}
                    </TableCell>
                    <TableCell key={`error-source-${i}`}>
                      {error.source}
                    </TableCell>
                    <TableCell
                      key={`error-time-${i}`}
                    >{`${error.time}`}</TableCell>
                    <TableCell key={`error-user-${i}`}>{error.user}</TableCell>
                    <TableCell
                      key={`error-actions-${i}`}
                      style={{ textAlign: "center" }}
                    >
                      <IconButton
                        style={{ marginRight: 10 }}
                        onClick={() => viewError(error)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => deleteError(error._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
