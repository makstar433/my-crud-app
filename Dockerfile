# Use an official Node.js runtime as the base image
FROM node:14

# Set working directory inside the container
WORKDIR /my-crud-app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all files from current directory to container
COPY . .

# Expose port 3000 for the app
EXPOSE 4000

 # Start the app when container starts
 CMD ["node", "server.js"]