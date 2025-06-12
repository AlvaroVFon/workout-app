FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN yarn install && yarn cache clean

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
