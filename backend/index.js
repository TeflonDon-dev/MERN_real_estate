import express from "express"
import moongose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

moongose.connect(process.env.MONGO_URI).then(() => {
    console.log('connected to the datatbase');
}).catch((error)=>console.log(error))

const app = express();

app.listen(3000, () => {
    console.log('server is running on port 3000');
})
