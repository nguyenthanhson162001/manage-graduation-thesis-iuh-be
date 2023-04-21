FROM node:18-alpine

ENV NODE_ENV="development"
WORKDIR /app
COPY package.json .
COPY package-lock.json . /app/

ARG BUILD_ENV
COPY . .

RUN npm ci
RUN npm run build
RUN chown -R node /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start", "--env", "production"]
