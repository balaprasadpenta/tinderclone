import mongoose from 'mongoose'
import dotenv from 'dotenv'

export const connectDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodb connected: ${connect.connection.host}`)
    }catch(err){
        console.log("error connecting to mongodb", err)
        process.exit(1) //exit process with failure, 0 for success
    }
}