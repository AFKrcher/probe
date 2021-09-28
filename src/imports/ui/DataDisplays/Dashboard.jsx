import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteCollection } from "../../api/satellites";

export const Dashboard = () =>{
    const location = useLocation();
    let path = location.pathname;
    path = path.substring(1)

    const [sats, isLoading, favorites, user] = useTracker(() => {
        const sub = Meteor.subscribe("satellites");
        const user = Meteor.user()?.username;
        const favorites = Meteor.user()?.favorites;
        const sats =
              SatelliteCollection.find(
                {
                  noradID: path
                },
                {
                }
              ).fetch()
        return [sats, !sub.ready(), favorites, user];
      });
      console.log(sats[0]?.names[0].name)

    return(
        <>
            
            {isLoading ? isLoading :(
                sats[0].names[0].name,
            // sats[0].names.map(name => (
            //     <>
            //     <span>
            //         {`${name.name} `}
            //     </span>
            //     </>
            // ))
            (                
            sats.map(one => (
                    <>
                    <p>
                        {
                            typeof one === "object" ? 
                            (
                                <>
                                <span>
                                    Other schemas:
                                    {Object.entries(one) + Object.values(one)}
                                    <br/>
                                </span>
                                </>
                                ) : ''
                                }
                            </p>
                            </>
                               ))
                            )
                            )
                        }
        </>
    )
}