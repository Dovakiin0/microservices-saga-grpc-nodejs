const db = require("./models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const grpc = require("@grpc/grpc-js");
const auth_event = require("./event-bus/auth-publisher");

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_PRIVATE_KEY
  );
}

module.exports.test = (call, callback) => {
  callback(null, { message: "HELLO WORLD FROM TESTING" });
};

module.exports.login = async ({ request }, callback) => {
  try {
    const user = await db.user.findOne({ where: { email: request.email } });
    if (!user) {
      return callback({
        code: 400,
        message: "INCORREST EMAIL OR PASSWORD",
        status: grpc.status.INTERNAL,
      });
    }
    const validatePassword = await bcrypt.compare(
      request.password,
      user.password
    );
    if (!validatePassword) {
      return callback({
        code: 400,
        message: "INCORREST EMAIL OR PASSWORD",
        status: grpc.status.INTERNAL,
      });
    }
    const access_token = generateAccessToken(user);
    callback(null, { status: "Success", token: access_token });
    auth_event.event(`${user.email} has logged in`);
  } catch (err) {
    callback(err);
  }
};

module.exports.register = async ({ request }, callback) => {
  try {
    let record = request;
    let saltround = 11;
    const salt = await bcrypt.genSalt(saltround);
    const hashpwd = await bcrypt.hash(record.password, salt);
    record.password = hashpwd;
    const create_user = await db.user.create(record);
    callback(null, { status: "success" });
  } catch (err) {
    callback(err);
  }
};

module.exports.verify = ({ request }, callback) => {
  let token = request.token;
  const decodeData = jwt.decode(token);
  callback(null, decodeData);
};

module.exports.getUser = async ({ request }, callback) => {
  try {
    const user = await db.user.findByPk(request.id);
    if (!user)
      return callback({
        code: 400,
        message: "Not Found",
        status: grpc.status.INTERNAL,
      });
    callback(null, user);
  } catch (err) {
    callback(err);
  }
};

module.exports.update = async ({ request }, callback) => {
  try {
    const user = await db.user.findByPk(request.id);
    if (!user)
      return callback({
        code: 400,
        message: "INCORREcT EMAIL OR PASSWORD",
        status: grpc.status.INTERNAL,
      });
    auth_event(user.username, request.username);
    user.username = request.username;
    user.save().then(() => {
      callback(null, user);
    });
  } catch (err) {
    callback(err);
  }
};
