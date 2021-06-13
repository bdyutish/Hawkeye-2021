
FROM node:alpine as API_BUILDER

WORKDIR /usr/src/api
COPY  package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "build"]

FROM node:alpine

COPY --from=API_BUILDER /usr/src/api/dist /usr/src/api/

WORKDIR /usr/src/api

CMD ["node","index.js"]