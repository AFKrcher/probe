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
  tooltip: {
    width: "10%",
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

  const orbits = ["GEO", "LEO", "HEO", "SSO", "Polar", "GTO"];

  return (
    <Grid container>
      <div style={{ width: "100%" }}>
        {orbits.map((orbit) => {
          return (
            <div key={orbit} className={classes.container}>
              <p className={classes.title}>{orbit}</p>
              {sats.map((sat) => {
                return sat.orbit[0].orbit === orbit ? (
                  <Tooltip
                    className={classes.tooltip}
                    title={
                      <span>
                        <p className={classes.title}>{sat.names[0]?.name}</p>
                        <p className={classes.helperText}>
                          {sat.descriptionShort[0]?.descriptionShort}
                        </p>
                      </span>
                    }
                  >
                    <span style={{ width: "10px" }} className={classes.item}>
                      {sat.noradID}
                    </span>
                  </Tooltip>
                ) : null;
              })}
            </div>
          );
        })}
      </div>
    </Grid>
  );
};
