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

# 
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Abhängigkeiten installieren [PROD]
COPY package.json .

COPY --from=build-stage /app/dist ./dist

RUN npm install --only=production --ignore-scripts && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3133

CMD [ "node", "dist/src/index.js"]