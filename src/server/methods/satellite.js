import { satelliteValidatorShaper } from "../utils/satelliteDataFuncs";
import {
  userHasVerifiedData,
  machineHasVerifiedData,
} from "../utils/verificationFuncs";
import {
  userHasValidatedData,
  machineHasValidatedData,
} from "../utils/validationFuncs";

export const satelliteMethods = (Meteor, Roles, SatelliteCollection) => {
  return Meteor.methods({
    addNewSatellite: (values, initValues) => {
      if (Meteor.userId()) {
        let error = null;
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        values["machineCheck"] = false;
        satelliteValidatorShaper(values, initValues)
          .validate(values)
          .then(() => {
            SatelliteCollection.insert(values);
          })
          .catch((err) => {
            console.log(err);
            error = err;
          });
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    updateSatellite: (values, initValues) => {
      if (Meteor.userId()) {
        let error = null;
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        values["machineCheck"] = false;
        satelliteValidatorShaper(values, initValues)
          .validate(values)
          .then(() => {
            SatelliteCollection.update({ _id: values._id }, values);
          })
          .catch((err) => {
            console.log(err);
            error = err;
          });
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteSatellite: (values) => {
      if (Meteor.userId()) {
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SatelliteCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    actuallyDeleteSatellite: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        SatelliteCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
    restoreSatellite: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SatelliteCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    checkSatelliteData: (values, task, method) => {
      let tempValues = values;
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator") ||
        Roles.userIsInRole(Meteor.userId(), "machine")
      ) {
        if (method === "user") {
          if (task === "verify")
            tempValues = userHasVerifiedData(values, Meteor.user().username);
          if (task === "validate")
            tempValues = userHasValidatedData(values, Meteor.user().username);
        } else if (method === "machine") {
          if (task === "verify")
            tempValues = machineHasVerifiedData(values, Meteor.user().username);
          if (task === "validate")
            tempValues = machineHasValidatedData(
              values,
              Meteor.user().username
            );
        }
        SatelliteCollection.update({ _id: values._id }, tempValues);
        return tempValues;
      } else {
        return "Unauthorized [401]";
      }
    },
  });
};
