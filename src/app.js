import express from 'express'
import morgan from 'morgan'
import { config } from 'dotenv';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config()
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    //origin: 'http://localhost:2900',
     origin: 'https://frontplus.onrender.com',
    credentials: true
}))

app.set("port", process.env.PORT||3100)

app.use("/", routes);



export default app