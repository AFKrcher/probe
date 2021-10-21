import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import useWindowSize from "./Hooks/useWindowSize.jsx";
import { useTracker } from "meteor/react-meteor-data";

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
  probe: {
    color: theme.palette.tertiary.main,
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
  },
  keySpacingIfNoFavorites: {
    marginBottom: -15,
  },
  description: {
    marginTop: 10,
    marginBottom: 15,
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
    marginBottom: 20,
  },
  showcase: {
    marginTop: 15,
  },
  showcaseDivider: {
    marginBottom: 30,
  },
  secondaryShowcase: {
    marginTop: 40,
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

// breakpoints based on device width / height
const dividerBreak = 800;
const dividerTextBreak = 1000;
const cardFlexBreak = 600;

export const Home = () => {
  const classes = useStyles();

  const [width, height] = useWindowSize();
  const [page, setPage] = useState(1);
  const [limiter] = useState(3);
  const [scrolled, setScrolled] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);
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
        {mini ? "Satellite Cards View" : "Minimized Grid View"}
      </Button>
    );
  };

  const cardSpace = () => {
    if (width > 1000) return 4;
    if (width < 1000 && width > 750) return 5;
    if (width < 750 && width > cardFlexBreak) return 6;
    if (width < cardFlexBreak && width > 400) return 8;
    if (width < 400) return 10;
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
    switch (window.scrollY > 300) {
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
      <Container
        className={
          favorites?.length > 0 ? null : classes.keySpacingIfNoFavorites
        }
      >
        {scrolled && (
          <React.Fragment>
            <Tooltip title="Scroll back to top" placement="left" arrow>
              <IconButton className={classes.scrollUp} onClick={handleScrollUp}>
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
            {!mini && (
              <Tooltip
                title={
                  infiniteMode
                    ? "Turn off infinite scroll"
                    : "Turn on infinite scroll"
                }
                placement="left"
                arrow
              >
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
            )}
          </React.Fragment>
        )}
        <Typography variant="h3">
          Welcome to <strong className={classes.probe}>PROBE</strong>!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          <strong>P</strong>ublicly <strong>R</strong>esearched{" "}
          <strong>O</strong>bservatory (PROBE) is seeking to become the world's
          most complete and easy to use resource for satellite data and
          information. 100% Open Source, 100% Machine Readable.
        </Typography>
        <Key page="Home" mini={mini} />
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
                Satellites are listed by NORAD ID and organized by orbit.
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
                  justifyContent={
                    width > cardFlexBreak ? "flex-start" : "center"
                  }
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
              {favorites?.length > 0 && (
                <Grid item className={classes.showcaseDivider}>
                  <Divider />
                </Grid>
              )}
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
                  {!favorites?.length > 0 && miniButton()}
                  <Typography variant="h4" gutterBottom>
                    Satellite Data Cards
                  </Typography>
                </span>
              )}
              <Grid
                container
                justifyContent={width > cardFlexBreak ? "flex-start" : "center"}
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
                <Grid item xs={width > dividerBreak ? 5 : 3}>
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={width > dividerBreak ? 2 : 6}
                  container
                  justifyContent="center"
                >
                  <Typography
                    variant={width > dividerTextBreak ? "body1" : "caption"}
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
                <Grid item xs={width > dividerBreak ? 5 : 4}>
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
