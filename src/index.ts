import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routers/auth'
dotenv.config();
console.log("Loaded FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "✅ Exists" : "❌ Missing");


const app = express()
app.use(express.json())

app.get('/',(req,res)=>{
    return res.json('Hello World')
})
app.use('/auth', authRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
