import express from "express"
import moongose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import listingRouter from "./routes/listing.js"
import cookieParser from "cookie-parser";
import path from "path"
dotenv.config();

moongose.connect(process.env.MONGO_URI).then(() => {
    console.log('connected to the datatbase');
}).catch((error) => console.log(error))

const __dirname = path.resolve();

const app = express();
app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
    console.log('server is running on port 3000');
})

app.use("/api/user", userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing", listingRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'frontend','dist','index.html'))
})

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})