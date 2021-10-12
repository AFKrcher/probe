import React, { useState, useEffect, useContext } from "react";

//Imports
import { useTracker } from "meteor/react-meteor-data";

//Components
import { SatelliteCollection } from "../../api/satellites";

//@material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.grid.background,
    marginBottom: "10px",
  },
  item: {
    margin: "10px",
    color: ({ color }) => color,
    "&:hover": {
      color: "red",
      cursor: "pointer",
    },
  },
  title: {
    margin: "5px",
    fontSize: "24px",
  },
  helperText: {
    fontSize: "15px",
    margin: "5px",
  },
}));

export const Minified = () => {
  const classes = useStyles();
  const [limiter, setLimiter] = useState();
  const [page, setPage] = useState();
  const [sats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find(
      {
        "orbit.orbit": { $exists: true },
      },
      {
        fields: {
          noradID: 1,
          "names.name": 1,
          "orbit.orbit": 1,
          "descriptionShort.descriptionShort": 1,
        },
      }
    )
      .fetch()
      .filter((sat) => !sat.isDeleted);
    console.log(sats);
    return [sats, !sub.ready()];
  });

  const openCard = (sat) => {
    console.log(sat);
  };

  const orbits = ["GEO", "LEO", "HEO", "SSO", "Polar", "GTO"];

  return (
    <div>
      <div className={classes.container}>
        <b className={classes.title}>LEO</b>
        {orbits.map((orbit) => orbit)}
        <Grid container>
          {sats.map((sat) => {
            return sat.orbit[0].orbit === "LEO" ? (
              <Grid
                item
                key={sat.noradID}
                className={classes.item}
                onClick={() => {
                  openCard(sat);
                }}
              >
                {sat.noradID}
              </Grid>
            ) : (
              ""
            );
          })}
        </Grid>
      </div>
      <div className={classes.container}>
        <b className={classes.title}>GEO</b>
        <Grid container>
          {sats.map((sat) => {
            return sat.orbit[0].orbit === "GEO" ? (
              <Tooltip
                title={
                  <div className={classes.helperText}>
                    <p className={classes.title}>{sat.names[0].name}</p>
                    {sat.descriptionShort[0].descriptionShort}
                  </div>
                }
              >
                <Grid
                  item
                  key={sat.noradID}
                  className={classes.item}
                  onClick={() => {
                    openCard(sat);
                  }}
                >
                  {sat.noradID}
                </Grid>
              </Tooltip>
            ) : (
              ""
            );
          })}
        </Grid>
      </div>
      <div className={classes.container}>
        <b className={classes.title}>HEO</b>
        <Grid container>
          {sats.map((sat) => {
            return sat.orbit[0].orbit === "HEO" ? (
              <Grid
                item
                key={sat.noradID}
                className={classes.item}
                onClick={() => {
                  openCard(sat);
                }}
              >
                {sat.noradID}
              </Grid>
            ) : (
              ""
            );
          })}
        </Grid>
      </div>
    </div>
  );
};
