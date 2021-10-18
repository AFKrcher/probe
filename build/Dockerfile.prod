# Pull base image.
FROM mhart/alpine-node:14

# Install build tools to compile native npm modules
RUN apk update \
	&& apk upgrade \
	&& apk add build-base python bind-tools  libxml2-utils libxslt

# Create app directory
RUN mkdir -p /app

# Copy meteor build bundle
COPY bundle /app

# Build for the image
RUN cd /app/programs/server && npm install --production
FROM keymetrics/pm2:14-alpine
RUN mkdir -p /app
RUN mkdir -p /usr/pm2
COPY pm2.json /usr/pm2
COPY --from=0 /usr/bin/node /usr/bin/
COPY --from=0 /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=0 /app /app

EXPOSE 3000

# Final run command
CMD ["pm2-runtime", "/usr/pm2/pm2.json"]