FROM node:14

WORKDIR /Users/antov/multimedia-app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]