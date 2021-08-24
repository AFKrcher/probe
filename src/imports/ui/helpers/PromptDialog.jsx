// dependencies
import React, { useState } from "react";
import HelpersContext from "./HelpersContext.jsx";

// components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PromptDialog({ bodyPrompt, open }) {
  const [openPrompt, setOpenPrompt] = useState(true);

  const handleCancelAlert = async () => {
    await setOpenPrompt(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancelAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen={true}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ marginTop: 0, marginBottom: -10 }}
      >
        {bodyPrompt ? bodyPrompt.title : "empty title"}
      </DialogTitle>
      <DialogContent>
        {bodyPrompt ? bodyPrompt.text : "empty text"}
      </DialogContent>
      <DialogActions>
        {bodyPrompt ? bodyPrompt.actions : "empty actions"}
      </DialogActions>
    </Dialog>
  );
}
