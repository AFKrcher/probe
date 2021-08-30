import React, { useState } from "react";
import Clamp from "react-multiline-clamp";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import PromptDialog from "../helpers/PromptDialog";
import {
  getSatID,
  getSatName,
  getSatDesc,
  getSatImage,
} from "../utils/satelliteDataFuncs";

// @material-ui
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Close from "@material-ui/icons/Close";

const cardHeight = 30

const useStyles = makeStyles((theme) => ({
  satCard: {
    width: "100%",
    height: "100%",
    overflowWrap: "hidden",
  },
  image: {
    minHeight: "180px",
    maxHeight: "180px",
  },
  description: {
    minHeight: `${cardHeight}vh`,
    maxHeight: `${cardHeight}vh`,
  },
  cardButtons: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
  },
  iframe: {
    border: "none"
  },
  modalButton: {
    marginBottom: 5
  },
}));

export const SatCard = ({ satellite }) => {
  const [showModal, setShowModal] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [prompt, setPrompt] = useState({
    title: "", //dialog title
    text: "", //dialog body text
    actions: "", //dialog actions
  });

  const classes = useStyles();

  function handleViewMore(e) {
    e.preventDefault();
    setShowModal(true);
  }

  const handleVisualize = (e, url) => {
    e.preventDefault();
    setPrompt({
      title: (
        <Typography>
          Visualizing{" "}
          <strong>{satellite.names[0].names || satellite.names[0].name}</strong>{" "}
          in Space Cockpit by Saber Astronautics
        </Typography>
      ),
      text: (
        <iframe
          src={url}
          height="99%"
          width="100%"
          title="SpaceCockpit"
          className={classes.iframe}
        />
      ),
      actions: (
        <Button
          variant="contained"
          color="default"
          size="small"
          className={classes.modalButton}
          onClick={() => setOpenPrompt(false)}
        >
          <Close />
          Close
        </Button>
      ),
    });
    setOpenPrompt(true);
  };

  return (
    <>
      <PromptDialog bodyPrompt={prompt} open={openPrompt} />
      <SatelliteModal
        show={showModal}
        initValues={satellite}
        newSat={false}
        handleClose={() => setShowModal(false)}
      />
      <Card className={classes.satCard} variant="outlined">
        <CardMedia
          className={classes.image}
          image={getSatImage(satellite)}
          title="Satellite image"
        />
        <CardContent className={classes.description}>
          <Typography variant="h5" component="h2">
            <strong>{getSatName(satellite)}</strong>
          </Typography>
          <Typography gutterBottom variant="body1">
            NORAD ID: {getSatID(satellite)}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            <Clamp lines={cardHeight / 4}>{getSatDesc(satellite)}</Clamp>
          </Typography>
        </CardContent>
        <CardActions className={classes.cardButtons}>
          <Button
            size="medium"
            variant="outlined" 
            onClick={(e) =>
              handleVisualize(
                e,
                `https://spacecockpit.saberastro.com/?SID=${satellite.noradID}&FS=${satellite.noradID}`
              )
            }
          >
            <strong>Visualize</strong>
          </Button>
          <Button size="medium" variant="outlined" onClick={(e) => handleViewMore(e, satellite)}>
            <strong>Details</strong>
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
