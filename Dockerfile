# Use a Node.js image for building and running
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including 'serve')
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Expose the port the server will run on (default for 'serve' is 3000)
EXPOSE 3000

# Command to run the application using the 'serve' package
# This will serve the 'dist' directory
CMD ["npm", "start"]