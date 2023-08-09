const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL

class MyMongoDB {

    initClient(){
        this.client = new MongoClient(uri);
        this.myColl = this.client.db('OnlineCoding').collection('Sessions');
        console.log("client connected to DB");
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
        try{
            this.initClient();
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