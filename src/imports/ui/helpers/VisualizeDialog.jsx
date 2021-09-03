import React, { useState } from "react";

// @material-ui
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PromptDialog({ bodyPrompt, open }) {
  const [setOpenPrompt] = useState(true);

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
      >
        {bodyPrompt ? bodyPrompt.title : "empty title"}
      </DialogTitle>
      <DialogContent>
        {bodyPrompt ? bodyPrompt.text : "empty text"}
      </DialogContent>
    </Dialog>
  );
}
