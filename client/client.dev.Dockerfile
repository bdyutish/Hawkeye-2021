FROM node:alpine

WORKDIR "/usr/src/client"

COPY ./package.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]