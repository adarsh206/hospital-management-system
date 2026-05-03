import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import { connectDB } from './config/db.js';
import doctorRouter from './routes/doctorRouter.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors())
app.use(clerkMiddleware())
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true}));


// DB
connectDB();

// Routes
app.use("/api/doctors", doctorRouter);


app.get('/', (req, res) => {
    res.send("API WORKING")
})



// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`MediCare Server listening at http://localhost:${PORT}`)
})