const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = __dirname + "/protos/auth.proto";

const {
  login,
  register,
  verify,
  getUser,
  test,
  update,
} = require("./authController");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  longs: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).Authentication;

function main() {
  const server = new grpc.Server();
  server.addService(userProto.Auth.service, {
    login: login,
    register: register,
    verify: verify,
    getUser: getUser,
    test: test,
    update: update,
  });
  server.bindAsync(
    "0.0.0.0:3001",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("[AUTH SERVICE] running on 3001");
      server.start();
    }
  );
}

main();
