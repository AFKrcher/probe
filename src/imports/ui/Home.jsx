import React from "react";

// Components
import { SatCard } from "./SatCard.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../api/satellite";

// @material-ui
import {
  Container,
  TextField,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  jumbo: {
    marginTop: 40,
  },
  showcase: {
    marginTop: 30,
    marginBottom: 70,
  },
}));

const skeletonHeight = 420;

export const Home = () => {
  const classes = useStyles();

  const [demoSats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find({}, { limit: 9 }).fetch();
    return [sats, !sub.ready()];
  });

  return (
    <React.Fragment>
      <Container className={classes.jumbo} maxWidth="md">
        <Typography variant="h3">
          Welcome to <strong>Open Orbit!</strong>
        </Typography>
        <Typography variant="body1" style={{ marginTop: 10 }}>
          Open Orbit is seeking to become the world's most complete and easy to
          use resource for spacecraft data and information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.
        </Typography>
      </Container>
      <Container className={classes.showcase} maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Satellite Data Cards
        </Typography>
        <Grid container justify="flex-start" spacing={2}>
          {!isLoading &&
            demoSats.map((sat, index) => (
              <Grid item xs={4} key={index}>
                <SatCard satellite={sat} key={index} />
              </Grid>
            ))}
          {isLoading && (
            <React.Fragment>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={4}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
