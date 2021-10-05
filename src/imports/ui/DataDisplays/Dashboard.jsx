import React from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";

// @material-ui
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh",
  },
}));

export const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();

  const location = useLocation();
  let path = location.pathname;
  path = path.substring(1);

  const [sats, isLoading, favorites, user] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const user = Meteor.user()?.username;
    const favorites = Meteor.user()?.favorites;
    let sats;
    if (path) {
      sats = SatelliteCollection.find(
        {
          noradID: path,
        },
        {}
      ).fetch();
    }
    if (sats.length === 0) {
      sats = [{ names: [], noradID: path }];
    }
    return [sats, !sub.ready(), favorites, user];
  });

  return (
    <React.Fragment>
      {isLoading ? (
        <div className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </div>
      ) : (
        <SatelliteModal
          show={true}
          initValues={sats[0]}
          newSat={false}
          handleClose={() => {
            history.push("/satellites");
          }}
          width={"100%"}
          height={"100%"}
          path={path}
        />
      )}
    </React.Fragment>
  );
};
