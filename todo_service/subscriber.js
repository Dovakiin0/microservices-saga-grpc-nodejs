const amqp = require("amqplib/callback_api");
const db = require("./models");

module.exports.subs = async () => {
  try {
    amqp.connect("amqp://localhost:5672", (err, connection) => {
      if (err) console.log(err);
      connection.createChannel((err, channel) => {
        if (err) {
          console.log(err);
        }
        channel.assertQueue(queuename, {
          durable: false,
        });
        channel.consume(
          queuename,
          async (msg) => {
            try {
              let recieve = JSON.parse(msg.content);
              const todo = await db.todo.findAll({
                where: { username: recieve.oldUser },
              });
              for (let i = 0; i < todo.length; i++) {
                todo[i].username = recieve.newUser;
                await todo[i].save();
              }
            } catch (err) {
              console.log(err);
            }
          },
          { noAck: true }
        );
      });
    });
  } catch (err) {
    console.log(err);
  }
};
