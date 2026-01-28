import mongoose from 'mongoose';

export const connectDB = async () => {

    try {

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB Cluster');
        });



        await mongoose.connect( `${process.env.MONGODB_URI}/chat-app` );

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }



}