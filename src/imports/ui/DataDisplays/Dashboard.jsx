import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";

//Components
import { Gallery } from "./Gallery.jsx";

// @material-ui
import { Container, CircularProgress, Grid, makeStyles, Paper } from "@material-ui/core";
import { styled } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    padding: 0,
    paddingTop: 15
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center"
  },
  spinner: {
    color: theme.palette.text.primary,
    marginTop: "30vh"
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

export const Dashboard = () => {
  const classes = useStyles();
  const location = useLocation();

  const [path, setPath] = useState(25544);

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
          noradID: path
        },
        {}
      ).fetch()[0];
    }
    return [sat, !sub.ready()];
  });

  const mapper = (prop = "names", key = prop) => {
    let values = [];
    if (sat[prop]?.length > 1) {
      for (let i = 1; i < sat[prop].length; i++) {
        if (i === sat[prop].length - 1) {
          values.push(`${sat[prop][i][key]}`);
        } else {
          values.push(`${sat[prop][i][key]}, `);
        }
      }
    }
    return ` (${prop.toUpperCase()}: ${values.join(" ")})`;
  };

  return (
    <Container className={classes.root}>
      {!isLoading && !sat?.isDeleted && sat ? (
        <React.Fragment>
          <Grid container spacing={10} justifyContent="space-around">
            <Grid item xs={6}>
              <Item>
                {sat.names ? (
                  <div>
                    {sat.names ? sat.names[0].name : null}
                    {sat.names?.length > 1 ? mapper("names", "name") : null}
                  </div>
                ) : null}
                <p>
                  Norad ID: {sat.noradID}
                  {sat.cosparID ? sat.cosparID.cosparID : null}
                </p>
                <p>
                  {sat.descriptionShort ? sat.descriptionShort[0].descriptionShort : null}
                  <br />
                  {sat.descriptionLong ? sat.descriptionLong[0].descriptionLong : null}
                </p>
                {Object.keys(sat).map((key, index) => {
                  if (sat[key].length > 1 && typeof sat[key] === "object") {
                    return <div key={index}>{mapper(key)}</div>;
                  }
                })}
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Gallery initValues={sat} clickable={true} description={true} autoplay={false} dashboard={true} />
                {sat.organization ? mapper("organization") : null}
                <br />
                {sat.payload ? mapper("payload", "name") : null}
              </Item>
            </Grid>
          </Grid>
        </React.Fragment>
      ) : (
        <div className={classes.spinnerContainer}>
          <CircularProgress className={classes.spinner} size={100} thickness={3} />
        </div>
      )}
    </Container>
  );
};
