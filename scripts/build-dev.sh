#!/bin/bash

# Remove any old bundles
cd ./build && rm -rf src.tar.gz && rm -rf bundle
# Build the project into a .tar
cd ../src && meteor npm install --production && meteor build ../build
# Extract the .tar into the bundle
cd ../build && tar xzf src.tar.gz
# Docker build using Dockerfile.dev
docker build . --rm -f Dockerfile.dev -t probe-dev
# Docker run with .env file
cd .. && docker run --rm --name probe --env-file src/private/.env.dev -p 3000:3000 -t probe-dev