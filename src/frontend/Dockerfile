# Stage 1: Node.js-Basisimage zum Bauen der App
FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package.json .
RUN npm install --ignore-scripts

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine AS prod-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
