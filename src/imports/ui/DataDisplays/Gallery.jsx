import React, { useState } from "react";
// imports
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getSatImages } from "../utils/satelliteDataFuncs.js";

// @material-ui
import {
  MobileStepper,
  Box,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 500,
    flexGrow: 1,
  },
  imageContainer: {
    height: "300px",
    width: "100%",
    display: "block",
    objectFit: "cover",
    overflow: "hidden",
  },
  mobileStepper: {
    backgroundColor: "transparent",
    zIndex: "1",
    position: "relative",
    marginTop: "-12%",
  },
}));

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const Gallery = ({ initValues, autoplay = true, width = 1000 }) => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const images = getSatImages(initValues);
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

  return (
    <Box className={classes.root}>
      <AutoPlaySwipeableViews
        autoplay={autoplay}
        interval={5000}
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {typeof images !== "string" ? (
          images.map((step, index) => (
            <div key={index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  className={classes.imageContainer}
                  src={step.url}
                  alt={step.description}
                />
              ) : null}
            </div>
          ))
        ) : (
          <Box
            component="img"
            className={classes.imageContainer}
            src={images}
            alt="Satellite Placeholder"
          />
        )}
      </AutoPlaySwipeableViews>
      <MobileStepper
        className={classes.mobileStepper}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          width < 1000 ? (
            <div />
          ) : (
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              <KeyboardArrowRight />
            </Button>
          )
        }
        backButton={
          width < 1000 ? (
            <div />
          ) : (
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </Button>
          )
        }
      />
    </Box>
  );
};
