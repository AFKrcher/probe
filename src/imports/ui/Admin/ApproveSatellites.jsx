import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";
import useWindowSize from "../Hooks/useWindowSize.jsx";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal.jsx";

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

const newSatValues = {
  noradID: "",
};

export const ApproveSatellites = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);

  const [width, height] = useWindowSize();

  const [satsDeleted, satsModified, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const satsDeleted = SatelliteCollection.find({ isDeleted: true }).fetch();
    const satsModified = SatelliteCollection.find({
      adminCheck: false,
    }).fetch();
    return [satsDeleted, satsModified, !sub.ready()];
  });

  const handleRowClick = (sat) => {
    setShowModal(true);
    setInitialSatValues(sat);
  };

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" aria-label="Schema table">
          <TableHead>
            <TableRow color="secondary">
              <TableCell>
                <Typography variant="body2">NORAD ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" className={classes.header}>
                  NAME(S)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">APPROVAL</Typography>
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
              satsDeleted.map((sat, i) => {
                return (
                  <TableRow
                    key={`sat-row-${i}`}
                    className={classes.tableRow}
                    onClick={() => handleRowClick(sat)}
                  >
                    <TableCell key={`sat-id-${i}`}>{sat.noradID}</TableCell>
                    <TableCell key={`sat-name-${i}`}>
                      {sat.names[0].name}
                    </TableCell>
                    <TableCell key={`sat-approve-${i}`}>
                      {!sat.adminCheck ? "TRUE" : "FALSE"}
                    </TableCell>
                    <TableCell key={`sat-delete-${i}`}>
                      {sat.isDeleted ? "TRUE" : "FALSE"}
                    </TableCell>
                    <TableCell key={`sat-modOn-${i}`}>
                      {`${sat.modifiedOn || sat.createdOn}`}
                    </TableCell>
                    <TableCell key={`sat-modBy-${i}`}>
                      {`${sat.modifiedBy || sat.createdBy}`}
                    </TableCell>
                  </TableRow>
                );
              })}
            {!isLoading &&
              satsModified.map((sat, i) => {
                return !sat.isDeleted ? (
                  <TableRow
                    key={`sat-row-${i}`}
                    className={classes.tableRow}
                    onClick={() => handleRowClick(sat)}
                  >
                    <TableCell key={`sat-id-${i}`}>{sat.noradID}</TableCell>
                    <TableCell key={`sat-name-${i}`}>
                      {sat.names[0].name}
                    </TableCell>
                    <TableCell key={`sat-approve-${i}`}>
                      {!sat.adminCheck ? "TRUE" : "FALSE"}
                    </TableCell>
                    <TableCell key={`sat-delete-${i}`}>
                      {sat.isDeleted ? "TRUE" : "FALSE"}
                    </TableCell>
                    <TableCell key={`sat-modOn-${i}`}>
                      {`${sat.modifiedOn || sat.createdOn}`}
                    </TableCell>
                    <TableCell key={`sat-modBy-${i}`}>
                      {`${sat.modifiedBy || sat.createdBy}`}
                    </TableCell>
                  </TableRow>
                ) : null;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <SatelliteModal
        show={showModal}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
        width={width}
        height={height}
        admin={true}
      />
    </div>
  );
};
