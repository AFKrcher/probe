#!/bin/bash

# Remove any old bundles
cd ./build && rm -rf src.tar.gz && rm -rf bundle
# Build the project into a .tar
cd ../src && meteor npm install --production && meteor build ../build
# Extract the .tar into the bundle
cd ../build && tar xzf src.tar.gz
# Install npm modules inside the bundle
cd bundle/programs/server && meteor npm install --production
# We now have a fully ready to deploy program with all npm dependencies installed.

