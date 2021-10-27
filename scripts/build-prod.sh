#!/bin/bash

cd ./build && rm -rf src.tar.gz && rm -rf bundle
cd ../src && meteor npm install --production && meteor build ../build
cd ../build && tar xzf src.tar.gz
cd .. && docker-compose --env-file src/private/.env.prod up --build
