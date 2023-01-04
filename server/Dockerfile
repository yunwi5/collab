FROM node:16-alpine3.16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Can use yarn?
RUN yarn

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "yarn", "start"]

# 1. Build the image
# docker build . -t <user-name>/collab-backend
# 2. Run the image
# docker run -p 8080:8080 <user-name>/collab-backend
