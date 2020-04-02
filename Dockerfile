FROM node:current-slim

# Set the working directory to the current folder
WORKDIR ./

# Copy the package and package-lock files
COPY package*.json ./

# Install node modules to container folder
RUN npm install

# Copy app source
COPY . .

# Expose port 8080 for GraphQL Server
EXPOSE 8080

CMD ["npm", "start"]
