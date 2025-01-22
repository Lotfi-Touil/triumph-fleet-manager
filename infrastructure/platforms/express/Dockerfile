FROM node:18

WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./
COPY infrastructure/platforms/express/package*.json ./
COPY infrastructure/adapters/package*.json ./infrastructure/adapters/
COPY application/package*.json ./application/
COPY domain/package*.json ./domain/

# Install dependencies
RUN npm install
RUN cd infrastructure/adapters && npm install
RUN cd application && npm install
RUN cd domain && npm install

# Copy source code
COPY . .

ENV NODE_ENV=production

EXPOSE 3001

RUN npm install -g nodemon

WORKDIR /usr/src/app/infrastructure/platforms/express

CMD ["nodemon", "--exec", "ts-node", "src/app.ts"]