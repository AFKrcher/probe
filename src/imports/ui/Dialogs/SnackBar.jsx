import React, { useContext } from "react";
import PropTypes from "prop-types";
// Imports
import HelpersContext from "./HelpersContext.jsx";

// @material-ui
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Snackbar } from "@material-ui/core";
export default function SimpleSnackbar({ bodySnackBar }) {
  const { openSnack, setOpenSnack } = useContext(HelpersContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleClose}
        message={bodySnackBar}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

// Prop checking
SimpleSnackbar.propTypes = {
  bodySnackBar: PropTypes.node
};
