import React from "react";

// Components
import { SatCard } from "./DataDisplays/SatCard.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../api/satellites";

// @material-ui
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  showcase: {
    marginTop: 30,
  },
}));

const skeletonHeight = 420;
const spacing = 3

export const Home = () => {
  const classes = useStyles();

  const [demoSats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find({}, { limit: 9 }).fetch();
    return [sats, !sub.ready()];
  });

  return (
    <>
      <Container>
        <Typography variant="h3">
          Welcome to <strong>OpenOrbit!</strong>
        </Typography>
        <Typography variant="body1" style={{ marginTop: 10 }}>
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
        <Grid container justifyContent="flex-start" spacing={3}>
          {!isLoading &&
            demoSats.map((sat, index) => (
              <Grid item xs={spacing} key={index}>
                <SatCard satellite={sat} key={index}/>
              </Grid>
            ))}
          {isLoading && (
            <React.Fragment>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
              <Grid item xs={spacing}>
                <Skeleton variant="rect" height={skeletonHeight} />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Container>
    </>
  );
};
