import express from'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js';
import authRoutes from './routes/authRoute.js';
import productRoutes from './routes/productRoute.js';
import cartRoutes from './routes/cartRoute.js';
import orderRoutes from './routes/orderRoute.js';
import cors from 'cors'
import morgan from 'morgan';
import { errorHandle, notFound } from './middlewares/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT ||9000


//MIDDLEWARE
app.use(express.json());
app.use(cors())
app.use(morgan('dev'))

//ROUTES
app.use(`/auth`, authRoutes)
app.use(`/product`, productRoutes)
app.use(`/cart`, cartRoutes)
app.use(`/order`, orderRoutes)

app.use(notFound);
app.use(errorHandle)


app.get(`/`,(req,res)=>{
    res.json({message:"hello Mom!!"})
})
connectDb(); 
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}` )
})
