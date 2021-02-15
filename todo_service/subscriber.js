const amqp = require("amqplib/callback_api");
const db = require("./models");

module.exports.subs = async () => {
  try {
    amqp.connect("amqp://rabbitmq:5672", (err, connection) => {
      // if (err) console.log(err);
      if (typeof connection == "undefined") {
        setTimeout(() => {
          console.log(`Connection not established!! Retrying after 5 Seconds!`);
          this.subs();
        }, 5000);
      } else {
        console.log("Connection Established Successfully!");
        connection.createChannel((err, channel) => {
          if (err) {
            console.log(err);
          }
          let queuename = "USERNAME_CHANGE_EVENT";
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
      }
    });
  } catch (err) {
    console.log(err);
  }
};
