# Publicly Researched Observatory (PROBE)

[![Made with Meteor](https://forthebadge.com/images/badges/made-with-meteor.svg)](https://www.meteor.com/)
<a href="https://saberastro.com/" target="_blank" rel="noreferrer" ><img src="./.github/badges/maintained-by-saber-astronautics.svg" alt="Maintained by Saber Astronautics"/></a>

This open source project seeks to design a system that allows a community to maintain publicly sourced research and analysis data on satellites.

## Table of Contents

1.  [Overview](#Overview)
2.  [Usage](#Usage)
    - [Application](#Application)
    - [API Documentation](#API-Documentation)
3.  [How To Contribute](#How-To-Contribute)
    - [MMB](#Mission-Management-Board)
    - [Git](#Git)
    - [Coding Standards](#Coding-Standards)
    - [Installation](#Installation)
    - [Access MongoDB](#Access-MongoDB)
    - [Environment Variables](#Environment-Variables)
    - [Testing](#Testing)
    - [Builds](#Builds)
4.  [Libraries](#Libraries)
    - [NPM](#NPM)
    - [Meteor](#Meteor)
5.  [License](#License)
6.  [Credits](#Credits)

## Overview

The main focus of this application is data entry experience, data validation, and api useability. In order to focus on those 3 core priorities, a MeteorJS framework was used to set-up and deploy the application. Meteor/WebApp and Meteor/Mongo were used in conjunction with ReactJS to provide a seamless stack that exposes a user-friendly frontend and api for the community to use. A custom combination of vanilla JS, Yup and Formik provide dynamic schema creation and data validation.

- Database: Meteor/MongoDB
- Client: ReactJS
- Server: Meteor/WebApp
- Repository: [GitHub](https://github.com/AFKrcher/PSRA)
- Staging Deployment: [PROBE](https://probe-staging.herokuapp.com)
- Live Deployment: [PROBE](https://probe.saberastro.com)

## Usage

### Application

The application should be intuitive and easy-to-use, even for a first-time user. If something is not clear, tooltips, keys, and captions are sprinkled throughout the application to guide the user on how things work. If you think the UI/UX is not user-friendly enough, please submit an issue and a suggestion on how we can fix it.

### API Documentation

HTTP requests made to the PROBE public API routes are limited to 500/hour. Requests that go beyond this limit will experience a 1 hour cool-down period before more requests can be made. HTTP requests made to the PROBE partner API routes have no limits.

### Public API

The public API allows all users to obtain information on satellites and schemas produced by PROBE. Queries in the form of GET requests can be made to obtain specific satellites or schemas. POST, DELETE, PUT, and PATCH requests are not allowed to the public. Below is a list of example requests:

<details>
<summary>Click to expand Public API details</summary>

#### Welcome Message

GET: `/api/`

RESPONSE: `"Welcome to the PROBE public API! For documentation, please visit the README at https://github.com/afkrcher/probe#api-documentation."`

---

#### Health Check

GET: `/api/test`

RESPONSE: `Test successful! This is the endpoint URL: http://localhost:3000/api/test.`

---

#### Satellites

All public API requests are limited to 100 results per query. If your query returns more than 100 results, you must either redefine your query to be more specific or request another page of results in a follow-up query.

GET (default limit = 20, default page = 1): `/api/satellites`

GET (default limit = 20, default page = 1): `/api/satellites?limit=20&page=1`

GET (default limit = 20, default page = 1, full or partial name): `/api/satellites?name=International`

GET (default limit = 20, default page = 1, full or partial NORAD ID): `/api/satellites?name=25544`

GET (default limit = 20, default page = 1, full or partial orbit): `/api/satellites?name=LEO`

GET (default limit = 20, default page = 1, full or partial type): `/api/satellites?name=research`

GET (default limit = 20, default page = 1, full date with 3-letter month abbreviation _DD-MMM-YYYY_): `/api/partner/:key/satellites?modifiedAfter=18-Oct-2021`

RESPONSE:

```json
{
  "total": 50, // total number of results that match your query
  "returned": 20, // number of results shown on the page
  "page": "1 / 3", // page number
  "result": [
    {
      "_id": "fTTviYiQRoMLdR3RC",
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
              "name": "",
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
            }
          ],
          "validated": [
            {
              "method": "user",
              "name": "admin",
              "validated": true,
              "validatedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
            }
          ],
          "descriptionShort": "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA."
        }
      ],
      ... // more data
    },
    ... // 20 more related satellites
  ]
}
```

---

#### Schemas

There are no limits on the amount of schemas that can be returned from a query.

GET: `/api/schemas`

GET (full or partial name): `/api/schemas?name=names`

RESPONSE:

```json
{
  "total": 20, // total number of results that match your query
  "returned": 20, // number of results shown on the page
  "page": "1 / 1", // page number,
  "results": [
      {
      "_id": "fTTviYiQRoMLdRC26",
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
}
```

</details>

### Partner API

The partner API allows registered partners with PROBE API keys to go beyond the public API GET requests. The partner API is used mainly for PATCH, POST, DELETE, and special GET requests. GET requests using the partner API have no limits on results per page.

All POST, PATCH, DELETE, or PUT requests are processed by the server and reflected in the web application asynchronously. You will need to perform a GET request or visit the web application to confirm the success of your requests.

All POST, PATCH, DELETE, or PUT requests made with improper format will respond with: `You must provide a request body IAW the PROBE API documentation.`

<details>
<summary>Click to expand Partner API details</summary>

#### Welcome Message

GET (POST, DELETE, PUT, PATCH): `/api/partner/:key`

RESPONSE: `"Welcome PROBE partner! There are <# OF ENDPOINTS> <REQUEST TYPE> endpoints on this route. For documentation, please visit the README at https://github.com/afkrcher/probe#api-documentation."`

---

#### Errors

GET: `/api/partner/:key/errors`

RESPONSE:

```json
[
    {
        "_id": "rWpQxiu37AyQAs9gP",
        "user": "Not Logged-In",
        "time": "2021-10-21T19:32:43.391Z",
        "msg": "Database Reset",
        "source": "Test Error",
        "error": {}
    },
    {
        "_id": "g2dAKHM2dRyWcyD8M",
        "user": "hM7zz8qJn7cRWkGaA",
        "time": "2021-10-21T19:32:43.382Z",
        "msg": "Uncaught TypeError: e.replace is not a function",
        "source": "http://localhost:8080/<source> on line 73502 at character 6450"
    },
    ... // more errors
]
```

---

#### Users

GET: `/api/partner/:key/users`

RESPONSE:

```json
[
    {
        "_id": "bwAqW5YGPSLGuqY86",
        "createdAt": "2021-10-21T19:32:43.456Z",
        "username": "admin",
        "emails": [
            {
                "address": "admin@saberastro.com",
                "verified": false
            }
        ],
        "favorites": [
            "25544"
        ]
    }
    ... // more users
]
```

---

PATCH: `/api/partner/:key/users`

BODY:

```json
{
  "user": {
    "username": "user", //required
    "_id": "bwAqW5YGPSLGuqY87" // required
  },
  "role": "admin" // required, must be one of the following: dummies, moderator, machine, admin
}
```

RESPONSE:

`bwAqW5YGPSLGuqY87 added to role: admin`

---

#### Satellites

GET (no default limit, default page = 1): `/api/partner/:key/satellites`

GET (no default limit, default page = 1): `/api/partner/:key/satellites?limit=500&page=1`

GET (no default limit, default page = 1, full or partial name): `/api/partner/:key/satellites?name=International`

GET (no default limit, default page = 1, full or partial NORAD ID): `/api/partner/:key/satellites?name=25544`

GET (no default limit, default page = 1, full or partial orbit): `/api/partner/:key/satellites?name=LEO`

GET (no default limit, default page = 1, full or partial type): `/api/partner/:key/satellites?name=research`

GET (no default limit, default page = 1, full date with 3-letter month abbreviation _DD-MMM-YYYY_): `/api/partner/:key/satellites?modifiedAfter=18-Oct-2021`

RESPONSE:

```json
{
  "total": 500, // total number of results that match your query
  "returned": 500, // number of results shown on the page
  "page": "1 / 1", // page number
  "result": [
    {
      "_id": "fTTviYiQRoMLdR3RC",
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
              "name": "",
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
            }
          ],
          "validated": [
            {
              "method": "user",
              "name": "admin",
              "validated": true,
              "validatedOn": "Mon Oct 18 2021 07:25:26 GMT-0700 (Pacific Daylight Time)"
            }
          ],
          "descriptionShort": "The International Space Station is a modular space station in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA."
        }
      ],
      ... // more data
    },
    ... // more related satellites
  ]
}
```

---

POST: `/api/partner/:key/satellites`

BODY:

```json
{
  "noradID": "99999", // required
  "names": [
    // required
    {
      "reference": "https://www.test.com",
      "name": "Test"
    }
  ]
}
```

RESPONSE:

`Satellite of NORAD ID 99999 is being processed by PROBE. Visit probe.saberastro.com/dashboard/99999 to see the new satellite once processing is complete.`

---

PATCH: `/api/partner/:key/satellites/machineCheck`

BODY:

```json
{
  "noradID": "99999", // required
  "schema": "names", // required
  "entry": "3", // required
  "type": "verification" // required, must be one of the following: verification, verify, validation, validate
}
```

RESPONSE:

`You've successfully provided the right information for this satellite $verification request! Unfortunately, this route is currently under construction.`

#### Schemas

GET: `/api/partner/:key/schemas`

GET (full or partial name): `/api/schemas?name=names`

RESPONSE:

```json
{
  "total": 20, // total number of results that match your query
  "returned": 20, // number of results shown on the page
  "page": "1 / 1", // page number,
  "results": [
      {
      "_id": "fTTviYiQRoMLdRC26",
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
}
```

</details>

## How To Contribute

### Mission Management Board

If you want to contribute, consider signing-up for an account on Saber Astronautics' [Mission Management Board (MMB) web application](https://mmb.saberastro.com). Once you havesigned-up, open an issue on Github asking for access to the PROBE board. There, you can view the running backlog of user stories as well as documentation on completed efforts.

### Git Processes

1. Fork and clone the repository based on the [Installation](#Installation) instructions
2. Ensure you have fetched and pulled the latest master/main branch of the repository
3. Set-up your feature branches to the following standard: `feature/<feature name>-<username>`
4. Ensure that any libraries or technologies that you use are properly listed in the dependency tree and in this README's [Libraries](#Libraries) section
5. Contribute to the main/master repository through clear and succinct pull requests on GitHub
   - Use the pull request templates as written in the [.github/PULL_REQUEST_TEMPLATE](./.github/PULL_REQUEST_TEMPLATE) directory
6. When not contributing code directly, generate clear and succinct issues on GitHub
   - Use the issues templates as written in the [.github/ISSUE_TEMPLATE](./.github/ISSUE_TEMPLATE) directory

### Coding Standards

The list below is meant to be a guide and not a rule-book. Please try your best to use this guide to build code that is readable and easy-to-understand for all contributors:

- Use Prettier (preferred) or any other code formatting/linting extension to format your code properly
  - The `package.json` in this repo is where all formatting/linting extension options should be configured
- Use comments to explain code that may result in a "why" or "how" from first-time viewers
- Remove all excess imports, declarations, styles, etc. that are not being used prior to pushing your code
- Comment out non-functional or non-tested code prior to pushing your code
- Run pre-existing Unit and Cypress tests prior to pushing your code (see [Testing](#Testing) for more details)
- Write and run new Unit and Cypress tests for your added functionalities prior to pushing your code (see [Testing](#Testing) for more details)

### Installation

Instructions for system dependencies and running the application in a non-Docker, local instance.

1. Ensure you have NodeJs installed: https://nodejs.org/en/download/
2. Install Meteor here: https://www.meteor.com/developers/install
3. Clone the repo `git clone https://github.com/afkrcher/probe#api-documentation.git`
4. Inside the `/src` run `meteor npm install`
5. Read and complete the steps in the [Environment Variables](#Environment-Variables) section
6. Run `meteor run`
7. Go to `http://localhost:3000` and you should see the test app running

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` in `~/src/private`. These variables and their usage are shown
in the table below.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. Prior to development or deployments, the following environment variables must be defined in the `.env` file. A `.env.example` has been provided in the `~/src/private` as a template.

**IMPORTANT**

For _DEVELOPMENT_ testing:

- A `.env.dev` must be created from the `.env.example` prior to a `meteor run` or a Docker development build with `scripts/build-dev.sh`

For _STAGING_ builds:

- A `.env.staging` must be created from the `.env.example` prior to a Heroku staging build build with `scripts/build-staging.sh`

For _PRODUCTION_ deployments:

- A `.env.prod` must be created from the `.env.example` prior to a Docker production build with `scripts/build-prod.sh`

| Environment Variable           | Description                               | Example Setting                      |
| :----------------------------- | :---------------------------------------- | :----------------------------------- |
| ADMIN_PASSWORD                 | Password for admin account in development | password                             |
| PROBE_API_KEY                  | PROBE API access key                      | password                             |
| PORT                           | Exposed port (may not be required)        | 3000                                 |
| ROOT_URL                       | Base URL for application                  | http://localhost                     |
| MAIL_URL                       | Hosted SMTPS                              | smtps://user:password@mailhost:port/ |
| MONGO_URL\*                    | Hosted MongoDB instance                   | mongodb://mongo:27017/database       |
| MONGO_INITDB_ROOT_USERNAME\*\* | MongoDB initial user                      | probe                                |
| MONGO_INITDB_ROOT_PASSWORD\*\* | MongoDB initial user password             | password                             |
| METEOR_APP_DIR\*\*\*           | Staging environment buildpack variable    | src/                                 |

\*Only required for builds that reach out to a hosted MongoDB instance

\*\*Only required for builds that have the application connect to a containerized MongoDB instance

\*\*\*Only required for staging builds using Heroku's Meteor buildpack

### Access MongoDB

1. Local access on non-Docker instance
2. Meteor application must be already running
3. In the command prompt run the following

```
meteor mongo
show collections
db.<collection name>.find()
```

### Testing

#### API Testing

A basic HEALTHCHECK route is provided by the API. Visiting `baseUrl + "/api/test"` or `baseUrl + /api/partner/:key/test` should return an HTTP status of 200 and a "Test Successful..." message. Live API testing using an HTTP request-capable client must be done after route or server configuration modifications.

#### Unit Testing

Unit testing uses React's testing-library, mocha, and chai. Please refer to the [testing-library](https://testing-library.com/docs/react-testing-library/intro/), [Meteor Mocha](https://guide.meteor.com/testing.html#mocha), and [Chai](https://www.chaijs.com/) documentation for more information on usage and behaviour.

#### Cypress Testing

Cypress testing is used for integration and UI/UX testing of PROBE. Please refer to the [Cypress](https://www.cypress.io/) documentation for more information on usage and behaviour.

### Builds

**NOTE:** Please ensure that you have read and completed the steps in the [Environment Variables](#Environment-Variables) section prior to attempting a Docker build or Docker run.

#### Docker Development

The purpose of the Docker development build is to locally test a meteor-built instance of the application, with connections to hosted services such as MongoDB and SMTPS. PM2 and alpine-node are used for optional load-balancing, app-management, and CSP/HTTP testing. PM2 configuration settings can be modified in the `pm2.json` file.

This Docker build is dependent on the `pm2.json` and `.env` files to describe the configuration of your meteor application. A pm2.json is provided for optional configuration and a `.env.example` is provided in `~/src/private` for environmental variable configuration as described in the [Environment Variables](#Environment-Variables) section of this README.

Paste and run the following command at the root of the project to build and run a docker image of PROBE on http://localhost:3000. Please note that `chmod +x` may not be necessary to run the bash script.

```
chmod +x scripts/build-dev.sh && scripts/build-dev.sh
```

#### Heroku Staging

The purpose of the Heroku staging build is to test a hosted instance of the application, with connections to hosted services such as MongoDB and SMTPS. Heroku, which is a PaaS that runs on AWS under the hood, is used to test the application's security and speed while hosted on a cloud-based DevOps solution.

This Heroku staging build is dependent on the `.env.staging`. A `.env.example` is provided in `~/src/private` for environmental variable configuration as described in the [Environment Variables](#Environment-Variables) section of this README. If you are not a core contributor with access to the Heroku instance, you will need to sign-up for Heroku and make a new Heroku app to remote deploy to your own staging environment. If you generate your own Heroku app, please ensure that you change the `~/scripts/build-staging.sh` file to fit the git remote command.

After git commiting your changes you can paste and run the following command at the root of the project to build and run a hosted instance of PROBE on https://probe-staging.herokuapp.com. Please note that `chmod +x` may not be necessary to run the bash script.

```
chmod +x scripts/build-staging.sh && scripts/build-staging.sh
```

#### Docker Compose

The purpose of the Docker compose build is to generate production ready containers with images of PROBE and MongoDB. The `docker-compose.yaml` can be run in a hosted instance or as a reference to configure the PROBE stack for other production deployment methods.

The Docker compose build is dependent on the `.env` file to describe the configuration of your meteor application. A `.env.example` is provided for environmental variable configration as described in the [Environment Variables](#Environment-Variables) section of this README. The `.env.prod` and `docker-compose.yml` must be configured properly in order to run on your deployment platform of choice. If your deployment does not use docker-compose or Docker at all, please be sure to reference the Dockerfiles, bash scripts, and environmental variables.

Paste and run the following command at the root of the project to build and run a docker production image of PROBE using docker-compose. DO NOT use the `scripts/build-prod.sh`, as this script is for the Docker container's entrypoint.

```
docker-compose --env-file src/private/.env.prod up --build
```

#### Build Errors

General build errors may be resolved by checking the following:

- Ensure that you run the commands noted above at the root of the project
- Ensure you have followed all installation and build instructions
- Modify the commands in the scripts and this README based on your OS and terminal

Docker-specific build errors may be resolved by checking the following:

- `docker system prune -f -a` to remove all old images and volumes
- `docker container prune -f` / `docker volume prune -f` / `docker builder prune -f -a` / `docker image prune -f -a`
- `docker rmi $(docker images --filter “dangling=true” -q --no-trunc)` to remove any dangling images that you don't need
- Restart Docker and/or restart your computer
- Logout and log back into your Docker account
- Ensure you have access to Iron Bank; if not, see the Dockerfile comments
- Reset your Docker client to factory default settings
- Go to `~/.docker/config.json` and ensure that `credStore: <storage environment>` is properly written into the file
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
| meteor                | Runtime     | App adaptation library               |
| react                 | Runtime     | Web-application framework            |
| react-dom             | Runtime     | DOM renderer for React               |
| yup                   | Runtime     | Object schema and validation library |
| use-debounce          | Runtime     | React debouncing hook                |
| helmet                | Runtime     | CSP and HTTP header security         |
| express               | Runtime     | JS framework for API                 |
| express-rate-limiter  | Runtime     | Rate limiter for API requests        |

### Meteor

| Module/Library    | Environment | Description                   |
| :---------------- | :---------- | :---------------------------- |
| mocha             | Development | Testing library               |
| mongo             | Runtime     | NoSQL database                |
| accounts-base     | Runtime     | Account management            |
| accounts-password | Runtime     | Password management           |
| alanning:roles    | Runtime     | Role management               |
| ddp-rate-limiter  | Runtime     | Time and call limiter         |
| underscore        | Runtime     | Extended higher-order methods |

## License

This software is licensed under the [ISC](./LICENSE) license. For more terms, privacy policy, or questions, please contact the contributors directly.

## Credits

Upon running the app on your local machine or opening it at https://probe.saberastro.com/about, you will find the pictures, roles, and contact information of the founders and core contributors of PROBE. Only founders and core contributors are listed on the PROBE about page.
