# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → JavaScript
RUN npm run build

# Expose your app port
EXPOSE 4000

# Start the server
CMD ["npm", "run", "start"]
