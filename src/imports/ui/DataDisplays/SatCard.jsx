import React, { useState } from "react";
import Clamp from "react-multiline-clamp";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import VisualizeDialog from "../helpers/VisualizeDialog";
import {
  getSatID,
  getSatName,
  getSatDesc,
  getSatImage,
} from "../utils/satelliteDataFuncs";

// @material-ui
import {
  makeStyles,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Typography,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  satCard: {
    width: "100%",
    height: "100%",
    overflowWrap: "hidden",
    backgroundColor: theme.palette.grid.background,
  },
  cardImage: {
    minHeight: "180px",
    maxHeight: "180px",
  },
  cardDesc: {
    minHeight: `330px`,
    maxHeight: `330px`,
  },
  cardActions: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardButton: {
    border: "1px solid",
    filter: `drop-shadow(2px 2px 5px ${theme.palette.button.shadow})`,
  },
  iframe: {
    border: "none",
  },
  modalButton: {
    marginTop: -2.5,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "0px 5px -15px 5px",
  },
}));

export const SatCard = ({ width, height, satellite }) => {
  const [showModal, setShowModal] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [prompt, setPrompt] = useState({
    title: "", // dialog title
    text: "", // dialog body text
    actions: "", // dialog actions
  });

  const classes = useStyles();

  const adjustableFontSize =
    width < 500 ? (width < 400 ? "8px" : "10px") : "12px";

  function handleModify(e) {
    e.preventDefault();
    setShowModal(true);
  }

  function handleDashboard(e) {
    e.preventDefault();
    return alert(
      "Future Feature: Provide a prettier, full-page view for each satellite!"
    );
  }

  const handleVisualize = (e, url) => {
    e.preventDefault();
    setPrompt({
      title: (
        <div className={classes.modalHeader}>
          <Typography>
            Visualizing <strong>{satellite.names[0].name}</strong> in Space
            Cockpit by Saber Astronautics
          </Typography>
          <IconButton
            size="small"
            className={classes.modalButton}
            id="exitVisualize"
            onClick={() => {
              setOpenPrompt(false);
              setPrompt({
                title: "", //dialog title
                text: "", //dialog body text
                actions: "", //dialog actions
              });
            }}
          >
            <Close />
          </IconButton>
        </div>
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
      actions: "",
    });
    setOpenPrompt(true);
  };

  return (
    <>
      <VisualizeDialog bodyPrompt={prompt} open={openPrompt} />
      <SatelliteModal
        show={showModal}
        initValues={satellite}
        newSat={false}
        handleClose={() => setShowModal(false)}
      />
      <Card className={classes.satCard} elevation={4} raised={true}>
        <CardMedia
          className={classes.cardImage}
          image={getSatImage(satellite)}
          title="Satellite image"
        />
        <CardContent className={classes.cardDesc}>
          <Typography variant="h5" component="h2">
            <strong>{getSatName(satellite)}</strong>
          </Typography>
          <Typography gutterBottom variant="body1">
            NORAD ID: {getSatID(satellite)}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            <Clamp lines={Math.round(height / 100) + 1}>
              {getSatDesc(satellite)}
            </Clamp>
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            size={width < 500 ? "small" : "medium"}
            variant="outlined"
            className={classes.cardButton}
            onClick={(e) =>
              handleVisualize(
                e,
                `https://spacecockpit.saberastro.com/?SID=${satellite.noradID}&FS=${satellite.noradID}`
              )
            }
          >
            <strong
              style={{
                fontSize: adjustableFontSize,
              }}
            >
              Visualize
            </strong>
          </Button>
          <Button
            size={width < 500 ? "small" : "medium"}
            variant="outlined"
            className={classes.cardButton}
            onClick={(e) => handleDashboard(e, satellite)}
          >
            <strong
              style={{
                fontSize: adjustableFontSize,
              }}
            >
              Dashboard
            </strong>
          </Button>
          <Button
            size={width < 500 ? "small" : "medium"}
            variant="outlined"
            className={classes.cardButton}
            onClick={(e) => handleModify(e, satellite)}
          >
            <strong
              style={{
                fontSize: adjustableFontSize,
              }}
            >
              Data
            </strong>
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
