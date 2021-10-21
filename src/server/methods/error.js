export const errorMethods = (Meteor, ErrorsCollection) => {
  return Meteor.methods({
    addError: (obj) => {
      ErrorsCollection.insert(obj);
      if (ErrorsCollection.find().count() > 50) {
        console.log("Clearing ErrorsCollection");
        ErrorsCollection.remove({});
      }
    },
    deleteError: (id) => {
      ErrorsCollection.remove(id);
    },
    deleteAllErrors: () => {
      ErrorsCollection.remove({});
    },
  });
};
