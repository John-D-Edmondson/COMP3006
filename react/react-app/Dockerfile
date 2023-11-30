# Use an existing node alpine image as a base image.
FROM node:18-alpine

# Set the working directory.
WORKDIR /react-app

# Copy the package.json file.
COPY public/ /react-app/public
COPY src/ /react-app/src
COPY package.json /react-app/

# Install application dependencies.
RUN npm install

# Copy the rest of the application files.


# Expose the port.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]