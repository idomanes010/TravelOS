# Inherit Dockerfile containing Linux Alpine + Node.js 24:
FROM node:24-alpine

# Create project folder inside the image:
WORKDIR /app

# Copy package files:
COPY ./Backend/package.json ./Backend/package-lock.json /app/

# Install node_modules: 
RUN npm ci

# Copy our App
COPY ./Backend /app

# Expose port for backend service:
EXPOSE 4000

# When container start - which command will run our app:
CMD ["npm", "start"]
