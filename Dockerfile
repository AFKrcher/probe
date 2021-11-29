# First build stage will need to use hardened artifacts if it is to be Iron Bank-compliant
FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs14@sha256:1aa1227b8c3b3adf19280ce88a67ecf696d598ae94c8dbd3253415aa5efb8983 AS BUILD_STAGE
LABEL org.opencontainers.image.authors="justinthelaw@gmail.com"

USER root
RUN dnf install -y python2 gcc-c++ make 

WORKDIR /app
COPY . .
RUN ./scripts/build-prod.sh

# If you don't have access to Iron Bank, just use the node:14.16.1 image from Docker
FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs14@sha256:1aa1227b8c3b3adf19280ce88a67ecf696d598ae94c8dbd3253415aa5efb8983

USER root

WORKDIR /app
COPY --from=BUILD_STAGE /app/build/bundle .

EXPOSE 3000
HEALTHCHECK NONE
ENTRYPOINT ["node", "/app/main.js", "--v"]
