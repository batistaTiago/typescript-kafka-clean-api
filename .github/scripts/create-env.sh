#!/bin/bash

touch .env;
echo APP_NAME='app' >> .env;
echo APP_SALT_ROUNDS=12 >> .env;
echo APP_PREFERRED_DATABASE=mongodb >> .env;
echo APP_DEBUG=true >> .env;
echo APP_SECRET_KEY='app_secret_key' >> .env;
echo APP_AUTH_TOKEN_DURATION_DAYS=7 >> .env;
echo API_PORT=5000 >> .env;
echo MYSQL_HOST="mysql" >> .env;
echo MYSQL_PORT=3306 >> .env;
echo MYSQL_USER="user" >> .env;
echo MYSQL_PASSWORD="sqlP4SS" >> .env;
echo MYSQL_DB_NAME="db" >> .env;
echo MONGO_CONNECTION_URI='mongodb://host.docker.internal:27017/app' >> .env;
echo REDIS_HOST='host.docker.internal' >> .env;
echo REDIS_PORT=6379 >> .env;
echo REDIS_PASSWORD='' >> .env;
echo KAFKA_BROKERS='kafka:29092' >> .env;
echo KAFKA_CONSUMER_BASE_GROUP_ID='APP_CONSUMER_GROUP' >> .env;
echo MAIL_FROM='Batista' >> .env;
echo MAIL_SERVER='smtp.gmail.com' >> .env;
echo MAIL_PORT=465 >> .env;
echo MAIL_USERNAME='python.email.smtp.modules@gmail.com' >> .env;
echo MAIL_PASSWORD='mybdrznvpjktvhez' >> .env;
cat .env;