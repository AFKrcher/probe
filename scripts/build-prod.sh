#!/bin/bash

# Remove any old bundles
echo "=> Removing any old meteor build bundles..."
cd ./build && rm -rf src.tar.gz && rm -rf bundle
# Build the project into a .tar
echo "=> Installing node_modules and building application..."
cd ../src && meteor npm install --production --allow-superuser  && meteor build ../build --allow-superuser
# Extract the .tar into the bundle
echo "=> Extracting bundle from src.tar.gz..."
cd ../build && tar xzf src.tar.gz
# Install npm modules inside the bundle
echo "=> Installing node_modules inside bundle..."
cd bundle/programs/server && meteor npm install --production --allow-superuser
# We now have a fully ready to deploy program with all npm dependencies installed