# Base Stage
FROM node:22 as base

WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

EXPOSE 3000

RUN npm install -g @nestjs/cli

FROM base AS dev
CMD ["npm", "run", "start:debug"]

FROM base AS production
RUN npm run build
CMD ["npm", "run", "start:prod"]
