import React, { useState } from "react";
// Imports
import Clamp from "react-multiline-clamp";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import VisualizeDialog from "../Dialogs/VisualizeDialog";
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
  Menu,
  MenuItem,
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
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  const adjustableFontSize = (width) => {
    switch (width) {
      case width < 900:
        return 16;
      default:
        return 12;
    }
  };

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
        width={width}
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
        <CardActions
          className={classes.cardActions}
          style={
            width < 500
              ? { justifyContent: "space-around" }
              : { justifyContent: "space-between" }
          }
        >
          {width < 900 ? (
            <React.Fragment>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClick}
                className={classes.cardButton}
              >
                <strong
                  style={{
                    fontSize: adjustableFontSize(width),
                  }}
                >
                  Options
                </strong>
              </Button>
              <Menu
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  dense
                  onClick={(e) => {
                    handleVisualize(
                      e,
                      `https://spacecockpit.saberastro.com/?SID=${satellite.noradID}&FS=${satellite.noradID}`
                    );
                    handleClose(e);
                  }}
                >
                  Visualize
                </MenuItem>
                <MenuItem
                  dense
                  onClick={(e) => {
                    handleDashboard(e, satellite);
                    handleClose(e);
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  dense
                  onClick={(e) => {
                    handleModify(e, satellite);
                    handleClose(e);
                  }}
                >
                  Data
                </MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                size="medium"
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
                    fontSize: adjustableFontSize(width),
                  }}
                >
                  Visualize
                </strong>
              </Button>
              <Button
                size="medium"
                variant="outlined"
                className={classes.cardButton}
                onClick={(e) => handleDashboard(e, satellite)}
              >
                <strong
                  style={{
                    fontSize: adjustableFontSize(width),
                  }}
                >
                  Dashboard
                </strong>
              </Button>
              <Button
                size="medium"
                variant="outlined"
                className={classes.cardButton}
                onClick={(e) => handleModify(e, satellite)}
              >
                <strong
                  style={{
                    fontSize: adjustableFontSize(width),
                  }}
                >
                  Data
                </strong>
              </Button>{" "}
            </React.Fragment>
          )}
        </CardActions>
      </Card>
    </>
  );
};
