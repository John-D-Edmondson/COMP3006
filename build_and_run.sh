#!/bin/bash

# Build nodeserver image
docker build -t my-node-app:latest ./nodeserver

# Build websocket image
docker build -t websocket:latest ./websocket

# Build react-front-end image
docker build -t react-app:latest ./react/react-app

# Start services using Docker Compose
docker-compose up
