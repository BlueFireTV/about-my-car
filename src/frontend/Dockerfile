# Stage 1: Node.js-Basisimage zum Bauen der App
FROM node:22-alpine AS build-stage

# Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# Abhängigkeiten installieren
COPY package.json .

RUN npm install

# Quellcode kopieren
COPY . .

# Anwendung bauen
RUN npm run build

# Production stage

FROM nginx:alpine AS prod-stage

# Build und Artefakte aus dem Build-Stage kopieren
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Hinzufügen von env.sh zu docker-entrypoint.d
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Standardmäßig verwendet Nginx Port 80
EXPOSE 80

# Nginx im Vordergrund laufen lassen
CMD ["nginx", "-g", "daemon off;"]