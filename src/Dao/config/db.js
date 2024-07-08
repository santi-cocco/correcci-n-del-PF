import mongoose from "mongoose";
const URI = "mongodb+srv://santiagococco1:admin@cocco.blbclck.mongodb.net/?retryWrites=true&w=majority&appName=cocco"
const connectToDB = () =>{
    try {
        mongoose.connect(URI)
        console.log('connected to DB ecommerce')
    } catch (error) {
        console.log(error)        
    }
}

export default connectToDB