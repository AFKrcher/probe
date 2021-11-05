import { userHasVerifiedData, machineHasVerifiedData } from "../utils/verificationFuncs";
import { userHasValidatedData, machineHasValidatedData } from "../utils/validationFuncs";
import { satelliteValidatorShaper } from "/imports/validation/satelliteYupShape";

export const satelliteMethods = (Meteor, Roles, SatelliteCollection, PROBE_API_KEY) => {
  return Meteor.methods({
    addNewSatellite: async (initValues, values, key = false) => {
      if (key ? key === PROBE_API_KEY : Meteor.userId() && Meteor.user()?.emails[0]?.verified) {
        let error;
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = key ? "PROBE Partner API" : Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = key ? "PROBE Partner API" : Meteor.user().username;
        values["adminCheck"] = false;
        values["machineCheck"] = false;
        await satelliteValidatorShaper(values, initValues)
          .isValid(values)
          .catch((err) => {
            error = err;
          });
        if (!error) SatelliteCollection.insert(values);
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    updateSatellite: async (initValues, values) => {
      if (Meteor.userId() && Meteor.user()?.emails[0]?.verified) {
        let error;
        if (!values) {
          values = initValues;
        }
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        values["machineCheck"] = false;
        await satelliteValidatorShaper(values, initValues)
          .isValid(values)
          .catch((err) => {
            error = err;
          });
        if (!error) SatelliteCollection.update({ _id: values._id }, values);
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    deleteSatellite: async (values) => {
      if (Meteor.userId() && Meteor.user()?.emails[0]?.verified) {
        let error;
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        await satelliteValidatorShaper(values, values)
          .isValid(values)
          .catch((err) => {
            error = err;
          });
        if (!error) SatelliteCollection.insert(values);
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    actuallyDeleteSatellite: (values) => {
      if ((Roles.userIsInRole(Meteor.userId(), "admin") || Roles.userIsInRole(Meteor.userId(), "moderator")) && Meteor.user()?.emails[0]?.verified) {
        SatelliteCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
    restoreSatellite: (values) => {
      if ((Roles.userIsInRole(Meteor.userId(), "admin") || Roles.userIsInRole(Meteor.userId(), "moderator")) && Meteor.user()?.emails[0]?.verified) {
        let error;
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SatelliteCollection.update({ _id: values._id }, values);
        return error;
      } else {
        return "Unauthorized [401]";
      }
    },
    checkSatelliteData: (values, task, method) => {
      if (
        (Roles.userIsInRole(Meteor.userId(), "admin") || Roles.userIsInRole(Meteor.userId(), "moderator") || Roles.userIsInRole(Meteor.userId(), "machine")) &&
        Meteor.user()?.emails[0]?.verified
      ) {
        let tempValues = values;
        if (method === "user") {
          if (task === "verify") tempValues = userHasVerifiedData(values, Meteor.user().username);
          if (task === "validate") tempValues = userHasValidatedData(values, Meteor.user().username);
        } else if (method === "machine") {
          if (task === "verify") tempValues = machineHasVerifiedData(values, Meteor.user().username);
          if (task === "validate") tempValues = machineHasValidatedData(values, Meteor.user().username);
        }
        SatelliteCollection.update({ _id: values._id }, tempValues);
        return tempValues;
      } else {
        return "Unauthorized [401]";
      }
    }
  });
};
