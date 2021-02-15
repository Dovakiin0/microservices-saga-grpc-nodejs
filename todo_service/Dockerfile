FROM node:14.15.3

WORKDIR /app/todo_service/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["node", "server.js"]

