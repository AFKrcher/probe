var transformAll = require("@demvsystems/yup-ast").transformAll;
var Yup = require("yup");

// EXAMPLE SCHEMA OBJECT
let schemaObject = {
  bus: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    bus: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  contractor: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    responsibility: {
      type: "string",
      allowedValues: [],
    },
  },
  cosparID: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    cosparID: {
      type: "string",
      allowedValues: [],
      required: true,
      isUnique: true,
    },
  },
  descriptionLong: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    descriptionLong: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  descriptionShort: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    descriptionShort: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  dimensionDescription: {
    reference: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    dimensionDescription: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    lengthMeters: {
      type: "number",
      allowedValues: [],
    },
    widthMeters: {
      type: "number",
      allowedValues: [],
    },
    heightMeters: {
      type: "number",
      allowedValues: [],
    },
  },
  dimensionVolumeM3: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    cubicMeters: {
      type: "number",
      allowedValues: [],
      required: true,
    },
  },
  images: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    description: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    url: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    entireSatellite: {
      type: "string",
      allowedValues: ["true", "false"],
      required: true,
    },
  },
  launchMassKg: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    launchMassKg: {
      type: "number",
      allowedValues: [],
      required: true,
    },
  },
  launchSites: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
    },
    description: {
      type: "string",
      allowedValues: [],
    },
    latitude: {
      type: "number",
      allowedValues: [],
    },
    longitude: {
      type: "number",
      allowedValues: [],
    },
  },
  launchVehicle: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
    },
    description: {
      type: "string",
      allowedValues: [],
    },
  },
  manufacturer: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    responsibility: {
      type: "string",
      allowedValues: [],
    },
  },
  mission: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    description: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  missionDuration: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    start: {
      type: "date",
      allowedValues: [],
      required: true,
    },
    plannedMissionDuration: {
      type: "number",
      min: 0,
      allowedValues: [],
    },
    actualMissionDuration: {
      type: "number",
      min: 0,
      allowedValues: [],
    },
    durationScale: {
      type: "string",
      allowedValues: ["hours", "days", "months", "years"],
    },
  },
  names: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  news: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    news: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  orbit: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    orbit: {
      type: "string",
      allowedValues: ["GEO", "LEO", "HEO", "SSO", "Polar", "GTO"],
      required: true,
    },
    description: {
      type: "string",
      allowedValues: [],
    },
  },
  organization: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    organization: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    responsibility: {
      type: "string",
      allowedValues: [],
    },
  },
  ownership: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    type: {
      type: "string",
      allowedValues: ["country", "company", "organization"],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    responsibility: {
      type: "string",
      allowedValues: [],
    },
  },
  payload: {
    reference: {
      type: "string",
      allowedValues: [],
      required: true,
    },
    name: {
      type: "string",
      allowedValues: [],
    },
    description: {
      type: "string",
      allowedValues: [],
    },
  },
  power: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    source: {
      type: "string",
      allowedValues: ["nuclear", "solar", "battery", "other"],
      required: true,
    },
    sourceStatus: {
      type: "string",
      allowedValues: [],
    },
    voltage: {
      type: "number",
      allowedValues: [],
    },
    voltageScale: {
      type: "string",
      allowedValues: ["volts", "millivolts"],
    },
    current: {
      type: "number",
      allowedValues: [],
    },
    currentScale: {
      type: "string",
      allowedValues: ["amps", "milliamps"],
    },
    description: {
      type: "string",
      allowedValues: [],
    },
  },
  propulsion: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    description: {
      type: "string",
      allowedValues: [],
      required: false,
    },
    type: {
      type: "string",
      allowedValues: ["chemical", "electrical", "other"],
      required: false,
    },
    thrust: {
      type: "number",
      allowedValues: [],
    },
    thrustScale: {
      type: "number",
      allowedValues: ["newtons", "millinewtons"],
    },
    effectiveExhaustThrust: {
      type: "number",
      allowedValues: [],
      required: false,
      min: null,
      max: null,
    },
    effectiveExhaustThrustScale: {
      type: "string",
      allowedValues: [],
      required: false,
    },
    maxDeltaVelocity: {
      type: "number",
      allowedValues: [],
      required: false,
      min: null,
      max: null,
    },
    maxDeltaVelocityScale: {
      type: "string",
      allowedValues: [],
      required: false,
    },
    minDeltaVelocity: {
      type: "number",
      allowedValues: [],
      required: false,
      min: null,
      max: null,
    },
    minDeltaVelocityScale: {
      type: "string",
      allowedValues: [],
      required: false,
    },
    degreesOfMovement: {
      type: "string",
      allowedValues: [],
      required: false,
    },
    rangeType: {
      type: "string",
      allowedValues: [
        "stationKeeping",
        "orbital",
        "interplanatary",
        "interstellar",
      ],
      required: false,
    },
    firingDuration: {
      type: "number",
      allowedValues: [],
      required: false,
    },
    firingDurationScale: {
      type: "string",
      allowedValues: ["seconds", "minutes", "hours", "days"],
      required: false,
    },
  },
  radarCrossSection: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    radarCrossSection: {
      type: "number",
      allowedValues: [],
      required: true,
    },
    radarCrossSectionScale: {
      type: "string",
      allowedValues: [],
      required: true,
    },
  },
  status: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    status: {
      type: "string",
      allowedValues: [
        "operational",
        "operational with limitations (or standby)",
        "degraded",
        "not operational",
        "functional turned off",
        "no status reported",
      ],
      required: true,
    },
  },
  transponder: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    description: {
      type: "string",
      allowedValues: [],
      required: false,
      min: null,
      max: null,
    },
    minBand: {
      type: "number",
      allowedValues: [],
      required: false,
      min: null,
      max: null,
    },
    maxBand: {
      type: "number",
      allowedValues: ["Ghz", "Mhz", "Khz", "Hz"],
      required: false,
      min: null,
      max: null,
    },
    bandScale: {
      type: "string",
      allowedValues: ["Ghz", "Mhz", "Khz", "Hz"],
      required: false,
      min: null,
      max: null,
    },
    direction: {
      type: "string",
      allowedValues: ["uplink", "downlink", "crosslink", "multilink"],
      required: false,
      min: null,
      max: null,
    },
  },
  type: {
    reference: {
      type: "url",
      allowedValues: [],
      required: true,
    },
    type: {
      type: "string",
      allowedValues: ["natural", "manMade", "unknown"],
      required: true,
    },
  },
};

