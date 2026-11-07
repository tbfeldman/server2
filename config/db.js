import {connect} from 'mongoose'
export const connectDB= async()=>{
    try {
        const MONGO_URI=process.env.MONGO_URI
        await connect(MONGO_URI)
        console.log('mongoDb connected');
        
    } catch (error) {
        console.log('mongoDb error',error.message); 

    }
    
};