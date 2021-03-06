import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui
import { makeStyles, Typography, Snackbar, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%"
  },
  popper: {
    width: "80vw",
    backgroundColor: theme.palette.popper.background,
    color: theme.palette.popper.text,
    border: `1px solid ${theme.palette.tertiary.shadow}`,
    padding: 10
  }
}));

export const Popper = ({ open, value }) => {
  const classes = useStyles();

  const [popperBody, setPopperBody] = useState(null);
  const [showPopper, setShowPopper] = useState(false);

  useEffect(() => {
    if (open) {
      setPopperBody(value);
      setShowPopper(true);
    } else {
      setShowPopper(false);
    }
  }, [open, value]);

  return (
    <div className={classes.root}>
      <Snackbar open={showPopper} onClose={() => setShowPopper(false)}>
        <Paper className={classes.popper} elevation={5}>
          <Typography>{popperBody}</Typography>
        </Paper>
      </Snackbar>
    </div>
  );
};

// Prop checking
Popper.propTypes = {
  open: PropTypes.bool,
  value: PropTypes.string
};
