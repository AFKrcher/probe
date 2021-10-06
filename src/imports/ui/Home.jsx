import React, { useState, useEffect } from "react";
// Imports
import useWindowSize from "./Hooks/useWindowSize.jsx";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { SatCard } from "./DataDisplays/SatCard.jsx";
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
  title: {
    color: theme.palette.tertiary.main,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
  },
  description: {
    marginTop: 10,
  },
  showcase: {
    marginTop: 30,
  },
  secondaryShowcase: {
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
    bottom: 10,
    right: 10,
  },
}));

export const Home = () => {
  const classes = useStyles();

  const [width, height] = useWindowSize();
  const [page, setPage] = useState(1);
  const [limiter] = useState(3);
  const [scrolled, setScrolled] = useState(false);

  const count = SatelliteCollection.find().count();

  const cardSpace =
    Math.round(height / (width / 5)) > 10
      ? 10
      : width > 1000
      ? 4
      : Math.round(height / (width / 5));

  const [sats, otherSats, isLoading, favorites, user] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const user = Meteor.user()?.username;
    const favorites = Meteor.user()?.favorites;
    const otherSats = SatelliteCollection.find(
      {},
      {
        limit: limiter * page,
      }
    )
      .fetch()
      .filter((sat) => !sat.isDeleted);
    const sats =
      Meteor.userId() && favorites
        ? // If user is logged in
          SatelliteCollection.find({
            noradID: { $in: favorites },
          })
            .fetch()
            .filter((sat) => !sat.isDeleted)
        : otherSats;
    return [sats, otherSats, !sub.ready(), favorites, user];
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={classes.root}>
      <Container>
        {scrolled ? (
          <Tooltip title="Scroll back to top" placement="top-end" arrow>
            <IconButton className={classes.scrollUp} onClick={handleScrollUp}>
              <ArrowUpwardIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Typography variant="h3">
          Welcome to <strong className={classes.title}>PROBE</strong>!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          <strong>P</strong>ublicly <strong>R</strong>esearched{" "}
          <strong>O</strong>bservatory (PROBE) is seeking to become the world's
          most complete and easy to use resource for satellite data and
          information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.
        </Typography>
      </Container>

      <Container className={classes.showcase}>
        {Meteor.userId() && favorites?.length > 0 ? (
          <React.Fragment>
            {isLoading ? (
              <Skeleton variant="rect" className={classes.skeleton}>
                <Typography variant="h3" gutterBottom>
                  Satellite Data Cards
                </Typography>
              </Skeleton>
            ) : (
              <Typography variant="h4" gutterBottom>
                {favorites?.length > 0 ? (
                  <React.Fragment>
                    <strong>{user}</strong>'s Favorite Satellites
                  </React.Fragment>
                ) : (
                  <div style={{ marginBottom: -40 }}></div>
                )}
              </Typography>
            )}
            {cardSpace ? (
              <Grid
                container
                justifyContent={width > 1000 ? "flex-start" : "center"}
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
                          <SatCard
                            satellite={{}}
                            width={width}
                            height={height}
                          />
                        </Skeleton>
                      </Grid>
                    ))}
                <br />
              </Grid>
            ) : (
              <CircularProgress className={classes.spinner} />
            )}{" "}
          </React.Fragment>
        ) : null}

        <div className={classes.secondaryShowcase}>
          {isLoading ? (
            <Skeleton variant="rect" className={classes.skeleton}>
              <Typography variant="h3" gutterBottom>
                Satellite Data Cards
              </Typography>
            </Skeleton>
          ) : (
            <Typography variant="h4" gutterBottom>
              {favorites?.length > 1
                ? "All Satellites"
                : "Satellite Data Cards"}
            </Typography>
          )}
          {cardSpace ? (
            <Grid
              container
              justifyContent={width > 900 ? "flex-start" : "center"}
              spacing={cardSpace}
              className={classes.card}
            >
              {!isLoading
                ? otherSats.map((sat, index) => (
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
        </div>
      </Container>
    </div>
  );
};
