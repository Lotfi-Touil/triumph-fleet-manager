FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
WORKDIR /app/infrastructure/platforms/nest
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/infrastructure/platforms/nest/package*.json ./
COPY --from=builder /app/infrastructure/platforms/nest/dist ./dist
COPY --from=builder /app/application ./application
COPY --from=builder /app/domain ./domain
COPY --from=builder /app/infrastructure ./infrastructure

# Install only production dependencies
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]