const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const listener = require("./subscriber");

const PROTO_PATH = __dirname + "/protos/todo.proto";

const { getAll, create, update, del, edit } = require("./todoController");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  longs: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

function main() {
  const server = new grpc.Server();
  server.addService(todoProto.ToDo.service, {
    create: create,
    update: update,
    delete: del,
    edit: edit,
    getAll: getAll,
  });
  server.bindAsync(
    "0.0.0.0:3002",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("[TODO SERVICE] running on 3002");
      server.start();
    }
  );
  listener.subs();
}

main();
