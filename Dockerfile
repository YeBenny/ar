FROM node:16.19.1 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.23.2-alpine
RUN mkdir -p /usr/share/nginx/html/wegalaxy/ar
COPY --from=builder /app/dist/ /usr/share/nginx/html/wegalaxy/ar
