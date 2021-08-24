import React, { useState, useContext } from "react";
import Clamp from "react-multiline-clamp";

// Imports
import HelpersContext from "./helpers/HelpersContext.jsx";

// Components
import { SatelliteModal } from "./SatelliteModal/SatelliteModal";
import PromptDialog from "./helpers/PromptDialog";

// @material-ui
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
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  satCard: {
    width: "100%",
  },
  image: {
    minHeight: "180px",
    maxHeight: "180px",
  },
  description: {
    minHeight: "150px",
    maxHeight: "150px",
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

  const handleVisualize = async (e, url) => {
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
          style={{ border: "none" }}
        />
      ),
      actions: (
        <Button
          variant="contained"
          color="default"
          size="small"
          style={{ marginBottom: 5 }}
          onClick={() => setOpenPrompt(false)}
        >
          <Close />
          Close
        </Button>
      ),
    });
    await setOpenPrompt(true);
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
          <Button
            size="small"
            onClick={(e) =>
              handleVisualize(
                e,
                `https://spacecockpit.saberastro.com/?SID=${satellite.noradID}&FS=${satellite.noradID}`
              )
            }
          >
            Visualize
          </Button>
          <Button size="small" onClick={(e) => handleViewMore(e, satellite)}>
            View more
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
