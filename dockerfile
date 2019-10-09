FROM node:latest
 
# Create Dir for Application
WORKDIR /usr/src/app
 
# Copy the Package.json and Package-Lock.json:
COPY package*.json ./
 
# Install Typescript:
RUN npm install -g typescript
 
# Install packages from deps.
RUN npm install
 
# Copy the Application source here:
COPY . .
 
#RUN npm run start
 
# Explose the port for the Application to listen on:
EXPOSE 3000
 
# Run the API Server from Node CLI:
CMD ["npm", "run", "start"]