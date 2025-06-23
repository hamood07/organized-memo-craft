FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Create non-root user
RUN addgroup -g 10001 appgroup && adduser -u 10001 -G appgroup -S appuser

# Remove default html and copy built app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Give proper permissions to non-root user
RUN chown -R 10001:10001 /usr/share/nginx/html /var/cache/nginx /var/run /etc/nginx /run

USER 10001

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
