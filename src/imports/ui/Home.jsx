import React, { useState, useEffect } from "react";
// Imports
import useWindowSize from "./Hooks/useWindowSize.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router";

// Components
import { SatCard } from "./DataDisplays/SatCard.jsx";
import { SatelliteCollection } from "../api/satellites";
import { Key } from "./Helpers/Key.jsx";
import { Mini } from "./DataDisplays/Mini.jsx";

// @material-ui
import {
  Button,
  IconButton,
  Container,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
  Tooltip,
  Divider,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import InfiniteScrollIcon from "@material-ui/icons/BurstMode";
import InfiniteScrollOutlinedIcon from "@material-ui/icons/BurstModeOutlined";
import ZoomOut from "@material-ui/icons/ZoomOut";
import ZoomIn from "@material-ui/icons/ZoomIn";

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
  miniDescription: {
    marginBottom: 10,
  },
  showcaseHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  miniButton: {
    marginBottom: 25,
  },
  showcase: {
    marginTop: 20,
  },
  secondaryShowcase: {
    marginTop: 30,
  },
  card: {
    marginTop: -10,
  },
  skeleton: {
    borderRadius: 5,
    marginBottom: 15,
  },
  skeletonMiniButton: {
    borderRadius: 5,
    marginBottom: 25,
  },
  spinner: {
    color: theme.palette.text.primary,
  },
  scrollUp: {
    color: theme.palette.tertiary.main,
    position: "fixed",
    bottom: 10,
    right: 10,
    zIndex: 20,
  },
  toggleInfinite: {
    color: theme.palette.tertiary.main,
    position: "fixed",
    bottom: 60,
    right: 10,
  },
  loadMoreContainer: {
    marginTop: 40,
    marginBottom: -25,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
  },
  loadMore: {
    cursor: "pointer",
    color: theme.palette.text.disabled,
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
}));

