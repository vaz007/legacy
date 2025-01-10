# Use a lightweight base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm i

# Copy application code
COPY . .

# Set environment variables
ENV PORT=3000

# Expose the application's port
EXPOSE $PORT

# Start the application
CMD ["node", "server.js"]
