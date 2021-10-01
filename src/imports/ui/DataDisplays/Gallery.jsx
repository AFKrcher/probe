import React, { useState } from "react";
// imports
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getSatImages } from "../utils/satelliteDataFuncs.js";

// @material-ui
import { Grid, MobileStepper, Box, Paper, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const Gallery = ({ initValues }) => {
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
    <Box
      sx={{
        maxWidth: 500,
        flexGrow: 1,
      }}
    >
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
        }}
      />
      <AutoPlaySwipeableViews
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
                  sx={{
                    height: "255px",
                    display: "block",
                    objectFit: "cover",
                    overflow: "hidden",
                    width: "100%",
                  }}
                  src={step.url}
                  alt={step.description}
                />
              ) : null}
            </div>
          ))
        ) : (
          <Box
            component="img"
            sx={{
              height: "255px",
              display: "block",
              objectFit: "cover",
              overflow: "hidden",
              width: "100%",
            }}
            src={images}
            alt="Satellite Placeholder"
          />
        )}
      </AutoPlaySwipeableViews>
      <MobileStepper
        style={{
          backgroundColor: "transparent",
          zIndex: "1",
          position: "relative",
          marginTop: "-12%",
        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="medium"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="medium" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
          </Button>
        }
      />
    </Box>
  );
};
