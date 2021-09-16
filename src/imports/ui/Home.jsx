import React from "react";
// Imports
import useWindowSize from "./Hooks/useWindowSize.jsx";

// Components
import { SatCard } from "./DataDisplays/SatCard.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../api/satellites";

// @material-ui
import {
  Container,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginTop: 10,
  },
  showcase: {
    marginTop: 30,
  },
  card: {
    marginTop: -10,
  },
  skeleton: {
    borderRadius: 5,
  },
  spinner: {
    color: theme.palette.text.primary,
  },
}));

export const Home = () => {
  const classes = useStyles();
  const [width, height] = useWindowSize();

  const numberOfSkeletons =
    Math.round(width / 200) > 9 || Math.round(width / 200) <= 3
      ? 9
      : Math.round(width / 200);

  const cardSpace =
    Math.round(height / (width / 5)) > 10
      ? 10
      : Math.round(height / (width / 5));

  const [sats, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find(
      {},
      { limit: numberOfSkeletons }
    ).fetch();
    return [sats, !sub.ready()];
  });

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h3">
          Welcome to <strong>PROBE</strong>!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          <strong>P</strong>ublicly <strong>R</strong>esearched{" "}
          <strong>OB</strong>s<strong>E</strong>rvatory (PROBE) is seeking to
          become the world's most complete and easy to use resource for
          satellite data and information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.
        </Typography>
      </Container>
      <Container className={classes.showcase}>
        <Typography variant="h4" gutterBottom>
          Satellite Data Cards
        </Typography>
        {cardSpace ? (
          <Grid
            container
            justifyContent="space-around"
            spacing={cardSpace}
            className={classes.card}
          >
            {!isLoading
              ? sats.map((sat, index) => (
                  <Grid item xs={cardSpace} key={index}>
                    <SatCard
                      satellite={sat}
                      width={width}
                      height={height}
                      id={`SatCard-${index}`}
                    />
                  </Grid>
                ))
              : [...Array(numberOfSkeletons)].map((_, index) => (
                  <Grid item xs={cardSpace} key={index}>
                    <Skeleton variant="rect" className={classes.skeleton}>
                      <SatCard
                        satellite={{
                          noradID: "skeleton",
                          names: [
                            {
                              reference: "skeleton",
                              name: "skeleton",
                            },
                          ],
                          descriptionShort: [
                            {
                              reference: "skeleton",
                              descriptionShort: "skeleton",
                            }
                          ]
                        }}
                        width={width}
                        height={height}
                      />
                    </Skeleton>
                  </Grid>
                ))}
          </Grid>
        ) : (
          <CircularProgress className={classes.spinner} />
        )}
      </Container>
    </div>
  );
};
