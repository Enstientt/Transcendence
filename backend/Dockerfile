FROM node:16-alpine

# Set working directory
WORKDIR /usr/transcendence

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run Prisma migration and start the application
CMD ["sh", "-c", "npm install && npx prisma migrate dev --name init && npm run start"]
