// dependencies
import React, { useContext } from "react";
import HelpersContext from "./HelperContext.jsx";

// components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PromptDialog({ bodyPrompt }) {
  const { openPrompt, setOpenPrompt } = useContext(HelpersContext);

  const handleCancelAlert = async () => {
    await setOpenPrompt(false);
  };

  return (
    <div>
      <Dialog
        open={openPrompt}
        onClose={handleCancelAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ marginTop: 0 }}>
          {bodyPrompt ? bodyPrompt.title : "empty title"}
        </DialogTitle>
        <DialogContent style={{ marginTop: -5, marginBottom: 5 }}>
          {bodyPrompt ? bodyPrompt.text : "empty text"}
        </DialogContent>
        <DialogActions>
          {bodyPrompt ? bodyPrompt.actions : "empty actions"}
          <Button
            variant="contained"
            color="default"
            size="small"
            style={{ marginRight: 5, marginBottom: -3 }}
            onClick={handleCancelAlert}
          >
            {bodyPrompt.closeAction || "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
