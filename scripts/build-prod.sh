#!/bin/bash

cd ./build && rm -rf src.tar.gz && rm -rf bundle
cd ../src && meteor npm install && meteor build ../build
cd ../build && tar xzf src.tar.gz
docker-compose up -d --env-file src/private/.env.dev