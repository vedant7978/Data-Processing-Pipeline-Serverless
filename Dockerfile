# Use Node 16 base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files into the container
COPY frontend/ ./

# Build the app (includes Tailwind, Flowbite, and Axios)
RUN npm run build

# Expose the necessary port (default 3000 for serve)
EXPOSE 3000

# Start the app
CMD ["npx", "serve", "build"]