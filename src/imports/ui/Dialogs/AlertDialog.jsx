import React, { useContext } from "react";
import PropTypes from "prop-types";
// Imports
import HelpersContext from "./HelpersContext.jsx";

// @material-ui
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog({ bodyAlert }) {
  const { openAlert, setOpenAlert } = useContext(HelpersContext);

  const handleCancelAlert = async () => {
    await setOpenAlert(false);
  };

  return (
    <div>
      <Dialog open={openAlert} onClose={handleCancelAlert}>
        <DialogTitle>{bodyAlert ? bodyAlert.title : "empty title"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {bodyAlert ? bodyAlert.text : "empty text"}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: bodyAlert?.actions
              ? "space-between"
              : "space-around",
            margin: "5px 15px 10px 15px",
          }}
        >
          {bodyAlert ? bodyAlert.actions : "empty actions"}
          <Button size="small" variant="contained" onClick={handleCancelAlert}>
            {bodyAlert?.closeAction || "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Prop checking
AlertDialog.propTypes = {
  bodyAlert: PropTypes.object,
};
