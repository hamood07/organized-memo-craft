# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx (non-root user)
FROM nginx:stable-alpine

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Remove default content and copy built app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Set permissions
RUN chown -R appuser:appgroup /usr/share/nginx/html

# Run as non-root user
USER appuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