export const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const [width, height] = useWindowSize();
  const [page, setPage] = useState(1);
  const [limiter] = useState(3);
  const [scrolled, setScrolled] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(true);
  const [mini, setMini] = useState(false);

  const count = SatelliteCollection.find().count();

  const minimize = () => {
    mini ? setMini(false) : setMini(true);
  };

  const miniButton = () => {
    return (
      <Button
        variant="contained"
        size="small"
        startIcon={mini ? <ZoomIn /> : <ZoomOut />}
        onClick={minimize}
        className={classes.miniButton}
      >
        {mini ? "Maximize View" : "Minimize View"}
      </Button>
    );
  };

  const cardSpace = () => {
    if (height && width) {
      if (Math.round(height / (width / 5)) > 10) {
        return 10;
      } else if (width > 1000) {
        return 4;
      } else {
        return Math.round(height / (width / 5));
      }
    } else {
      return 5;
    }
  };

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
        ? // If user is logged in and has favorites
          SatelliteCollection.find({
            noradID: { $in: favorites },
          })
            .fetch()
            .filter((sat) => !sat.isDeleted)
        : otherSats;
    return [sats, otherSats, !sub.ready(), favorites, user];
  });

  window.onscroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      infiniteMode
    ) {
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

  const showLoadMore = () => {
    if (
      otherSats.length !==
      SatelliteCollection.find({ isDeleted: false }).count()
    ) {
      return true;
    } else {
      return false;
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
          <React.Fragment>
            <Tooltip title="Scroll back to top" placement="left" arrow>
              <IconButton className={classes.scrollUp} onClick={handleScrollUp}>
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle infinite scroll" placement="left" arrow>
              <IconButton
                className={classes.toggleInfinite}
                onClick={() => setInfiniteMode(!infiniteMode)}
              >
                {infiniteMode ? (
                  <InfiniteScrollIcon />
                ) : (
                  <InfiniteScrollOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ) : null}
        <Typography variant="h3">
          Welcome to <strong className={classes.title}>PROBE</strong>!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          <strong>P</strong>ublicly <strong>R</strong>esearched{" "}
          <strong>O</strong>bservatory (PROBE) is seeking to become the world's
          most complete and easy to use resource for satellite data and
          information. 100% Open Source, 100% Machine Readable.
        </Typography>
        <Key page="Home" />
      </Container>
      {/* Minified view of all satellite cards */}
      <Container className={classes.showcase}>
        {mini ? (
          <React.Fragment>
            <span className={classes.showcaseHeader}>
              {miniButton()}
              <Typography variant="h4" gutterBottom>
                All Satellites
              </Typography>
              <Typography variant="body1" className={classes.miniDescription}>
                Satellites are listed by NORAD ID and organized by orbit
              </Typography>
            </span>
            <Mini />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* Primary showcase for logged-in users with favorites */}
            {Meteor.userId() && favorites?.length > 0 && (
              <React.Fragment>
                <span className={classes.showcaseHeader}>
                  {miniButton()}
                  <Typography variant="h4" gutterBottom>
                    {favorites?.length > 0 ? (
                      <React.Fragment>
                        <strong>{user}</strong>'s Favorite Satellites
                      </React.Fragment>
                    ) : (
                      <div style={{ marginBottom: -40 }}></div>
                    )}
                  </Typography>
                </span>
                <Grid
                  container
                  justifyContent={width > 650 ? "flex-start" : "center"}
                  spacing={cardSpace()}
                  className={classes.card}
                >
                  {!isLoading
                    ? sats.map((sat, index) => (
                        <Grid item xs={cardSpace()} key={index}>
                          <SatCard
                            satellite={sat}
                            width={width}
                            height={height}
                            id={`SatCard-${index}`}
                          />
                        </Grid>
                      ))
                    : [...Array(limiter)].map((_, index) => (
                        <Grid item xs={cardSpace()} key={index}>
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
              </React.Fragment>
            )}

            {/* Secondary showcase for the rest of the satellites and/or not-logged in users */}
            <div className={classes.secondaryShowcase}>
              {isLoading ? (
                <span className={classes.showcaseHeader}>
                  <Skeleton
                    variant="rect"
                    className={classes.skeletonMiniButton}
                  >
                    {miniButton()}
                  </Skeleton>
                  <Skeleton variant="rect" className={classes.skeleton}>
                    <Typography variant="h4" gutterBottom>
                      Admin's Favorite Satellites
                    </Typography>
                  </Skeleton>
                </span>
              ) : (
                <span className={classes.showcaseHeader}>
                  <Typography variant="h4" gutterBottom>
                    Satellite Data Cards
                  </Typography>
                  {!Meteor.userId() && !favorites?.length > 0 && miniButton()}
                </span>
              )}
              <Grid
                container
                justifyContent={width > 650 ? "flex-start" : "center"}
                spacing={cardSpace()}
                className={classes.card}
              >
                {!isLoading
                  ? otherSats.map((sat, index) => (
                      <Grid item xs={cardSpace()} key={index}>
                        <SatCard
                          satellite={sat}
                          width={width}
                          height={height}
                          id={`SatCard-${index}`}
                        />
                      </Grid>
                    ))
                  : [...Array(limiter)].map((_, index) => (
                      <Grid item xs={cardSpace()} key={index}>
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

              {/* Load More Button */}
              <Grid
                container
                alignItems="center"
                className={classes.loadMoreContainer}
              >
                <Grid item xs={width > 800 ? 5 : 3}>
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={width > 800 ? 2 : 6}
                  container
                  justifyContent="center"
                >
                  <Typography
                    variant={width > 1000 ? "body1" : "caption"}
                    className={classes.loadMore}
                    onClick={() => {
                      if (showLoadMore()) setPage(page + 1);
                    }}
                  >
                    {width > 300
                      ? `${showLoadMore() ? "Load" : "No"} More Satellites`
                      : `${showLoadMore() ? "Load" : "No"} More`}
                  </Typography>
                </Grid>
                <Grid item xs={width > 800 ? 5 : 4}>
                  <Divider />
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        )}
      </Container>
    </div>
  );
};
