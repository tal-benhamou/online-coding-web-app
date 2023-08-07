const { Server } = require("socket.io");

const PORT = 3001;
const localhost = "http://localhost:3000";

const io = new Server(PORT, {
    cors: {
        origin: localhost
    }
});

const studentToMentorMap = new Map();
const roomToMentorMap = new Map();

io.on('connection', (socket) => {
    console.log(`A user with id : ${socket.id} connected`);

    // listen for users to choose Code Block (Room)
    socket.on('code_block_name', (codeBlockName) => {

        console.log(`A user with id : ${socket.id} chose code block name : ${codeBlockName}`);
        
        if (roomToMentorMap.has(codeBlockName) && roomToMentorMap.get(codeBlockName) != socket){
            // student accessed the room
            socket.emit("is_mentor", false);
            console.log(`A user with id : ${socket.id} is Student in the room : ${codeBlockName}`);
            studentToMentorMap.set(socket, roomToMentorMap.get(codeBlockName));
        }
        else {
            // mentor accessed the room
            socket.emit("is_mentor", true);
            console.log(`A user with id : ${socket.id} is Mentor in the room : ${codeBlockName}`);
            roomToMentorMap.set(codeBlockName, socket);
        }

    });

    socket.on("student_code", (code) => {
        const mentorSocket = studentToMentorMap.get(socket);
        if (mentorSocket)
            mentorSocket.emit("mentor_code", code);
    });

    socket.on("solved", (val) => {
        const mentorSocket = studentToMentorMap.get(socket);
        if (mentorSocket)
            mentorSocket.emit("solved", val);
    });


    socket.on('disconnect', () => {
        console.log(`A user with id : ${socket.id} disconnected`);
    });
});