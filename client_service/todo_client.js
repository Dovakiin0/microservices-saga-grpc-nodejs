const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/protos/todo.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  longs: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const todoClient = new todoProto.ToDo(
  "todo_service:3002",
  // "0.0.0.0:3002",
  grpc.credentials.createInsecure()
);

module.exports = todoClient;
