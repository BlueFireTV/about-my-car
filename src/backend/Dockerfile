# Stage 1: Node.js-Basisimage zum Bauen der App
FROM node:22-alpine AS build-stage

# Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# Abhängigkeiten installieren
COPY package.json .

RUN npm install --ignore-scripts

# Quellcode kopieren
COPY . .

# Anwendung bauen
RUN npm run build

# Production stage
FROM node:22-alpine AS prod-stage

WORKDIR /app

COPY package.json .

# Copy node_modules with native bcrypt build
COPY --from=build-stage /app/node_modules ./node_modules

# Copy only the built app
COPY --from=build-stage /app/dist ./dist

EXPOSE 3133

CMD [ "node", "dist/src/index.js" ]