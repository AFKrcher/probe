#!/bin/bash

cd ./build && rm -rf src.tar.gz && rm -rf bundle
cd ../src && meteor build ../build
cd ../build && tar xzf src.tar.gz
docker build . -f Dockerfile.dev -t probe && cd ..