const db = require("./models");

module.exports.create = async ({ request }, callback) => {
  try {
    const todo = await db.todo.create({
      title: request.title,
      description: request.description,
      end_date: request.end_date,
      username: request.username,
      status: "Not Completed",
    });
    callback(null, todo);
  } catch (err) {
    callback(err);
  }
};

module.exports.update = async ({ request }, callback) => {
  try {
    const todo = await db.todo.findByPk(request.todoId);
    todo.status = "Completed";
    todo.save().then(() => {
      callback(null, todo);
    });
  } catch (err) {
    callback(err);
  }
};

module.exports.del = async ({ request }, callback) => {
  try {
    const todo = await db.todo.destroy({ where: { id: request.todoId } });
    callback(null, { message: "SUCCESS" });
  } catch (err) {
    callback(err);
  }
};

module.exports.edit = async ({ request }, callback) => {
  try {
    const todo = await db.todo.findByPk(request.todoId);
    todo.title = request.title;
    todo.description = request.description;
    todo.end_date = request.end_date;
    todo.username = request.username;
    todo.save().then(() => {
      callback(null, todo);
    });
  } catch (err) {
    callback(err);
  }
};

module.exports.getAll = async ({ request }, callback) => {
  try {
    const todo = await db.todo.findAll();
    callback(null, { result: todo });
  } catch (err) {
    callback(err);
  }
};
