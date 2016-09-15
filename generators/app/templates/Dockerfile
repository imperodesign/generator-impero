# Set the base image to the official Node.js one
FROM node:6

# File Author / Maintainer
MAINTAINER Impero

# Install Webpack
RUN npm i -g webpack

# Install npm modules
COPY package.json /src/package.json
RUN cd /src; npm i

# Bundle app source
COPY . /src

# Change working directory
WORKDIR /src

# Build assets
RUN npm run build

# Expose port app is running on
EXPOSE 5000

CMD ["node", "app/index.js"]
