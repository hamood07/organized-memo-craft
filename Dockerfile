# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx (non-root user with UID 10001)
FROM nginx:stable-alpine

# Create a non-root user with UID 10001
RUN addgroup -g 10001 appgroup && adduser -u 10001 -G appgroup -S appuser

# Clean default files and copy app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Set permissions for non-root user
RUN chown -R 10001:10001 /usr/share/nginx/html

# Use secure, non-root user
USER 10001

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
