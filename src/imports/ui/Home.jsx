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
  Divider,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import InfiniteScrollIcon from "@material-ui/icons/BurstMode";
import InfiniteScrollOutlinedIcon from "@material-ui/icons/BurstModeOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DashboardIcon from "@material-ui/icons/Dashboard";
import VerifiedIcon from "@material-ui/icons/CheckBox";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheck";
import ReportIcon from "@material-ui/icons/Report";
import ErrorIcon from "@material-ui/icons/Warning";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import ErrorOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

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
  showKey: {
    marginTop: 15,
    color: theme.palette.text.disabled,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.info.light,
    },
    width: "10ch",
  },
  key: {
    marginBottom: 20,
    marginTop: 15,
    display: "flex",
  },
  keyItems: {
    marginRight: "0.5ch",
  },
  keyItemsValid: {
    marginRight: "0.5ch",
    fill: theme.palette.success.light,
  },
  keyItemsPartial: {
    marginRight: "0.5ch",
    fill: theme.palette.warning.light,
  },
  keyItemsInvalid: {
    marginRight: "0.5ch",
    fill: theme.palette.error.light,
  },
  showcase: {
    marginTop: 20,
  },
  secondaryShowcase: {
    marginTop: 20,
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

  const [width, height] = useWindowSize();
  const [page, setPage] = useState(1);
  const [limiter] = useState(3);
  const [scrolled, setScrolled] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(true);
  const [showKey, setShowKey] = useState(false);

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
          information.
        </Typography>
        <Typography variant="subtitle1">
          100% Open Source, 100% Machine Readable.{" "}
        </Typography>
        <Typography
          variant="body2"
          className={classes.showKey}
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? "Hide Key..." : "Show Key..."}
        </Typography>

        {showKey && (
          <React.Fragment>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <VisibilityIcon fontSize="small" className={classes.keyItems} />
              <span className={classes.keyItems}>–</span>
              Open a satellite to view and/or modify the fields or schemas
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <DashboardIcon fontSize="small" className={classes.keyItems} />
              <span className={classes.keyItems}>–</span>
              Open the satellite dashboard - allows users to view satellite data
              outside of an editing modal and provide users with a shareable URL
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <img
                src="/assets/saberastro.png"
                width="21px"
                height="21px"
                className={classes.keyItems}
              />
              <span className={classes.keyItems}>–</span> Open a satellite to
              view and/or modify its schemas or entries
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <VerifiedIcon
                fontSize="small"
                className={classes.keyItemsValid}
              />
              <ValidatedIcon
                fontSize="small"
                className={classes.keyItemsValid}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has been verified to be in the reference or validated
              across multiple sources by user(s) AND web-crawling algorithm(s)
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <ReportIcon
                fontSize="small"
                className={classes.keyItemsPartial}
              />
              <ReportOutlinedIcon
                fontSize="small"
                className={classes.keyItemsPartial}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has ONLY been verified to be in the reference or
              validated across multiple sources by user(s) OR web-crawling
              algorithm(s)
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <ErrorIcon fontSize="small" className={classes.keyItemsInvalid} />
              <ErrorOutlinedIcon
                fontSize="small"
                className={classes.keyItemsInvalid}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has NOT been verified to be in the reference or
              validated across multiple sources by user(s) OR web-crawling
              algorithm(s)
            </Typography>
          </React.Fragment>
        )}
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
            )}
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
          {showLoadMore() ? (
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
                  onClick={() => setPage(page + 1)}
                >
                  {width > 300 ? "Load More Satellites" : "Load More"}
                </Typography>
              </Grid>
              <Grid item xs={width > 800 ? 5 : 3}>
                <Divider />
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              alignItems="center"
              className={classes.loadMoreContainer}
            >
              <Grid item xs={width > 800 ? 5 : 4}>
                <Divider />
              </Grid>
              <Grid
                item
                xs={width > 800 ? 2 : 4}
                container
                justifyContent="center"
              >
                <Typography
                  variant={width > 1000 ? "body1" : "caption"}
                  className={classes.loadMore}
                >
                  {width > 300 ? "No More Satellites" : "No More"}
                </Typography>
              </Grid>
              <Grid item xs={width > 800 ? 5 : 4}>
                <Divider />
              </Grid>
            </Grid>
          )}
        </div>
      </Container>
    </div>
  );
};
