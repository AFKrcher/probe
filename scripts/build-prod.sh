#!/bin/bash

# Remove any old bundles
echo "=> Removing any old meteor build bundles..."
cd ./build && rm -rf src.tar.gz && rm -rf bundle
# Install apt-get and meteor
echo "=> Installing meteor..."
yum install curl -y && (curl https://install.meteor.com/ | sh)
# Install node_modules required by meteor for building
echo "=> Installing node_modules required for meteor build..."
cd ../src && meteor npm install --production --allow-superuser
# Build the project into a .tar
echo "=> Running meteor build..."
meteor build ../build --allow-superuser
# Extract the .tar into the bundle
echo "=> Extracting build bundle from src.tar.gz..."
cd ../build && tar xzf src.tar.gz
# Install npm modules inside the bundle
echo "=> Installing node_modules inside build bundle..."
# cd bundle/programs/server && meteor npm install --production --allow-superuser
# We now have a fully ready to deploy program with all npm dependencies installed