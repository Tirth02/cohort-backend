import mongoose from "mongoose";

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MONGODB connected: ${conn.connection}`);
}

export default connectDB;