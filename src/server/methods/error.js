export const errorMethods = (Meteor, ErrorsCollection) => {
  return Meteor.methods({
    addError: (obj) => {
      ErrorsCollection.insert(obj);
      if (ErrorsCollection.find().count() > 50) {
        const tempArr = ErrorsCollection.find().fetch();
        tempArr.shift(); // remove the oldest error
        ErrorsCollection.remove({}); // remove all errors
        tempArr.forEach((obj) => ErrorsCollection.insert(obj)); // re-insert all errors
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
