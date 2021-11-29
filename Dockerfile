# First build stage will need to use hardened artifacts if it is to be Iron Bank-compliant
FROM registry1.dso.mil/ironbank/redhat/ubi/ubi8@sha256:4a2cdd6fe88ad3d405d3b39ba529e419a57e90fc839d4cf42c15272e92a20521 AS BUILD_STAGE
LABEL org.opencontainers.image.authors="justinthelaw@gmail.com"

USER root

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
