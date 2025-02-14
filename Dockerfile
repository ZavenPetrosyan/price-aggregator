FROM node:22 as base

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
EXPOSE 3000

RUN npm install -g @nestjs/cli

FROM base AS dev
CMD ["npm", "run", "start:debug"]

FROM base AS production
RUN npm run build
CMD ["npm", "run", "start:prod"]
