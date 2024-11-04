FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 3001

RUN npm install -g nodemon

CMD ["nodemon", "--exec", "ts-node", "src/app.ts"]