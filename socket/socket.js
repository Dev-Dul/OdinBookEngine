const { Server } = require("socket.io");

let io;

function setupSocket(server){
    io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_DOMAIN,
            transports: ['websocket', 'polling'],
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 20000,
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);


        socket.on('disconnect', (reason) => {
            console.log(`${socket.id} disconnected due to: ${reason}`);
        });
    });

}


function getIO(){
    // console.log("io", io);
    return io;
}

module.exports = {
    getIO,
    setupSocket,
}