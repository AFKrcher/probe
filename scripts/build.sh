#!/bin/bash

cd ./build && rm -rf src.tar.gz && rm -rf bundle;
cd ..;
cd ./src && meteor build ../build && cd ../build && tar xzf src.tar.gz && docker build -t probe .;