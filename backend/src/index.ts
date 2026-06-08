import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import commentRouter from './routes/commentRoutes';

const app = express();

// CORS configuration (works in Express 4)  
const corsOptions = {
  origin: 'http://localhost:5173',   // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/comments', commentRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Cheel company Mate' });
});

// app.listen(ENV.PORT, () => console.log(`Server running on PORT: ${ENV.PORT}`));

export default app