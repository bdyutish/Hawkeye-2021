FROM node:10.19.0

WORKDIR "/usr/src/client"

COPY ./package.json ./
RUN npm install -g npm@7.13.0
RUN npm install --force

#f
COPY . .

CMD ["npm", "run", "start"]