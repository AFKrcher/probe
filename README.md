# Publicly Researched Observatory (PROBE)

This open source project seeks to design a system that allows a community to maintain publicly sourced research and analysis data on satellites.

## Table of Contents

1.  [Overview](#Overview)
2.  [How To Contribute](#How-To-Contribute)
3.  [Libraries](#Libraries)
4.  [License](#License)

## Overview

The main focus of this application is data entry experience, data validation, and api useability. In order to focus on those 3 core priorities, a MeteorJS framework was used to set-up and deploy the application. Meteor/WebApp and Meteor/Mongo were used in conjunction with ReactJS to provide a seamless stack that exposes a user-friendly frontend and api for the community to interact with. A custom combination of vanilla JS, Yup and Formik provide dynamic schema creation and data validation.

- Database: Meteor/MongoDB
- Client: ReactJS
- Server: Meteor/WebApp
- Repository: [GitHub](**URL here**)
- Deployment: [Meteor](**URL here**)

## How To Contribute

### Git and GitHub

1. Fork and clone the repository using standard Git and Github commands
2. Ensure you have fetched and pulled the latest master/main branch of the repository
3. Set-up your feature branches to the following standard: `feature/<feature name>-<GitHub username>`
4. Ensure that any libraries or technologies that you use are properly listed in the dependency tree and in this README's [Libraries](#Libraries) section
5. Contribute to the main/master repository through clear and succinct pull requests
6. When not contributing code directly, generate issues on GitHub with context, problem statement, and, if possible, a suggested solution or target

### Installation

1. Ensure you have NodeJs installed: https://nodejs.org/en/download/
2. Install Meteor here: https://www.meteor.com/developers/install
3. Clone the repo `git clone https://bitbucket.org/saber-astronautics-usa/psra.git`
4. Inside the src folder run `meteor npm install`
5. Run `meteor`
6. Go to `http://localhost:3000` and you should see the test app running.

### Access MongoDB

1. Meteor must be running
2. In the command prompt run
   `meteor mongo`
   `show collections`
   `db.<collection name>.find()`

### Deployment

Deployment is done using Meteor Cloud. To deploy to the free cluster, all you have to do is call:

`meteor deploy psra.meteorapp.com --free --mongo`

Deployment is reserved for core contribtors. If your feature is successfully merged with the main production branch, then at the next release, a core contributor will deploy the build to Meteor.

## Libraries

The following is a list of notable packages and technologies used to build this application.

### NPM

| Module/Library     | Environment | Description                            |
| :----------------- | :---------- | :------------------------------------- |
| meteor             | Runtime     | App adaptation library for Meteor      |
| react              | Runtime     | Web-application framework              |
| react-dom          | Runtime     | DOM renderer for React                 |
| material-ui        | Development | Component library                      |
| formik             | Development | Form management library                |
| formik-material-ui | Development | Formik + MUI compatability library     |
| yup                | Runtime     | Object schema and validation library   |
| yup-ast            | Runtime     | yup abstract syntax tree compatability |
| validator          | Runtime     | String validation library              |

### Meteor-Specific

| Module/Library    | Environment | Description                    |
| :---------------- | :---------- | :----------------------------- |
| mongo             | Runtime     | NoSQL database for Meteor      |
| accounts-base     | Runtime     | Account management for Meteor  |
| accounts-password | Runtime     | Password management for Meteor |
| alanning:roles    | Runtime     | Role management for Meteor     |

## License

This software is licensed under the [ISC](./LICENSE) license. For more terms, privacy policy, or questions, please contact the contributors directly.
