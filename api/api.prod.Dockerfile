FROM node:alpine as API_BUILDER

WORKDIR /usr/src/api
COPY  package*.json ./

# installing only dev dependencies
RUN npm install -D
COPY . .

RUN npm run build

FROM node:alpine

WORKDIR /usr/src/api
COPY --from=API_BUILDER /usr/src/api/dist /usr/src/api/dist
COPY --from=API_BUILDER /usr/src/api/package.json /usr/src/api/
# COPY --from=API_BUILDER /usr/src/api/package-lock.json /usr/src/api/
# COPY --from=API_BUILDER /usr/src/api/node_modules /usr/src/api/node_modules
# COPY  package*.json ./
RUN npm install --only=prod

# RUN npm ci
# RUN cat /usr/src/api/index.js
RUN ls /usr/src/api/
# RUN chmod +x .

CMD ["npm","start"]
