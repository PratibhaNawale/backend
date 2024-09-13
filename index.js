const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connectDb = require('./config/db');
const userController=require('./controllers/userController.js')
const USER_PROTO_PATH = './proto/user.proto';

const packageDefinitionUser = protoLoader.loadSync(USER_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});



const userProto = grpc.loadPackageDefinition(packageDefinitionUser).user;

const server = new grpc.Server();

server.addService(userProto.userService.service, {
    getUser: userController.getUser,
    createUser: userController.createUser,
    updateUser: userController.updateUser,
    deleteUser: userController.deleteUser
});



// Bind the server to a port
const PORT = 50055;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), async (error, port) => {
    if (error) {
        return console.error('Server error:', error);
    }

    await connectDb();
    console.log(`gRPC server running at http://localhost:${port}`);
});
