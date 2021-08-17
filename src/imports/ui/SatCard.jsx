import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {
  getSatID,
  getSatName,
  getSatDesc,
  getSatImage,
} from "./util/satelliteDataFuncs";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Clamp from "react-multiline-clamp";

import { SatelliteModal } from "./SatelliteModal/SatelliteModal";

const useStyles = makeStyles((theme) => ({
  satCard: {
    width: "100%",
  },
  image: {
    minHeight: "170px",
    maxHeight: "170px",
  },
  description: {
    minHeight: "150px",
    maxHeight: "150px",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export const SatCard = ({ satellite }) => {
  const [showModal, setShowModal] = useState(false);
  const classes = useStyles();

  function handleViewMore(e, satellite) {
    e.preventDefault();
    setShowModal(true);
  }

  return (
    <>
      <SatelliteModal
        show={showModal}
        initValues={satellite}
        newSat={false}
        handleClose={() => setShowModal(false)}
      />
      <Card className={classes.satCard}>
        <CardMedia
          className={classes.image}
          image={getSatImage(satellite)}
          title="Satellite image"
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {getSatName(satellite)}
          </Typography>
          <Typography gutterBottom variant="button" component="p">
            {getSatID(satellite)}
          </Typography>
          <Typography
            className={classes.description}
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.description}
          >
            <Clamp lines={7}>{getSatDesc(satellite)}</Clamp>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">
            <a
              href={`https://spacecockpit.saberastro.com/?SID=${satellite.noradID}&FS=${satellite.noradID}`}
              target="_blank"
              rel="noreferrer"
              className={classes.link}
            >
              Visualize
            </a>
          </Button>
          <Button size="small" onClick={(e) => handleViewMore(e, satellite)}>
            View more
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
