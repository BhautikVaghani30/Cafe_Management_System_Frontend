FROM node:latest as build

WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package.json ./
COPY package-lock.json ./

RUN npm install -f

COPY . .

RUN npm run build --prod

FROM nginx:latest

COPY --from=build /app/dist/Frontend /usr/share/nginx/html

EXPOSE 80