// EXAMPLE DATA
const valuesPlaceholder = {
  _id: "fTTviYiQRoMLdRC55",
  noradID: "12345",
  names: [
    {
      reference: "https://www.placeholder.gov",
      name: "Placeholder",
    },
    {
      reference: "https://www.placeholder.gov",
      name: "PlaceholderNumberTwo",
    },
  ],
};

const valuesISS = {
  _id: "fTTviYiQRoMLdRC26",
  noradID: "25544",
  names: [
    {
      reference: "https://www.nasa.gov/mission_pages/station/main/index.html",
      name: "International Space Station",
    },
    {
      reference: "https://www.nasa.gov/mission_pages/station/main/index.html",
      name: "ISS",
    },
  ],
  descriptionShort: [
    {
      reference: "https://en.wikipedia.org/wiki/International_Space_Station",
      descriptionShort:
        "A modular space station (habitable artificial satellite) in low Earth orbit.",
    },
  ],
  images: [
    {
      reference:
        "https://en.wikipedia.org/wiki/File:International_Space_Station_after_undocking_of_STS-132.jpg",
      description:
        "The International Space Station is featured in this image including the six iROSA solar arrays in the planned configuration that will augment the power drawn from the existing arrays on the Station. the first of the six iROSA was attached to the station around 9 am UTC on 20 June 2021 which were brought to ISS by Cargo Dragon C209 in its unpressurized trunk during its SpaceX CRS-22 mission, with the others arriving in mid and last quarter of 2021.",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg",
      entireSatellite: "true",
    },
  ],
  cosparID: [
    {
      reference: "https://en.wikipedia.org/",
      description:
        "The International Space Station is featured in this image including the six iROSA solar arrays in the planned configuration that will augment the power drawn from the existing arrays on the Station. the first of the six iROSA was attached to the station around 9 am UTC on 20 June 2021 which were brought to ISS by Cargo Dragon C209 in its unpressurized trunk during its SpaceX CRS-22 mission, with the others arriving in mid and last quarter of 2021.",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg",
      entireSatellite: "true",
      cosparID: "1998-067",
    },
  ],
  propulsion: [
    {
      reference:
        "https://www.nasa.gov/vision/space/travelinginspace/future_propulsion.html#:~:text=In%20the%20less-distant%20future%2C%20VASIMR%20could%20even%20help,source%20is%20used%20to%20ionize%20fuel%20into%20plasma.",
      type: "chemical",
      thrust: "",
      thrustScale: "",
      rangeType: "stationKeeping",
      description:
        "The Zvezda Service Module and Progress Module serve as the main thrust providers for the ISS.",
    },
  ],
  orbit: [
    {
      reference: "https://en.wikipedia.org/wiki/Low_Earth_orbit",
      orbit: "LEO",
    },
  ],
  launchSites: [
    {
      reference: "https://en.wikipedia.org/wiki/Baikonur_Cosmodrome",
      name: "Baikonur Cosmodrome",
      latitude: "45.965",
      longitude: "63.305",
    },
  ],
  type: [
    {
      reference: "https://www.nasa.gov/mission_pages/station/main/index.html",
      type: "manMade",
    },
  ],
  mission: [
    {
      reference: "https://www.pbs.org/spacestation/station/purpose.html",
      description:
        "To enable long-term exploration of space and provide benefits to people on Earth. ",
    },
  ],
  ownership: [
    {
      reference:
        "https://en.wikipedia.org/wiki/International_Space_Station#:~:text=Although%20it%20was%20built%20by,owned%20by%20the%20United%20States.",
      country: "United States",
      company: "",
      organization: "NASA",
      type: "organization",
      name: "International",
    },
  ],
  manufacturer: [
    {
      reference:
        "https://en.wikipedia.org/wiki/Manufacturing_of_the_International_Space_Station",
      manufacturers:
        "NASA, European Space Agency, Roscosmos, JAXA, Boeing, Canadian Space Agency, Nanoracks, Thales Alenia Space, Khartron",
      name: "NASA",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Manufacturing_of_the_International_Space_Station",
      name: "JAXA",
      responsibility: "",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Manufacturing_of_the_International_Space_Station",
      name: "ESA",
      responsibility: "",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Manufacturing_of_the_International_Space_Station",
      name: "Roscosmos",
      responsibility: "",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Manufacturing_of_the_International_Space_Station",
      name: "CSA",
      responsibility: "",
    },
  ],
  dimensionDescription: [
    {
      reference: "https://www.nasa.gov/feature/facts-and-figures",
      dimensionDescription: "Overall length and width.",
      lengthMeters: "73",
      widthMeters: "109",
      heightMeters: "",
    },
  ],
  news: [
    {
      reference: "https://blogs.nasa.gov/spacestation/",
      news: "Sep 3, 2021: Russian cosmonauts Oleg Novitskiy and Pyotr Dubrov of Roscosmos concluded their spacewalk at 6:35 p.m. EDT after 7 hours and 54 minutes. It is the first of up to 11 spacewalks to prepare the new Nauka multipurpose laboratory module for operations in space.",
    },
  ],
  status: [
    {
      reference: "https://www.nasa.gov/mission_pages/station/main/index.html",
      status: "operational",
    },
  ],
  missionDuration: [
    {
      reference: "https://en.wikipedia.org/wiki/International_Space_Station",
      start: "1998-11-20T09:46",
      plannedMissionDuration: "27",
      actualMissionDuration: "",
    },
  ],
  organization: [
    {
      reference:
        "https://www.nasa.gov/mission_pages/station/cooperation/index.html",
      organization: "NASA",
    },
    {
      reference:
        "https://www.nasa.gov/mission_pages/station/cooperation/index.html",
      organization: "JAXA",
      responsibility: "",
    },
    {
      reference:
        "https://www.nasa.gov/mission_pages/station/cooperation/index.html",
      organization: "ESA",
      responsibility: "",
    },
    {
      reference:
        "https://www.nasa.gov/mission_pages/station/cooperation/index.html",
      organization: "Roscosmos",
      responsibility: "",
    },
    {
      reference:
        "https://www.nasa.gov/mission_pages/station/cooperation/index.html",
      organization: "CSA",
      responsibility: "",
    },
  ],
  dimensionVolumeM3: [
    {
      reference: "https://www.nasa.gov/pdf/167128main_Facts.pdf",
      cubicMeters: "935",
    },
  ],
  power: [
    {
      reference:
        "https://en.wikipedia.org/wiki/Electrical_system_of_the_International_Space_Station#:~:text=The%20ISS%20electrical%20system%20uses,solar%20power%20is%20called%20photovoltaics.",
      source: "solar",
      sourceStatus: "",
      voltage: "160",
      voltageScale: "volts",
      current: "",
      currentScale: "",
    },
  ],
  payload: [
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      description: "20 November 1998",
      name: "Zarya",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Unity",
      description: "4 December 1998, also known as Node 1",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Zvezda",
      description: "12 July 2000",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Destiny",
      description: " 7 February 2001",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Harmony",
      description: "23 October 2007",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Columbus",
      description: "7 February 2008",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Kibo",
      description: "multiple flights between 2008-2009",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Truss and Solarpanels",
      description: "multiple flights between 2000-2009",
    },
    {
      reference:
        "https://en.wikipedia.org/wiki/Assembly_of_the_International_Space_Station",
      name: "Nauka",
      description: "21 July 2021",
    },
  ],
  launchMassKg: [
    {
      reference: "https://en.wikipedia.org/wiki/International_Space_Station",
      launchMassKg: "419289",
    },
  ],
};

