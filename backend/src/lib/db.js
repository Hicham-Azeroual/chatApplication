import mongoose from 'mongoose';
const MONGO_URL=process.env.MONGO_URL;
console.log(MONGO_URL);

export const connectDB=async()=>{
    try{
        const conn =await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected"+ conn.connection.hostname);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}