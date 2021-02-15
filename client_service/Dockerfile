FROM node:14.15.3

WORKDIR /app/client_service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
