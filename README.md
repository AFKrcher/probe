# Publicly Researched Observatory (PROBE)

This open source project seeks to design a system that allows a community to maintain publicly sourced research and analysis data on satellites.

## Table of Contents

1.  [Overview](#Overview)
2.  [Usage](#Usage)
    - [Application](#Application)
    - [Public API](#Public-API)
    - [Partner API](#Partner-API)
3.  [How To Contribute](#How-To-Contribute)
    - [Git](#Git)
    - [Coding Standards](#Coding-Standards)
    - [Installation](#Installation)
    - [Access MongoDB](#Access-MongoDB)
    - [Environment Variables](#Environment-Variables)
    - [Build Exports](#Build-Exports)
    - [Testing](#Testing)
    - [Docker Builds](#Docker-Builds)
4.  [Libraries](#Libraries)
    - [NPM](#NPM)
    - [Meteor](#Meteor)
5.  [License](#License)

## Overview

The main focus of this application is data entry experience, data validation, and api useability. In order to focus on those 3 core priorities, a MeteorJS framework was used to set-up and deploy the application. Meteor/WebApp and Meteor/Mongo were used in conjunction with ReactJS to provide a seamless stack that exposes a user-friendly frontend and api for the community to use. A custom combination of vanilla JS, Yup and Formik provide dynamic schema creation and data validation.

- Database: Meteor/MongoDB
- Client: ReactJS
- Server: Meteor/WebApp
- Repository: [GitHub](https://github.com/AFKrcher/PSRA)
- Staging Deployment: [PROBE]()
- Production Deployment: [PROBE]()

## Usage

### Application

The application should be intuitive and easy-to-use, even for a first-time user. If something is not clear, tooltips, keys, and captions are sprinkled throughout the application to guide the user on how things work. If you think the UI/UX is not user-friendly enough, please submit an issue and a suggestion on how we can fix it.

### Public API

The public API allows all users to obtain information on satellites and schemas produced by PROBE. Queries in the form of GET requests can be made to obtain specific satellites or schemas. POST, PUT, and PATCH requests are not allowed to the public. Below is a list of example requests:

#### Welcome Message

GET: `/api/`

RESPONSE:

`"Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."`

#### Satellites

GET: `/api/satellites`

GET (full or partial name): `/api/satellites?name=International`

GET (full or partial NORAD ID): `/api/satellites?name=25544`

GET (full or partial orbit): `/api/satellites?name=LEO`

GET (full or partial type): `/api/satellites?name=research`

RESPONSE:

```json
[
  {
    "_id": "fTTviYiQRoMLdRC26",
    "isDeleted": false,
    "noradID": "25544",
    "createdOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)",
    "createdBy": "admin",
    "modifiedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)",
    "modifiedBy": "admin",
    "adminCheck": true,
    "machineCheck": false,
    "names": [
      {
        "reference": "https://www.nasa.gov/mission_pages/station/main/index.html",
        "verified": [
          {
            "method": "user",
            "name": "admin",
            "verified": true,
            "verifiedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
          },
          {
            "method": "machine",
            "name": "Layer8",
            "verified": false,
            "verifiedOn": ""
          }
        ],
        "validated": [
          {
            "method": "user",
            "name": "admin",
            "validated": true,
            "validatedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
          },
          {
            "method": "machine",
            "name": "Layer8",
            "validated": false,
            "validatedOn": ""
          }
        ],
        "name": "International Space Station"
      }
    ],
    "descriptionShort": [
      {
        "reference": "https://en.wikipedia.org/wiki/International_Space_Station",
        "verified": [
          {
            "method": "user",
            "name": "admin",
            "verified": true,
            "verifiedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
          },
          {
            "method": "machine",
            "name": "Layer8",
            "verified": false,
            "verifiedOn": ""
          }
        ],
        "validated": [
          {
            "method": "user",
            "name": "admin",
            "validated": true,
            "validatedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
          },
          {
            "method": "machine",
            "name": "Layer8",
            "validated": false,
            "validatedOn": ""
          }
        ],
        "descriptionShort": "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA."
      }
    ],
    ... // more data
  },
  ... // more related satellites
]
```

#### Schemas

GET: `/api/schemas`

GET (full or partial name): `/api/schemas?name=names`

RESPONSE:

```json
[
  {
  "name": "names",
  "description": "Satellite's names or callsigns.",
  "fields": [
    {
      "name": "reference",
      "hidden": true,
      "type": "url",
      "allowedValues": [],
      "required": true
    },
    {
      "name": "verified",
      "hidden": true,
      "type": "verified",
      "required": true
    },
    {
      "name": "validated",
      "hidden": true,
      "type": "validated",
      "required": true
    },
    {
      "name": "name",
      "type": "string",
      "allowedValues": [],
      "required": true,
      "isUnique": true,
      "stringMax": 50
    },
    ... // more fields
  ],
  ... // more data
}
  ... // more related schemas
]
```

### Partner API

The partner API allows registered partners with PROBE API keys to go beyond the public API GET requests. The partner API is used mainly for PATCH, POST, and DELETE requests,
as well as GET requests of more detailed information.

#### Welcome Message

GET (POST, PUT, PATCH): `/api/partner/:key`

RESPONSE:

`"Welcome to the PROBE partner API! For documentation, please visit the README at https://github.com/justinthelaw/PROBE."` (`"Partner made an empty {POST, PUT, PATCH} request!"`)

## How To Contribute

### Git Processes

1. Fork and clone the repository based on the [Installation](#Installation) instructions
2. Ensure you have fetched and pulled the latest master/main branch of the repository
3. Set-up your feature branches to the following standard: `feature/<feature name>-<username>`
4. Ensure that any libraries or technologies that you use are properly listed in the dependency tree and in this README's [Libraries](#Libraries) section
5. Contribute to the main/master repository through clear and succinct pull requests
6. When not contributing code directly, generate issues on GitHub with context, problem statement, and, if possible, a suggested solution

### Coding Standards

The list below is meant to be a guide and not a rule-book. Please try your best to use this guide to build code that is readable and easy-to-understand for all contributors:

- Use Prettier (preferred) or any other code formatting/linting extension to format the code properly
- Use PropTypes to both annotate prop types for other contributors, and for development type-checking
- Use comments to explain functions that may result in a "why" or "how" from first-time viewers of the code
- Remove all excess imports, declarations, styles, etc. that are not being used prior to pushing your code
- Comment out non-functional or non-tested code prior to pushing your code
- Run pre-existing Unit and Cypress tests prior to pushing your code (see [Testing](#Testing) for more details)
- Write and run new Unit and Cypress tests for your added functionalities prior to pushing your code (see [Testing](#Testing) for more details)

### Installation

1. Ensure you have NodeJs installed: https://nodejs.org/en/download/
2. Install Meteor here: https://www.meteor.com/developers/install
3. Clone the repo `git clone https://github.com/justinthelaw/probe.git`
4. Inside the `/src` run `meteor npm install`
5. Read and completed the steps in the [Environment Variables](#Environment-Variables) section
6. Run `meteor run --port 3000`
7. Go to `http://localhost:3000` and you should see the test app running

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. Prior to development or deployments, the following environment variables must be defined in the `.env` file. A `.env.example` has been provided in the `~/src/private` as a template.

| Environment Variable | Description                               | Example Setting | Applicability |
| :------------------- | :---------------------------------------- | :-------------- | :------------ |
| ADMIN_PASSWORD       | Password for admin account in development | password        | server        |
| PROBE_API_KEY        | PROBE API access key                      | password        | server        |

### Access MongoDB

1. Local access on non-Docker build
2. Meteor application must be already running
3. In the command prompt run the following

```
meteor mongo
show collections
db.<collection name>.find()
```

### Build Exports

For docker image running and production, several exports are needed to estabish connections to hosted services and to set the node environment. The following are the variables must be specified prior to running PROBE.

| Variable  | Description                        | Example Setting                                |
| :-------- | :--------------------------------- | :--------------------------------------------- |
| NODE_ENV  | Build and runtime environment      | production                                     |
| ROOT_URL  | Base URL for hosted application    | localhost or https://your.personal.url         |
| MAIL_URL  | Hosted SMTPS                       | smtp://user:password@mailhost:port/            |
| MONGO_URL | Hosted MongoDB instance            | mongodb://user:password@host:port/databasename |
| PORT      | Exposed port (may not be required) | 3000                                           |

### Testing

#### Unit Testing

Unit testing uses React's testing-library. Please refer to the [testing-library](https://testing-library.com/docs/react-testing-library/intro/) documentation for more information on usage and behaviour.

#### Cypress Testing

Cypress testing is used for integration and UI/UX testing of PROBE. Please refer to the [Cypress](https://www.cypress.io/) documentation for more information on usage and behaviour.

### Docker Builds

**NOTE:** Please ensure that you have read and completed the steps in the [Environment Variables](#Environment-Variables) and [Build Exports](#Build-Exports) sections prior to attempting a Docker build/run.

#### Docker Development

The purpose of the Docker development build is to test a production build of the application, with conenctions to hosted services suchs as MongoDB and SMTPS. PM2 and alpine-node are used for load-balancing, app-management, and CSP/HTTP testing.

The Docker deployment is dependent on the `pm2.json` and `.env` files to describe the configuration of your meteor application. A pm2.example.json is provided for filling-in and a `.env.example` is provided for environmental variable configration as described in the [Environment Variables](#Environment-Variables) section of this README.

Paste and run the following commands at the root of the project to build and run a docker image of PROBE on http://localhost:3000.

```
chmod 777 scripts/build-dev.sh && scripts/build-dev.sh
docker run --rm --name probe --env-file src/private/.env -p 3000:3000 -t probe
```

#### Docker Production

The Docker production is dependent on the `.env` file to describe the configuration of your meteor application. A `.env.example` is provided for environmental variable configration as described in the [Environment Variables](#Environment-Variables) section of this README. A Docker.example.prod is provided as a template for filling-out hosted service URIs.

Paste and run the following commands at the root of the project to build and run a docker production image of PROBE.

```
chmod 777 scripts/build-prod.sh && scripts/build-prod.sh
```

#### Docker Errors

If you run into any build errors, please ensure you try all of the following before submitting an issue:

- Modify the commands in the scripts and this README based on your OS and terminal
- `docker system prune -f -a` to remove all old images and volumes
- `docker container prune -f` / `docker volume prune -f` / `docker builder prune -f -a` / `docker image prune -f -a`
- `docker rmi $(docker images --filter “dangling=true” -q --no-trunc)` to remove any dangling images that you don't need
- Restart Docker and/or restart your computer
- Logout and login to Docker
- Reset Docker to factory default settings
- Go to `~/.docker/config.json` and ensure that `credStore: "desktop.exe` is properly written into the file
- Check the Dockerfile and script to ensure relative paths lead to the correct files/folders

## Libraries

The following is a list of notable packages and technologies used to build this application. Those not listed are considered defaults for the Meteor or React frameworks.

### NPM

| Module/Library        | Environment | Description                          |
| :-------------------- | :---------- | :----------------------------------- |
| material-ui           | Development | Component library                    |
| formik                | Development | Form management library              |
| formik-material-ui    | Development | Formik + MUI compatability library   |
| react-swipeable-views | Development | Picture gallery component            |
| dotenv                | Development | Configuration .env reader            |
| meteor                | Runtime     | App adaptation library for Meteor    |
| react                 | Runtime     | Web-application framework            |
| react-dom             | Runtime     | DOM renderer for React               |
| yup                   | Runtime     | Object schema and validation library |
| use-debounce          | Runtime     | React debouncing hook                |
| helmet                | Runtime     | CSP and HTTP header security         |
| express               | Runtime     | HTTP utility methods                 |

### Meteor

| Module/Library    | Environment | Description                               |
| :---------------- | :---------- | :---------------------------------------- |
| mongo             | Runtime     | NoSQL database for Meteor                 |
| accounts-base     | Runtime     | Account management for Meteor             |
| accounts-password | Runtime     | Password management for Meteor            |
| alanning:roles    | Runtime     | Role management for Meteor                |
| ddp-rate-limiter  | Runtime     | Limits method call and subscription rates |
| underscore        | Runtime     | Extended higher-order methods             |

## License

This software is licensed under the [ISC](./LICENSE) license. For more terms, privacy policy, or questions, please contact the contributors directly.
