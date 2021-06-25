export const getSatName = (satellite) => {
  return ((satellite && satellite.names && satellite.names.length > 0) ? satellite.names[0].names : "Name not found...");
};

export const getSatImage = (satellite) => {
  return ((satellite && satellite.images && satellite.images.length > 0) ? satellite.images[0].link : "/sat-placeholder.jpg");
};

export const getSatID = (satellite) => {
  return ((satellite && satellite.noradID) ? satellite.noradID : "NORAD ID not found...");
};

export const getSatDesc = (satellite) => {
  return ((satellite && satellite.descriptionShort && satellite.descriptionShort.length > 0) ? satellite.descriptionShort[0].descriptionShort : "")
};