// TESTING YUP-AST
let yupShape = {
  // NORAD ID and _id are always a part of the yup shape
  _id: Yup.string()
    .required()
    .notOneOf([], "Something went wrong while assigning _id"),
  noradID: Yup.string()
    .required(`Required`)
    .matches(/^[0-9]+$/g, "Must be a positive number")
    .notOneOf(
      [],
      (obj) =>
        `A satellite with noradID of ${obj.value} already exists in our records.`
    ),
};

const schemaGenerator = (schemaObj, values) => {
  let cleanSchemaObj = {}; // stores only the schemas applicable to the current satellite values
  for (let value in values) {
    if (schemaObj[value]) cleanSchemaObj[value] = schemaObj[value];
  }

  for (let schema in cleanSchemaObj) {
    let entries = cleanSchemaObj[schema];
    let shapeObj = {}; // stores the object of checks for the current entry
    for (let entry in entries) {
      let field = entries[entry]; // an input inside of each entry
      let fieldArr = []; //stores the
      // for filtering out url data types and adding a custom regex validator instead
      let type = null;
      field.type === "url"
        ? (type = "yup.string")
        : (type = `yup.${field.type}`);
      fieldArr.push(["yup.string"]);
      fieldArr.push(["yup.required"]);
      shapeObj[entry] = fieldArr;
    }

    yupShape[schema] = transformAll([
      ["yup.array"],
      ["yup.required"],
      ["yup.of", [["yup.object"], ["yup.shape", shapeObj]]],
    ]);
  }

  console.log(JSON.stringify(yupShape, null, 2));
};

// schemaGenerator(schemaObject, valuesISS);
schemaGenerator(schemaObject, valuesPlaceholder);
