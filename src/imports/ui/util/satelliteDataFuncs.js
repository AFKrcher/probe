export const getSatName = (satellite) => {
  return satellite && satellite.names && satellite.names.length > 0
    ? satellite.names[0].name
    : "Name not found...";
};

export const getSatImage = (satellite) => {
  return satellite && satellite.images && satellite.images.length > 0
    ? satellite.images[0].link
    : "/sat-placeholder.jpg";
};

export const getSatID = (satellite) => {
  return satellite && satellite.noradID
    ? satellite.noradID
    : "NORAD ID not found...";
};

export const getSatDesc = (satellite) => {
  return satellite &&
    satellite.descriptionShort &&
    satellite.descriptionShort.length > 0
    ? satellite.descriptionShort[0].descriptionShort
    : "";
};

export const emptyDataRemover = (values) => {
  let tempObj = {};
  let deleteEmptyArr = [];
  Object.entries(values).forEach((entryArr) => {
    return (tempObj[entryArr[0]] = JSON.stringify(entryArr[1]));
  });
  for (let key in tempObj) {
    if (tempObj[key] === "[]" || tempObj[key] === "{}" || tempObj[key] === "") {
      deleteEmptyArr.push(key);
    }
  }

  deleteEmptyArr.forEach((emptyEntry) => delete values[emptyEntry]);
  return values;
};
