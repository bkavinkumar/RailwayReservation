# Use an official Node runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose your app’s port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
