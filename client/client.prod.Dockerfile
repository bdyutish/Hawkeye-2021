FROM node:10.19.0 AS builder

WORKDIR /usr/src/client

ENV NODE_ENV production

COPY package*.json ./
RUN npm install -g npm@7.13.0
RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/src/client/build /usr/share/nginx/html

CMD /bin/sh -c "cat /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"