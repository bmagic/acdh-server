FROM node

WORKDIR /usr/src/acdh-server
COPY package.json .
RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]