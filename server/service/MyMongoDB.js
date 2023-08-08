const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"
class MyMongoDB {

    initClient(){
        this.client = new MongoClient(uri);
        this.myColl = this.client.db('OnlineCoding').collection('Sessions');
        console.log("client connected to DB");
    }

    async find(query) {
        try{
            this.initClient();
            return await this.myColl.findOne(query);
        }
        finally{
            this.closeConnection();
        }
    }

    async insertDoc(roomName, mentorId) {
        try{
            this.initClient();
            const doc = {
                roomName: roomName,
                mentorId: mentorId,
                students: [],
                startDateTime: new Date().toString(),
                endDateTime: null
            }
            await this.myColl.insertOne(doc);
        }
        catch (e){
            console.log("ERROR in 'insertDoc' function");
            console.log(e);
        }
        finally{
            this.closeConnection();
        }
    }

    async update(roomName, mentorId, updateOperation) {
        const filter = {
            roomName: roomName,
            mentorId: mentorId,
            endDateTime: null
        }
        this.initClient()

        try{
            await this.myColl.updateOne(filter, updateOperation);
        }
        catch (e){
            console.log("ERROR in 'update' function");
            console.log(e);
        }
        finally{
            this.closeConnection();
        }
    }

    async closeConnection(){
        console.log("client disconnect from DB");
        await this.client.close();
    }
}
module.exports = MyMongoDB;