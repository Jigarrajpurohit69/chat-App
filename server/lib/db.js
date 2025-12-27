import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Mongo already connected");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "chatapp",
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};