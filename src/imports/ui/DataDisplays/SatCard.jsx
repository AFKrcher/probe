import React, { useState } from "react";
// Imports
import { useHistory } from "react-router";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import VisualizeDialog from "../Dialogs/VisualizeDialog";
import { getSatID, getSatName, getSatDesc } from "../utils/satelliteDataFuncs";
import { Gallery } from "./Gallery";

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
  Tooltip,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  satCard: {
    width: "100%",
    height: "100%",
    overflowWrap: "hidden",
    backgroundColor: theme.palette.grid.background,
  },
  satName: {
    marginBottom: 5,
  },
  cardImage: {
    width: "100%",
  },
  cardDesc: {
    minHeight: `340px`,
    maxHeight: `340px`,
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
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState();
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

  function handleModify(e, sat) {
    e.preventDefault();
    setShowModal(true);
  }

  function handleDashboard(e, id) {
    e.preventDefault();
    history.push(`/${id}`);
  }

  const handleVisualize = (e, url) => {
    e.preventDefault();
    setPrompt({
      title: (
        <div className={classes.modalHeader}>
          <Tooltip title="Click to open Space Cockpit in a new tab" placement="right" arrow>
            <Typography
              onClick={() => window.open(url, "_blank").focus()}
              style={{ cursor: "pointer" }}
            >
              Visualizing <strong>{satellite.names[0].name}</strong> in Space
              Cockpit by Saber Astronautics
            </Typography>
          </Tooltip>
          <IconButton
            size="small"
            className={classes.modalButton}
            id="exitVisualize"
            onClick={() => {
              setPrompt(null);
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
        />
      ),
      actions: "",
    });
  };

  return (
    <React.Fragment>
      <VisualizeDialog bodyPrompt={prompt} open={prompt ? true : false} />
      <SatelliteModal
        show={showModal}
        initValues={satellite}
        newSat={false}
        handleClose={() => {
          setShowModal(false);
        }}
        width={width}
        height={height}
      />
      <Card className={classes.satCard} elevation={4} raised={true}>
        <CardMedia className={classes.cardImage}>
          <Gallery initValues={satellite} autoplay={false} width={width} />
        </CardMedia>
        <CardContent className={classes.cardDesc}>
          <Typography
            variant={width > 1000 ? "h5" : width > 350 ? "h6" : "body1"}
            className={classes.satName}
          >
            <strong>{getSatName(satellite)}</strong>
          </Typography>
          <Typography
            gutterBottom
            variant={width > 1000 ? "body1" : width > 350 ? "body2" : "caption"}
          >
            COSPAR ID:{" "}
            {satellite.cosparID ? satellite.cosparID[0].cosparID : "N/A"}
          </Typography>
          <Typography
            gutterBottom
            variant={width > 1000 ? "body1" : width > 350 ? "body2" : "caption"}
          >
            NORAD ID: {getSatID(satellite)}
          </Typography>
          <Typography
            color="textSecondary"
            variant={width > 1000 ? "body1" : width > 350 ? "body2" : "caption"}
          >
            {getSatDesc(satellite)}
          </Typography>
        </CardContent>
        <CardActions
          className={classes.cardActions}
          style={
            width < 1250
              ? { justifyContent: "space-around" }
              : { justifyContent: "space-between" }
          }
        >
          {width < 1250 ? (
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
                    handleDashboard(e, satellite.noradID);
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
                onClick={(e) => handleDashboard(e, satellite.noradID)}
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
    </React.Fragment>
  );
};
