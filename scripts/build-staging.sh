#!/bin/bash

# Login to Heroku
echo "=> Logging into Heroku..."
heroku login
# Change this remote line based on your Heroku instance
echo "=> Remote into https://probe-staging.herokuapp.com..."
heroku git:remote -a probe-staging
# Use meteor buildpack
echo "=> Setting buildpack to heroku meteor-buildpack-horse..."
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git
# Set environment variables
echo "=> Setting environment variables from ~/src/private/.env.staging...."
heroku config:set $(grep -v '^#' ./src/private/.env.staging | xargs)
heroku config:set NODE_ENV=staging
# Deploy Heroku and display deployment logs
echo "=> Deploying to Heroku..."
cd ./src && git push heroku main && echo "=> Successfully deployed to Heroku!"