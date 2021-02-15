const amqp = require("amqplib/callback_api");

module.exports = (old, newUser) => {
  let msg = { oldUser: old, newUser: newUser };
  amqp.connect("amqp://localhost:5672", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      let queuename = "USERNAME_CHANGE_EVENT";
      channel.assertQueue(queuename, { durable: false });
      channel.sendToQueue(queuename, Buffer.from(JSON.stringify(msg)));
    });
    setTimeout(() => {
      connection.close();
    }, 1000);
  });
};
