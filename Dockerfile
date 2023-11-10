# Use an official Node.js runtime as the base image
FROM node:16.20.2

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the server directory
COPY server/package*.json ./server/

# Install the server dependencies
RUN cd server && npm install

# Copy the rest of the server code into the container
COPY server ./server

# Copy package.json and package-lock.json into the GongChaPOS directory
COPY GongChaPOS/package*.json ./GongChaPOS/

# Install the GongChaPOS dependencies
RUN cd GongChaPOS && npm install

# Copy the rest of the GongChaPOS code into the container
COPY GongChaPOS ./GongChaPOS

# Expose port 9000 for the application
EXPOSE 9000

# Define the command to run the application
RUN npm install --global npm-run-all
CMD npm-run-all -p "ts-node-esm server/api.ts" "cd GongChaPOS && npm run dev"
