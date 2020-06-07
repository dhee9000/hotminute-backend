FROM node:slim as dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM dependencies as app
WORKDIR /app
COPY . .
COPY ./keys/firebaseAdminKey.json ./keys/firebaseAdminKey.json
EXPOSE 80
EXPOSE 443
RUN ls
ENTRYPOINT yarn start