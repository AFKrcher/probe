export const schemaMethods = (
  Meteor,
  Roles,
  SchemaCollection,
  schemaValidatorShaper
) => {
  return Meteor.methods({
    provideSchemaValidator: () => {
      return schemaValidatorShaper;
    },
    addNewSchema: (initValues, values) => {
      if (Meteor.userId()) {
        let error;
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues.name)
          .validate(values)
          .then(() => {
            return SchemaCollection.insert(values);
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
    updateSchema: (initValues, values) => {
      if (Meteor.userId()) {
        let error;
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues.name)
          .validate(values)
          .then(() => {
            return SchemaCollection.update({ _id: values._id }, values);
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
    deleteSchema: (values) => {
      if (Meteor.userId()) {
        let error;
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        schemaValidatorShaper(values.name)
          .validate(values)
          .then(() => {
            return SchemaCollection.insert(values);
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
    actuallyDeleteSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        SchemaCollection.remove(values._id);
      } else {
        return "Unauthorized [401]";
      }
    },
    restoreSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        let error;
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        schemaValidatorShaper(values.name)
          .validate(values)
          .then(() => {
            return SchemaCollection.insert(values);
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
    adminCheckSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        let error;
        values["adminCheck"] = true;
        schemaValidatorShaper(values.name)
          .validate(values)
          .then(() => {
            return SchemaCollection.insert(values);
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
  });
};
