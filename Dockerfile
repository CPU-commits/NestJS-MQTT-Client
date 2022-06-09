FROM node:14.18.0-alpine AS Development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14.18.0-alpine AS Production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=Development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
