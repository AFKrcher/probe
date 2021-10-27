#!/bin/bash

cd ./build && rm -rf src.tar.gz && rm -rf bundle
cd ../src && meteor npm install --production && meteor build ../build
cd ../build && tar xzf src.tar.gz
docker build . --rm -f Dockerfile.dev -t probe-dev
cd .. && docker run --rm --name probe --env-file src/private/.env.dev -p 3000:3000 -t probe-dev