export const schemaMethods = (
  Meteor,
  Roles,
  SchemaCollection,
  schemaValidatorShaper
) => {
  return Meteor.methods({
    addNewSchema: (initValues, values) => {
      if (Meteor.userId()) {
        let error = null;
        const schemas = SchemaCollection.find().fetch();
        values["isDeleted"] = false;
        values["createdOn"] = new Date();
        values["createdBy"] = Meteor.user().username;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues, schemas)
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
        let error = null;
        const schemas = SchemaCollection.find().fetch();
        if (!values["createdOn"] || !values["createdBy"]) {
          values["createdOn"] = new Date();
          values["createdBy"] = Meteor.user().username;
        }
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        values["adminCheck"] = false;
        schemaValidatorShaper(initValues, schemas)
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
        values["isDeleted"] = true;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SchemaCollection.update({ _id: values._id }, values);
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
        values["isDeleted"] = false;
        values["modifiedOn"] = new Date();
        values["modifiedBy"] = Meteor.user().username;
        SchemaCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
    adminCheckSchema: (values) => {
      if (
        Roles.userIsInRole(Meteor.userId(), "admin") ||
        Roles.userIsInRole(Meteor.userId(), "moderator")
      ) {
        values["adminCheck"] = true;
        SchemaCollection.update({ _id: values._id }, values);
      } else {
        return "Unauthorized [401]";
      }
    },
  });
};
