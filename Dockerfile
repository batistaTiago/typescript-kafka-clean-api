FROM node:18
WORKDIR /usr/app

COPY ./package.json .
RUN npm install --legacy-peer-deps

COPY ./tsconfig.json .
