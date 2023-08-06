const { Server } = require("socket.io");

const PORT = 3001;
const localhost = "http://localhost:3000";

const io = new Server(PORT, {
    cors: {
        origin: localhost
    }
});


let count = 0;

io.on('connection', (socket) => {
    console.log(`A user with id : ${socket.id} connected`);

    // listen for users to choose Code Block
    socket.on('code_block_name', (codeBlockName) => {

        console.log(`A user with id : ${socket.id} chose code block name : ${codeBlockName}`);

        // first user to choose codeBlockName is the mentor
        if (count == 0){
            socket.emit("is_mentor", true);
        }
        else{
            socket.emit("is_mentor", false);
        }
        count+=1;



    });

    socket.on("student_code", (code) => {
        socket.emit('student_code', code);
    });

    socket.on('disconnect', () => {
        console.log(`A user with id : ${socket.id} disconnected`);
    });
});