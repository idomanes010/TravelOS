# Inherit Dockerfile containing Linux Alpine + Node.js 24:
FROM node:24-alpine

# Create project folder inside the image:
WORKDIR /app

# Copy package files:
COPY ./Frontend/package.json ./Frontend/package-lock.json /app/

# Install node_modules: 
RUN npm ci

# Copy our App
COPY ./Frontend /app

# Expose port for Vite dev server:
EXPOSE 5173

# When container start - which command will run our app:
CMD ["npm", "start"]
