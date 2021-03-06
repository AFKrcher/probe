import React, { useState } from "react";
import PropTypes from "prop-types";
// imports
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getSatImages } from "../utils/satelliteDataFuncs.js";

// @material-ui
import { MobileStepper, Box, Button, makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: -5,
    maxWidth: 500,
    flexGrow: 1,
    overflow: "hidden",
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
    marginBottom: -10
  },
  imageContainer: {
    height: "40ch",
    width: "100%",
    display: "block",
    objectFit: "cover",
    backgroundColor: "lightGray"
  },
  rootModal: {
    marginTop: -5,
    maxWidth: 700,
    flexGrow: 1,
    overflow: "hidden",
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`,
    marginBottom: -10
  },
  imageContainerModal: {
    height: "50ch",
    width: "100%",
    display: "block",
    objectFit: "cover",
    backgroundColor: "lightGray"
  },
  rootDashboard: {
    flexGrow: 1,
    overflow: "hidden",
    filter: `drop-shadow(1px 2px 2px ${theme.palette.tertiary.shadow})`
  },
  imageContainerDashboard: {
    height: "50vh",
    width: "100%",
    display: "block",
    objectFit: "cover",
    backgroundColor: "lightGray"
  },
  mobileStepper: {
    backgroundColor: "transparent"
  }
}));

// breakpoints based on device width / height
const actionsBreak = 600;

export const Gallery = ({ initValues, autoplay = true, width, description = false, clickable = false, modal = false, dashboard = false }) => {
  const images = getSatImages(initValues);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const maxSteps = typeof images !== "string" ? images.length : 1;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const decideStyle = (baseClass) => {
    if (modal && baseClass === "root") return classes.rootModal;
    if (modal && baseClass === "imageContainer") return classes.imageContainerModal;
    if (dashboard && baseClass === "root") return classes.rootDashboard;
    if (dashboard && baseClass === "imageContainer") return classes.imageContainerDashboard;
    if (!modal && !dashboard && baseClass === "root") return classes.root;
    if (!modal && !dashboard && baseClass === "imageContainer") return classes.imageContainer;
  };

  return (
    <span>
      <Box className={decideStyle("root")}>
        <AutoPlaySwipeableViews
          autoplay={autoplay}
          interval={5000}
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          style={{
            cursor: !clickable && images?.length > 1 ? "grab" : clickable ? "pointer" : "default"
          }}>
          {typeof images !== "string" ? (
            images.map((step, index) => (
              <div key={index}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    component="img"
                    className={decideStyle("imageContainer")}
                    src={step.url}
                    alt={step.description}
                    onClick={() => {
                      clickable ? window.open(step.url, "_blank").focus() : null;
                    }}
                  />
                ) : null}
              </div>
            ))
          ) : (
            <Box component="img" className={decideStyle("imageContainer")} src={images} alt="Satellite Placeholder" />
          )}
        </AutoPlaySwipeableViews>
        {images.length > 1 ? (
          <MobileStepper
            className={classes.mobileStepper}
            steps={maxSteps}
            activeStep={activeStep}
            position="bottom"
            nextButton={
              width < actionsBreak ? (
                <div />
              ) : (
                <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                  <KeyboardArrowRight />
                </Button>
              )
            }
            backButton={
              width < actionsBreak ? (
                <div />
              ) : (
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                </Button>
              )
            }
          />
        ) : null}
      </Box>
      {description ? <div style={{ marginTop: "1em" }}>{images[activeStep].description}</div> : null}
    </span>
  );
};

// Prop checking
Gallery.propTypes = {
  initValues: PropTypes.object,
  autoplay: PropTypes.bool,
  width: PropTypes.number,
  description: PropTypes.bool,
  clickable: PropTypes.bool,
  modal: PropTypes.bool,
  dashboard: PropTypes.bool
};
