# Build shared-ui library
FROM node:18 AS shared-ui-builder
WORKDIR /app/shared-ui
COPY shared-ui/package*.json ./
RUN npm ci
COPY shared-ui/ .
RUN npm run build

# Build main application
FROM node:18 AS app-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=shared-ui-builder /app/shared-ui/dist ./dist/shared-ui
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:stable-alpine AS server
COPY --from=app-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
