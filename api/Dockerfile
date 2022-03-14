FROM node:16.14.0-alpine3.14 AS build-stage

WORKDIR /usr/app

COPY package*.json ./
RUN yarn install

COPY src src
COPY tsconfig*.json ./
COPY config*.json ./
RUN npm run build

WORKDIR /usr/app/build
ENV NODE_ENV=production
RUN chown node:node .
USER node
EXPOSE 3030
ENTRYPOINT [ "node", "src/index.js" ]