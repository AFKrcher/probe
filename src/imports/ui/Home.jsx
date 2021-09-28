import React, { useState, useEffect } from "react";
// Imports
import useWindowSize from "./Hooks/useWindowSize.jsx";

// Components
import { SatCard } from "./DataDisplays/SatCard.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../api/satellites";

// @material-ui
import {
  IconButton,
  Container,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

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
  scrollUp: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
}));

export const Home = () => {
  const classes = useStyles();
  const [width, height] = useWindowSize();
  const [page, setPage] = useState(1);
  const [limiter] = useState(8);
  const [scrolled, setScrolled] = useState(false);

  const count = SatelliteCollection.find().count();

  const cardSpace =
    Math.round(height / (width / 5)) > 10
      ? 10
      : height < 1000 && width > 1000
      ? 3
      : Math.round(height / (width / 5));

  const [sats, isLoading, favorites, user] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const user = Meteor.user()?.username;
    const favorites = Meteor.user()?.favorites;
    const sats =
      Meteor.userId() && favorites
        ? // If user is logged in
          SatelliteCollection.find(
            {
              noradID: { $in: favorites },
            },
            {
              limit: limiter * page,
            }
          ).fetch()
        : // If NOT logged in
          SatelliteCollection.find(
            {},
            {
              limit: limiter * page,
            }
          ).fetch();
    return [sats, !sub.ready(), favorites, user];
  });

  useEffect(() => {}, [page]);

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      handleInfiniteScroll();
      setScrolled(true);
    }
    switch (window.scrollY > 200) {
      case true:
        setScrolled(true);
        break;
      default:
        setScrolled(false);
        break;
    }
  };

  const handleInfiniteScroll = (n = 1) => {
    if (limiter <= count + 4) {
      setPage(page + n);
    }
  };

  const handleScrollUp = (e) => {
    e.preventDefault();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  return (
    <div className={classes.root}>
      <Container>
        {scrolled ? (
          <Tooltip title="Scroll back to top" placement="top-end">
            <IconButton className={classes.scrollUp} onClick={handleScrollUp}>
              <ArrowUpwardIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Typography variant="h3">
          Welcome to <strong>PROBE</strong>!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          <strong>P</strong>ublicly <strong>R</strong>esearched{" "}
          <strong>O</strong>bservatory (PROBE) is seeking to become the
          world's most complete and easy to use resource for satellite data
          and information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.
        </Typography>
      </Container>
      <Container className={classes.showcase}>
        {isLoading ? (
          <Skeleton variant="rect" className={classes.skeleton}>
            <Typography variant="h3" gutterBottom>
              Satellite Data Cards
            </Typography>
          </Skeleton>
        ) : (
          <Typography variant="h4" gutterBottom>
            {favorites ? (
              <React.Fragment>
                <strong>{user.toUpperCase()}</strong>'s Favorite Satellites
              </React.Fragment>
            ) : (
              "Satellite Data Cards"
            )}
          </Typography>
        )}
        {cardSpace ? (
          <Grid
            container
            justifyContent="flex-start"
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
              : [...Array(limiter)].map((_, index) => (
                  <Grid item xs={cardSpace} key={index}>
                    <Skeleton variant="rect" className={classes.skeleton}>
                      <SatCard satellite={{}} width={width} height={height} />
                    </Skeleton>
                  </Grid>
                ))}
            <br />
          </Grid>
        ) : (
          <CircularProgress className={classes.spinner} />
        )}
      </Container>
    </div>
  );
};
