import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
//Imports
import { useTracker } from "meteor/react-meteor-data";

//Components
import { SatCard } from "./SatCard.jsx";
import { SatelliteCollection } from "../../api/satellites";
import { SchemaCollection } from "../../api/schemas";
import useWindowSize from "../Hooks/useWindowSize.jsx";

//@material-ui
import { Dialog, Grid, makeStyles, Tooltip, Typography, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    marginBottom: 30
  },
  paper: {
    backgroundColor: theme.palette.grid.background,
    marginTop: 10,
    borderRadius: 5
  },
  orbit: {
    padding: 10,
    fontWeight: 600
  },
  card: {
    margin: "0px 15px 10px 15px",
    color: ({ color }) => color,
    "&:hover": {
      color: theme.palette.info.light,
      cursor: "pointer"
    }
  },
  tooltip: {
    width: "auto"
  },
  description: {
    display: "flex",
    flexDirection: "column",
    padding: 5
  },
  satName: {
    fontWeight: 600
  },
  satDesc: {
    marginTop: 5
  }
}));

export const Mini = () => {
  const classes = useStyles();

  const [width, height] = useWindowSize();

  const [sats, regimes, isLoadingSats, isLoadingSchemas] = useTracker(() => {
    const subSats = Meteor.subscribe("satellites");
    const subSchemas = Meteor.subscribe("schemas");
    const sats = SatelliteCollection.find(
      { isDeleted: false },
      {
        fields: {
          noradID: 1,
          "names.name": 1,
          "orbits.orbit": 1,
          "descriptionShort.descriptionShort": 1,
          "cosparID.cosparID": 1
        }
      }
    )
      .fetch()
      .filter((sat) => !sat.isDeleted);
    const regimes = SchemaCollection.find({ name: "orbits" })
      .fetch()[0]
      .fields.find((field) => field.name === "orbit").allowedValues;
    return [sats, regimes, !subSats.ready(), !subSchemas.ready()];
  });

  const [open, setOpen] = useState(false);
  const [sat, setSat] = useState(SatelliteCollection.find({ noradID: 25544 }));

  const closeCard = () => {
    setOpen(false);
  };

  const openCard = (sat) => {
    const satellite = SatelliteCollection.find({ noradID: sat.noradID })
      .fetch()
      .filter((sat) => !sat.isDeleted);
    setSat(satellite[0]);
    setOpen(true);
  };

  const gridItem = (sat, index) => {
    return (
      <Grid item key={index} xs="auto" className={classes.card}>
        <Tooltip
          arrow
          className={classes.tooltip}
          title={
            <span className={classes.description}>
              <Typography variant="h6" className={classes.satName}>
                {sat.names ? sat.names[0]?.name : "N/A"}
              </Typography>
              <Typography variant="caption">NORAD ID: {sat.noradID ? sat.noradID : "N/A"}</Typography>
              <Typography variant="caption">COSPAR ID: {sat.cosparID ? sat.cosparID[0]?.cosparID : "N/A"}</Typography>
              <Typography variant="body2" className={classes.satDesc}>
                {sat.descriptionShort ? sat.descriptionShort[0]?.descriptionShort : "No description available"}
              </Typography>
            </span>
          }>
          <Typography variant="body2" onClick={() => openCard(sat)}>
            {sat.noradID}
          </Typography>
        </Tooltip>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <span className={classes.container}>
        <Dialog open={open} onClose={closeCard} maxWidth="xs" fullWidth scroll="body">
          <SatCard satellite={sat} width={width} height={height} />
        </Dialog>
        {isLoadingSats || isLoadingSchemas ? null : (
          <React.Fragment>
            {regimes.map((regime, index) => {
              return (
                <Paper key={index} className={classes.paper}>
                  <Typography variant="h5" className={classes.orbit}>
                    {regime}
                  </Typography>
                  <Grid container>
                    {sats.map((sat, index) => {
                      if (sat.orbits) {
                        if (sat.orbits[0].orbit === regime) return gridItem(sat, index);
                      } else if (regime === "Undetermined" && !sat.orbit) {
                        return gridItem(sat, index);
                      }
                    })}
                  </Grid>
                </Paper>
              );
            })}
          </React.Fragment>
        )}
      </span>
    </Grid>
  );
};
