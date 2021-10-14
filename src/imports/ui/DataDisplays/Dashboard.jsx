import React from "react";
// Imports
import { useLocation, useHistory } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import useWindowSize from "../Hooks/useWindowSize.jsx";

//Components
import { Gallery } from "./Gallery.jsx";

// @material-ui
import { CircularProgress, Grid, makeStyles } from "@material-ui/core";

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

  const [width, height] = useWindowSize();

  let path = location.pathname;
  path = path.substring(1);

  const [sats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
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
    return [sats, !sub.ready()];
  });

  const nameMapper = (sat) => {
    let names = [];
    if (sat.names.length > 1) {
      for (let i = 1; i < sat.names.length; i++) {
        if (i === sat.names.length - 1) {
          names.push(`${sat.names[i].name}`);
        } else {
          names.push(`${sat.names[i].name}, `);
        }
      }
    }
    return ` (AKA: ${names.join(" ")})`;
  };

  const sat = !isLoading ? sats[0] : null;
  // const test = (obj) => {
  //   Object.keys(obj).map((key, index) => {
  //     if (typeof obj[key] === "object") {
  //       // console.log(key, obj[key]);
  //       if (obj[key].length > 1) {
  //         obj[key].map((item, i) => {
  //           Object.keys(item).map((keys2, index2) => {
  //             console.log(keys2);
  //           });
  //         });
  //       }
  //     }
  //   });
  // };
  return (
    <Grid container>
      {!isLoading && !sat.isDeleted ? (
        <React.Fragment>
          <Grid item container xs={12} spacing={10}>
            <Grid item xs={6}>
              {sat.names ? (
                <div>
                  {sat.names[0].name}
                  {sat.names.length > 1 ? nameMapper(sat) : null}
                </div>
              ) : null}
              <p>
                Norad ID: {sat.noradID}
                {sat.cosparID ? sat.cosparID.cosparID : null}
              </p>
              <p>
                {sat.descriptionShort
                  ? sat.descriptionShort[0].descriptionShort
                  : null}
                {sat.descriptionLong
                  ? sat.descriptionLong[0].descriptionLong
                  : null}
              </p>
            </Grid>
            <Grid item xs={5}>
              <Gallery initValues={sat} clickable={true} description={true} />
            </Grid>
          </Grid>
        </React.Fragment>
      ) : (
        <div className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </div>
      )}
    </Grid>
  );
};
