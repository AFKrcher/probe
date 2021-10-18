import React, { useState, useEffect } from "react";
// Imports
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";

//Components
import { Gallery } from "./Gallery.jsx";

// @material-ui
import {
  CircularProgress,
  DataGrid,
  Grid,
  makeStyles,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh",
  },
}));

export const Dashboard = () => {
  const classes = useStyles();
  const location = useLocation();

  const [path, setPath] = useState(25544);

  const columns = [
    {
      headerAlign: "left",
      field: "id",
      headerName: "NORAD ID",
      minWidth: 150,
    },
    {
      headerAlign: "left",
      field: "orbit",
      headerName: "ORBIT(S)",
      minWidth: 140,
      editable: false,
      filterable: false,
    },
    {
      headerAlign: "left",
      field: "types",
      headerName: "TYPE(S)",
      minWidth: 200,
      editable: false,
      filterable: false,
    },
  ];

  useEffect(() => {
    const url = location.pathname.substring(1).split("/")[1];
    setPath(url);
  }, []);

  const [sat, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    let sat;
    if (path) {
      sat = SatelliteCollection.find(
        {
          noradID: path,
        },
        {}
      ).fetch()[0];
    }
    return [sat, !sub.ready()];
  });

  const nameMapper = (sat) => {
    let names = [];
    if (sat.names?.length > 1) {
      for (let i = 1; i < sat.names.length; i++) {
        if (i === sat.names.length - 1) {
          names.push(`${sat.names[i].name}`);
        } else {
          names.push(`${sat.names[i].name}, `);
        }
      }
    }
    return ` (AKA: ${names.join(", ")})`;
  };

  return (
    <Container className={classes.root}>
      {!isLoading && !sat?.isDeleted && sat ? (
        <React.Fragment>
          <Grid
            item
            container
            xs={12}
            spacing={10}
            justifyContent="space-around"
          >
            <Grid item xs={6}>
              {sat.names ? (
                <div>
                  {sat.names ? sat.names[0].name : null}
                  {sat.names?.length > 1 ? nameMapper(sat) : null}
                </div>
              ) : null}
              <p>
                Norad ID: {sat.noradID}
                {sat.cosparID ? sat.cosparID.cosparID : null}
              </p>
              <Gallery
                initValues={sat}
                clickable={true}
                description={true}
                autoplay={false}
              />
              <p>
                {sat.descriptionShort
                  ? sat.descriptionShort[0].descriptionShort
                  : null}
                <br />
                {sat.descriptionLong
                  ? sat.descriptionLong[0].descriptionLong
                  : null}
              </p>
              {Object.keys(sat).map((key) => {
                if (typeof sat[key] !== "object") {
                  return <div key={key}>{`${key} ${sat[key]}`}</div>;
                } else {
                  console.log(sat);
                }
              })}
            </Grid>
          </Grid>
        </React.Fragment>
      ) : (
        <div className={classes.spinnerContainer}>
          <CircularProgress
            className={classes.spinner}
            size={100}
            thickness={3}
          />
        </div>
      )}
    </Container>
  );
};
