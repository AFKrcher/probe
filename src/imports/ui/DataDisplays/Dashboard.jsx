import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";
import { getSatImage } from "../utils/satelliteDataFuncs.js";
import { Gallery } from "./Gallery.jsx";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";

export const Dashboard = () => {
  const location = useLocation();
  let path = location.pathname;
  path = path.substring(1);

  const [sats, isLoading, favorites, user] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const user = Meteor.user()?.username;
    const favorites = Meteor.user()?.favorites;
    const sats = SatelliteCollection.find(
      {
        noradID: path,
      },
      {}
    ).fetch();
    return [sats, !sub.ready(), favorites, user];
  });

  return (
    <>
      {isLoading ? (
        isLoading
      ) : (
        <>
          <SatelliteModal
            show={true}
            initValues={sats[0]}
            newSat={false}
            handleClose={() => {
              setShowModal(false);
            }}
            width={"100%"}
            height={"100%"}
          />
          {/* <Gallery initValues={{"images": sats[0].images}} />
      {sats[0].names[0].name}
      {sats[0].names.map(name => (
        <>
          <span> (
            {name.name}
          )</span>
        </>
      ))}
      <br/>
      {sats[0].createdOn ? `Created on: ${JSON.stringify(sats[0].createdOn)}` : ''}
      <br/>
      {sats[0].descriptionShort ? `${sats[0].descriptionShort[0].descriptionShort}` : ''}
      <br/>
      {sats[0].descriptionLong ? `${sats[0].descriptionLong[0].descriptionLong}` : ''}
      {Object.keys(sats[0]).map((key, i) =>{
        if(typeof sats[0][key] === 'string'){
          return(
            <div>
          {`${key}: ${sats[0][key]}`}
        </div>
          )
        }
        })
      } */}
        </>
      )}
    </>
  );
};
