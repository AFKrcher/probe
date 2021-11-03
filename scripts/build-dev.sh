#!/bin/bash

# Remove any old bundles
echo "=> Removing any old meteor build bundles..."
cd ./build && rm -rf src.tar.gz && rm -rf bundle
# Build the project into a .tar
echo "=> Installing node_modules and building application..."
cd ../src && meteor npm install --production && meteor build ../build
# Extract the .tar into the bundle
echo "=> Extracting bundle from src.tar.gz..."
cd ../build && tar xzf src.tar.gz
# Docker build using Dockerfile.dev
echo "=> Running docker build with the Dockerfile.dev..."
docker build . --rm -f Dockerfile.dev -t probe-dev
# Docker run with .env file
echo "=> Spinning up docker image with name \"probe\"..."
cd .. && docker run --rm --name probe --env-file src/private/.env.dev -p 3000:3000 -t probe-dev