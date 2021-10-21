import React, { useState } from "react";

// @material-ui
import { makeStyles, Typography, Tooltip } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MouseIcon from "@material-ui/icons/Mouse";
import VerifiedIcon from "@material-ui/icons/CheckBoxOutlined";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheck";
import IndeterminateIcon from "@material-ui/icons/IndeterminateCheckBox";
import IndeterminateOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import NotReviewedIcon from "@material-ui/icons/Cancel";
import NotReviewedOutlinedIcon from "@material-ui/icons/CancelOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  key: {
    marginLeft: 10,
    marginBottom: 20,
    display: "flex",
  },
  keyItems: {
    marginRight: "0.5ch",
  },
  keyItemsStar: {
    marginRight: "0.5ch",
    fill: "gold",
  },
  keyItemsValid: {
    marginRight: "0.5ch",
    fill: theme.palette.success.light,
  },
  keyItemsPartial: {
    marginRight: "0.5ch",
    fill: theme.palette.warning.light,
  },
  keyItemsInvalid: {
    marginRight: "0.5ch",
    fill: theme.palette.error.light,
  },
  showKey: {
    marginBottom: 20,
    color: theme.palette.text.disabled,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.info.light,
    },
    width: "10ch",
  },
}));

export const Key = ({ page, mini }) => {
  // Where page is the name of the component
  const classes = useStyles();

  const [showKey, setShowKey] = useState(false);

  return (
    <span className={classes.root}>
      <Typography
        variant="body2"
        className={classes.showKey}
        onClick={() => setShowKey(!showKey)}
      >
        {showKey ? "Hide Key..." : "Show Key..."}
      </Typography>

      {showKey && (
        <React.Fragment>
          {Meteor.userId() && page === "SatellitesTable" && (
            <Typography gutterBottom variant="body2" className={classes.key}>
              <StarIcon fontSize="small" className={classes.keyItemsStar} />
              <span className={classes.keyItems}>–</span>
              Add a satellite to your favorites list
            </Typography>
          )}
          <Typography gutterBottom variant="body2" className={classes.key}>
            <VisibilityIcon fontSize="small" className={classes.keyItems} />
            {page !== "SchemasTable" ? (
              <React.Fragment>
                <span className={classes.keyItems}>–</span> Open a satellite to
                view and/or modify its schemas or entries
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span className={classes.keyItems}>–</span> Open a schema to
                view and/or modify its fields
              </React.Fragment>
            )}
          </Typography>
          {page !== "SchemasTable" && (
            <React.Fragment>
              <Typography gutterBottom variant="body2" className={classes.key}>
                <DashboardIcon fontSize="small" className={classes.keyItems} />
                <span className={classes.keyItems}>–</span>
                Open the satellite dashboard with a shareable URL
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.key}>
                <img
                  src="/assets/saberastro.png"
                  width="21px"
                  height="21px"
                  className={classes.keyItems}
                />
                <span className={classes.keyItems}>–</span> Open a satellite in
                Space Cockpit for visualization and analysis
              </Typography>
            </React.Fragment>
          )}
          {(page !== "Home" || mini) && (
            <Typography gutterBottom variant="body2" className={classes.key}>
              <MouseIcon fontSize="small" className={classes.keyItems} />
              {page === "SatellitesTable" && (
                <React.Fragment>
                  <span className={classes.keyItems}>–</span> Hover over or
                  click to view satellite description, Double-click to view
                  and/or modify a satellite's schemas or entries
                </React.Fragment>
              )}
              {page === "SchemasTable" && (
                <React.Fragment>
                  <span className={classes.keyItems}>–</span> Hover over or
                  click a schema description to view, Double-click to view
                  and/or modify a schema's fields
                </React.Fragment>
              )}
              {mini && (
                <React.Fragment>
                  <span className={classes.keyItems}>–</span> Hover over a NORAD
                  ID to view the satellite name, COSPAR ID, and short
                  description, click to view the satellite data card
                </React.Fragment>
              )}
            </Typography>
          )}
          {page === "SatellitesTable" && (
            <React.Fragment>
              <Typography gutterBottom variant="body2" className={classes.key}>
                <Tooltip
                  title="Verified by <method>: <name> on <date>, and <method>: <method>: <name> on <date>"
                  placement="top"
                  arrow
                >
                  <VerifiedIcon
                    fontSize="small"
                    className={classes.keyItemsValid}
                  />
                </Tooltip>
                <Tooltip
                  title="Validated across multiple sources by <method>: <name> on <date>, and <method>: <method>: <name> on <date>"
                  placement="top"
                  arrow
                >
                  <ValidatedIcon
                    fontSize="small"
                    className={classes.keyItemsValid}
                  />
                </Tooltip>
                <span className={classes.keyItems}>–</span> Information has been
                FULLY verified to be in the reference or validated across
                multiple sources by user(s) and web-crawling algorithm(s)
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.key}>
                <Tooltip
                  title="Verified by <method>: <name> on <date>"
                  placement="top"
                  arrow
                >
                  <IndeterminateOutlinedIcon
                    fontSize="small"
                    className={classes.keyItemsPartial}
                  />
                </Tooltip>
                <Tooltip
                  title="Validated across multiple sources by <method>: <name> on <date>"
                  placement="top"
                  arrow
                >
                  <IndeterminateIcon
                    fontSize="small"
                    className={classes.keyItemsPartial}
                  />
                </Tooltip>
                <span className={classes.keyItems}>–</span> Information has
                PARTIALLY been verified to be in the reference or validated
                across multiple sources by user(s) or web-crawling algorithm(s)
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.key}>
                <Tooltip
                  title="Not verified by user nor machine"
                  placement="top"
                  arrow
                >
                  <NotReviewedOutlinedIcon
                    fontSize="small"
                    className={classes.keyItemsInvalid}
                  />
                </Tooltip>
                <Tooltip
                  title="Not validated by user nor machine"
                  placement="top"
                  arrow
                >
                  <NotReviewedIcon
                    fontSize="small"
                    className={classes.keyItemsInvalid}
                  />
                </Tooltip>
                <span className={classes.keyItems}>–</span> Information has NOT
                been verified to be in the reference or validated across
                multiple sources by user(s) or web-crawling algorithm(s)
              </Typography>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </span>
  );
};
