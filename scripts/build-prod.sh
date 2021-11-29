#!/bin/bash

# Install apt-get and meteor
echo "=> Installing meteor..."
curl https://install.meteor.com/ | sh
# Install node_modules required by meteor for building
echo "=> Installing dependencies required for build..."
cd ./src && meteor npm install --production --allow-superuser && yum install gcc-c++ -y && yum groupinstall 'Development Tools' -y
# Build the project into a .tar
echo "=> Running meteor build..."
meteor build ../build --allow-superuser
# Extract the .tar into the bundle
echo "=> Extracting build bundle from src.tar.gz..."
cd ../build && tar xzf src.tar.gz
# Install npm modules inside the bundle
echo "=> Installing node_modules inside of build bundle..."
cd bundle/programs/server && meteor npm install --production --unsafe-perm
# We now have a fully ready to deploy program with all npm dependencies installed