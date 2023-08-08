const { Server } = require("socket.io");
const MyMongoDB = require('./service/MyMongoDB');

const ip = '0.0.0.0';

const io = new Server(process.env.PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
console.log(`Server is listening on Port : ${process.env.PORT}`);

const myDB = new MyMongoDB();
const studentToMentorMap = new Map();
const roomToMentorMap = new Map();

const findStudentSocket = (studentId) => {
    for (const socketStudent in studentToMentorMap.keys()) {
        if (socketStudent.id == studentId){
            return socketStudent;
        }
    }
};

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
            const updateOperation = {
                $push: { students: socket.id }
            };
            myDB.update(codeBlockName, roomToMentorMap.get(codeBlockName).id, updateOperation);
        }
        else {
            // mentor accessed the room
            socket.emit("is_mentor", true);
            console.log(`A user with id : ${socket.id} is Mentor in the room : ${codeBlockName}`);
            roomToMentorMap.set(codeBlockName, socket);
            myDB.insertDoc(codeBlockName, socket.id);
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

    socket.on("mentor_leave", (mentorId, codeBlockName) => {
        const updateOperation = {
            $set: { endDateTime: new Date().toString() }
        };
        /*remove mentor from roomToMentorMap*/
        roomToMentorMap.delete(codeBlockName);
        console.log("mentor leaved", mentorId, codeBlockName);
        myDB.update(codeBlockName, mentorId, updateOperation);
    });

    socket.on("student_leave", (studentId) => {
        /* TODO: BUGGGGG */
        socket = findStudentSocket(studentId);
        studentToMentorMap.delete(socket);
    });

    socket.on('disconnect', () => {
        console.log(`A user with id : ${socket.id} disconnected`);
    });
});
