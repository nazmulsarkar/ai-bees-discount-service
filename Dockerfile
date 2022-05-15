FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# CMD ["node", "dist/main.js"]

FROM node:16-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

# COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]