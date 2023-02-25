FROM node:18-bullseye-slim
WORKDIR /usr/app

COPY package.json .

# analisar necessidade de --force no cache clean abaixo
# RUN npm install --omit-dev --legacy-peer-deps && npm cache clean 

RUN npm install --omit-dev --legacy-peer-deps

COPY ./dist ./dist

COPY .env .