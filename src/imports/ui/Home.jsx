import React from "react";
// Imports
import useWindowSize from "./utils/useWindowSize.jsx"

// Components
import { SatCard } from "./Dashboards/SatCard.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../api/satellites";

// @material-ui
import { Container, Grid, Typography, makeStyles, CircularProgress } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginTop: 10
  },
  showcase: {
    marginTop: 30,
  },
  spinner: {
    color: theme.palette.text.primary,
  },
}));

export const Home = () => {
  const classes = useStyles();

  const [width, height] = useWindowSize();
  
  const [demoSats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find({}, { limit: Math.round(width / 200) > 8 ? 8 : Math.round(width / 200)}).fetch();
    return [sats,!sub.ready()];
  });
  
  const skeletonHeight = Math.round(height / 1.75);
  const space = Math.round(height / (width / 6))
  
  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h3">
          Welcome to <strong>OpenOrbit!</strong>
        </Typography>
        <Typography variant="body1" className={classes.description}>
          OpenOrbit is seeking to become the world's most complete and easy to
          use resource for spacecraft data and information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.
        </Typography>
      </Container>
      <Container className={classes.showcase}>
        <Typography variant="h4" gutterBottom>
          Satellite Data Cards
        </Typography>
        {space ? 
          (<Grid container justifyContent="space-around" spacing={space}>
            {!isLoading &&
              demoSats.map((sat, index) => (
                <Grid item xs={space} key={index}>
                  <SatCard satellite={sat} key={index}/>
                </Grid>
              ))}
            {isLoading && (
              <React.Fragment>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
                <Grid item xs={space}>
                  <Skeleton variant="rect" height={skeletonHeight} />
                </Grid>
              </React.Fragment>
            )}
          </Grid>)
          :
          (<CircularProgress className={classes.spinner} />)
        }
      </Container>
    </div>
  );
};
