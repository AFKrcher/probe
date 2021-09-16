import React, { useState, useContext } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import { SatelliteCollection } from "../../api/satellites";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import {
  emptyDataRemover,
  schemaGenerator
} from "../utils/satelliteDataFuncs.js";

// Components
import { Formik, Form } from "formik";
import AlertDialog from "../Dialogs/AlertDialog.jsx";
import SnackBar from "../Dialogs/SnackBar.jsx";

// @material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import DialogContentText from '@material-ui/core/DialogContentText';
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";

export const AdminModal = ({
  show,
  newSat,
  initValues,
  width,
}) => {
  const { setOpenAlert, alert, setAlert, setOpenSnack, snack, setSnack } =
    useContext(HelpersContext);

    const [open, setOpen] = useState(false)
      const handleClose = () => {
        setOpen(false);
      };

  return (
    <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button 
          onClick={handleClose} 
        color="primary">
            Disagree
        </Button>
        <Button
            onClick={handleClose}
            color="primary" autoFocus>
            Agree
        </Button>
        </DialogActions>
    </Dialog>
  );
};
