FROM node:16-alpine3.12

WORKDIR /app

#COPY ./ ./
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./app.js ./
RUN npm install


#RUN npm install

CMD ["node", "app.js"]
