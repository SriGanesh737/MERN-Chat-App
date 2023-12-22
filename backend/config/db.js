const mongoose  = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    const uri = "mongodb+srv://admin2:pass123321@myatlasclusteredu.ywyulwx.mongodb.net/Messaging-App"
    try {
        const conn = await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;