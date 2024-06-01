const mongoose = require("mongoose")
const Connect = async () => {
    try {
        console.log("mongodb connected");
        await mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        connection.on("error", (err) => {
            console.log("Error in connecting to MongoDB:", err);
        });
        console.log("mongodb connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }

}

module.exports = Connect;
