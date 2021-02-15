FROM node:14.15.3

WORKDIR /app/auth_serivce/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]

