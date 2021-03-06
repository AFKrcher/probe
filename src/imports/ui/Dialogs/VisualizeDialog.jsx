import React, { useContext } from "react";
import PropTypes from "prop-types";
// Imports
import HelpersContext from "./HelpersContext.jsx";

// @material-ui
import { Tooltip, Typography, Dialog, DialogContent, DialogTitle, IconButton, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  modalButton: {
    marginTop: -2.5
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "0px 5px -15px 5px"
  }
}));

export default function VisualizeDialog({ body }) {
  const classes = useStyles();

  const { openVisualize, setOpenVisualize } = useContext(HelpersContext);

  const handleCancelVisualize = async () => {
    await setOpenVisualize(false);
  };

  const decideSatName = () => {
    if (body?.satellite) {
      if (typeof body.satellite === "string") return body?.satellite;
      if (body.satellite.names) return body.satellite.names[0].name;
    } else {
      return "New Satellite";
    }
  };

  return (
    <Dialog open={openVisualize} onClose={handleCancelVisualize} fullScreen={true}>
      <DialogTitle>
        <div className={classes.modalHeader}>
          <Tooltip title="Click to open Space Cockpit in a new tab" placement="right" arrow>
            <Typography onClick={() => window.open(body?.url, "_blank").focus()} style={{ cursor: "pointer" }}>
              Visualizing <b>{decideSatName()}</b> in Space Cockpit by Saber Astronautics
            </Typography>
          </Tooltip>
          <IconButton size="small" className={classes.modalButton} id="exitVisualize" onClick={handleCancelVisualize}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <iframe src={body?.url} height="99%" width="100%" title="SpaceCockpit" />
      </DialogContent>
    </Dialog>
  );
}

// Prop checking
VisualizeDialog.propTypes = {
  body: PropTypes.object
};
