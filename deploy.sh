docker-compose down
docker-compose up -d
sleep 10
cd auth_service && npx sequelize-cli db:migrate
sleep 2
cd .. 
cd todo_service && npx sequelize-cli db:migrate