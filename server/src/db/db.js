import mongoose from "mongoose";

export async function connectDB() {
    try {
        const mongooseConnection = await mongoose.connect(process.env.MONGOOSE_URI, {});
        console.log(`MongoDB connected successfully`);
    } catch(err) {
        console.error(`MongoDB connection error - ${err}`)
        console.log(`---------------------------------------------------------------------------`);
        throw err;
    }
}