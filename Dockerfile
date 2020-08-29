FROM node:12

# Create app directory
WORKDIR /usr/src/api

COPY package*.json ./

RUN yarn install

COPY server server

ENV JWT_SECRET=${JWT_SECRET}

ENV MIGRATE_dbConnectionUri=${MIGRATE_dbConnectionUri}

ENV PORT=${PORT}

ENV DB_PORT=${DB_PORT}

ENV DB_HOSTNAME=${DB_HOSTNAME}

ENV DB_NAME=${DB_NAME}

CMD [ "yarn", "start" ]
