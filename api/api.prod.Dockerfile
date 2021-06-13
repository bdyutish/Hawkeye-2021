
FROM node:alpine as API_BUILDER

WORKDIR /usr/src/api
COPY  package*.json ./

RUN npm ci

COPY . .

# CMD ["npm", "run", "build"]
RUN npm run build

FROM node:alpine
COPY --from=API_BUILDER /usr/src/api/dist/ /usr/src/api/
# COPY --from=API_BUILDER /usr/src/api/node_modules /usr/src/api/
COPY  package*.json ./

RUN npm ci


RUN ls
WORKDIR /usr/src/api

CMD ["node","index.js"]
