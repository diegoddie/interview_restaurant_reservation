# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

COPY prisma ./prisma   # Copy prisma schema
RUN npx prisma generate # Generate Prisma Client

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (same as Express server)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
