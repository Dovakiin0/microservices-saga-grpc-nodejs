[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://github.com/Dovakiin0/microservices-saga-grpc-nodejs/issues)
[![Generic badge](https://img.shields.io/badge/LICENSE-MIT-blue.svg)](https://shields.io/)


## Microservices-Saga-Nodejs
A basic implementation of microservices with event based system to create saga architecture.  
Currently, this has no UI and you can only test it with postman or any alternative.  
Postgres is used for database.  

First fork this repository  
or clone directly with HTTPS
```
git clone https://github.com/Dovakiin0/microservices-saga-grpc-nodejs.git
```

or SSH
```
git clone git@github.com:Dovakiin0/microservices-saga-grpc-nodejs.git
```
Fill in the environment variable for your respective postgres details inside docker-compose.yml.  
Currently for two services two postges database are used in port 5433, 5434  

Go inside each service then run
> npm install

for migration, cd to auth_service and todo_service then run
> npx sequelize-cli db:migrate

To start:
> docker-compose up -d

To stop:
> docker-compose down

Routes are as follows:
```
POST /auth/register - create User
POST /auth/login - login for generating JWT token
PUT /auth/update/:id - update username for a user

POST /v1/todo - create a Todo (Requires token)
GET /v1/todo - Get the list of TODO
PUT /v1/todo/:id - update a TODO
```

All services runs independently.  
Client_service acts as a API gateway for communicating with two services.  
<br/>

### EVENTS
**RabbbitMq** is used for event management. Only one event is published and subscribed throughout this app.  
If you change your username then auth_service throws an event called *USERNAME_CHANGE_EVENT* and it is subscribed by the todo_service which then changes all the username in respective TODOs.

<br/>

Feel free to tweak the code according to your needs, and don't feel hesitated to open any issue or ask any improvements. I'll be sure to respond to you actively.  
If you like it, please leave a **STAR**.