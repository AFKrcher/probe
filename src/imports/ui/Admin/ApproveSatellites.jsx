import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
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
  IconButton,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
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
  noradId: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 50,
  },
  names: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 200,
  },
  adminReview: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 100,
  },
  machineReview: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 100,
  },
  deletion: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 50,
  },
  modifiedOn: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 280,
  },
  modifiedBy: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
    width: 110,
  },
  filterableHeader: {
    display: "flex",
    alignItems: "center",
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
  },
  errorIcon: {
    fill: theme.palette.error.light,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
  },
  filterButton: {
    marginLeft: 5,
  },
  spinner: {
    color: theme.palette.text.primary,
  },
}));

const newSatValues = {
  noradID: "",
};

export const ApproveSatellites = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);
  const [viewAdminCheck, setViewAdminCheck] = useState(true);
  const [viewMachineCheck, setViewMachineCheck] = useState(true);
  const [viewDeleteCheck, setViewDeleteCheck] = useState(true);

  const [width, height] = useWindowSize();

  const [
    satsDeleted,
    satsAdminCheck,
    satsMachineCheck,
    satsBothCheck,
    isLoading,
  ] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const satsDeleted = SatelliteCollection.find({ isDeleted: true }).fetch();
    const satsAdminCheck = SatelliteCollection.find({
      adminCheck: false,
      machineCheck: true,
    }).fetch();
    const satsMachineCheck = SatelliteCollection.find({
      machineCheck: false,
      adminCheck: true,
    }).fetch();
    const satsBothCheck = SatelliteCollection.find({
      machineCheck: false,
      adminCheck: false,
    }).fetch();
    return [
      satsDeleted,
      satsAdminCheck,
      satsMachineCheck,
      satsBothCheck,
      !sub.ready(),
    ];
  });

  const handleRowClick = (sat) => {
    setShowModal(true);
    setInitialSatValues(sat);
  };

  const cells = (sat, i) => {
    return (
      <TableRow
        key={`sat-row-${i}`}
        className={classes.tableRow}
        onClick={() => handleRowClick(sat)}
      >
        <TableCell key={`sat-id-${i}`}>{sat.noradID}</TableCell>
        <TableCell key={`sat-name-${i}`}>{sat.names[0].name}</TableCell>
        <TableCell key={`sat-adminCheck-${i}`} align="center">
          {!sat.adminCheck ? (
            <ErrorOutlinedIcon className={classes.warningIcon} />
          ) : null}
        </TableCell>
        <TableCell key={`sat-machineCheck-${i}`} align="center">
          {!sat.machineCheck ? (
            <ErrorOutlinedIcon className={classes.warningIcon} />
          ) : null}
        </TableCell>
        <TableCell key={`sat-delete-${i}`} align="center">
          {sat.isDeleted ? (
            <ErrorOutlinedIcon className={classes.errorIcon} />
          ) : null}
        </TableCell>
        <TableCell key={`sat-modOn-${i}`}>
          {`${sat.modifiedOn || sat.createdOn}`}
        </TableCell>
        <TableCell key={`sat-modBy-${i}`}>
          {`${sat.modifiedBy || sat.createdBy}`}
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
              <TableCell className={classes.noradId}>
                <Typography variant="body2">NORAD ID</Typography>
              </TableCell>
              <TableCell className={classes.names}>
                <Typography variant="body2">NAME(S)</Typography>
              </TableCell>
              <TableCell className={classes.adminReview} align="center">
                <span className={classes.filterableHeader}>
                  <Typography variant="body2">ADMIN REVIEW</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setViewAdminCheck(!viewAdminCheck)}
                  >
                    {viewAdminCheck ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </TableCell>
              <TableCell className={classes.machineReview} align="center">
                <span className={classes.filterableHeader}>
                  <Typography variant="body2">MACHINE REVIEW</Typography>
                  <IconButton
                    className={classes.filterButton}
                    size="small"
                    onClick={() => setViewMachineCheck(!viewMachineCheck)}
                  >
                    {viewMachineCheck ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </TableCell>
              <TableCell className={classes.deletion} align="center">
                <span className={classes.filterableHeader}>
                  <Typography variant="body2">DELETION</Typography>
                  <IconButton
                    className={classes.filterButton}
                    size="small"
                    onClick={() => setViewDeleteCheck(!viewDeleteCheck)}
                  >
                    {viewDeleteCheck ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </TableCell>
              <TableCell className={classes.modifiedOn}>
                <Typography variant="body2">MODIFIED ON</Typography>
              </TableCell>
              <TableCell className={classes.modifiedBy}>
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
              satsDeleted.map((sat, i) =>
                viewDeleteCheck ? cells(sat, i) : null
              )}
            {!isLoading &&
              satsAdminCheck.map((sat, i) =>
                !sat.isDeleted && viewAdminCheck ? cells(sat, i) : null
              )}
            {!isLoading &&
              satsBothCheck.map((sat, i) =>
                !sat.isDeleted && (viewMachineCheck || viewAdminCheck)
                  ? cells(sat, i)
                  : null
              )}
            {!isLoading &&
              satsMachineCheck.map((sat, i) =>
                !sat.isDeleted && viewMachineCheck ? cells(sat, i) : null
              )}
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
