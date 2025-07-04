# whiteboard-backend/Dockerfile
# Use an official Node.js runtime as a parent image
# Or node:18.19.0 for an LTS version <--- THIS COMMENT MOVED TO ITS OWN LINE
FROM node:20.10.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
# We copy these first to leverage Docker's build cache
COPY package*.json ./

# Install application dependencies
# The --omit=dev flag ensures devDependencies are not installed in the production image
RUN npm install --omit=dev --verbose 

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your app will run on. This should match the PORT in your server.js
EXPOSE 10000

# Define the command to run your app
CMD [ "npm", "start" ]
