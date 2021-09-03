import React from 'react'
import { useTracker } from "meteor/react-meteor-data";

export const Settings = () =>{
    let user = useTracker(() => Meteor.user()?.username, []);
    return(
        <>
        <p>
            {user? user : ":)"}
        </p>
        </>
    )
}