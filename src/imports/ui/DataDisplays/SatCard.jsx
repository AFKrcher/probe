import React, { useState, useContext } from "react";
// Imports
import { useHistory } from "react-router";
import HelpersContext from "../Dialogs/HelpersContext.jsx";

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
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DashboardIcon from "@material-ui/icons/Dashboard";

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
    marginBottom: "3%",
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
  iconButton: {
    fontSize: 25,
  },
  optionsButton: {
    fontSize: 15,
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
  const classes = useStyles();

  const history = useHistory();

  const { setOpenVisualize } = useContext(HelpersContext);

  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleModify(e) {
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
      url: url,
      satellite: satellite,
    });
    setOpenVisualize(true);
  };

  return (
    <React.Fragment>
      <VisualizeDialog body={prompt} />
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
            width < 1000
              ? { justifyContent: "space-around" }
              : {
                  justifyContent: "space-between",
                  marginLeft: 5,
                  marginRight: 5,
                }
          }
        >
          {width < 400 ? (
            <React.Fragment>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClick}
                className={classes.cardButton}
              >
                <strong className={classes.optionButton}>Options</strong>
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
                    handleModify(e, satellite);
                    handleClose(e);
                  }}
                >
                  <VisibilityIcon className={classes.iconButton} />
                </MenuItem>
                <MenuItem
                  dense
                  onClick={(e) => {
                    handleDashboard(e, satellite.noradID);
                    handleClose(e);
                  }}
                >
                  <DashboardIcon className={classes.iconButton} />
                </MenuItem>
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
                  <img
                    src="/assets/saberastro.png"
                    width="27.5px"
                    height="27.5px"
                  />
                </MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Tooltip title="Satellite Data View" arrow placement="top">
                <Button
                  size="medium"
                  variant="outlined"
                  className={classes.cardButton}
                  onClick={(e) => handleModify(e, satellite)}
                >
                  <VisibilityIcon className={classes.iconButton} />
                </Button>
              </Tooltip>
              <Tooltip title="Satellite Dashboard View" arrow placement="top">
                <Button
                  size="medium"
                  variant="outlined"
                  className={classes.cardButton}
                  onClick={(e) => handleDashboard(e, satellite.noradID)}
                >
                  <DashboardIcon className={classes.iconButton} />
                </Button>
              </Tooltip>
              <Tooltip
                title="Visualize satellite in Space Cockpit"
                arrow
                placement="top"
              >
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
                  <img src="/assets/saberastro.png" width="27.5px" />
                </Button>
              </Tooltip>
            </React.Fragment>
          )}
        </CardActions>
      </Card>
    </React.Fragment>
  );
};
