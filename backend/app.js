const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./src/config/db');
const cookieParser = require('cookie-parser');
const redisClient = require('./src/config/redis');
const userRouter = require('./src/routes/userRoute');
const problemRouter = require('./src/routes/problemRoute');
const cors = require('cors');
const bodyParser = require('body-parser');
const submitRoute = require('./src/routes/submitRoutes');
const  discussRoute = require('./src/routes/discussRoutes') ;
// const bodyParser = require('body-parser');

const adminRoutes = require('./src/routes/adminRoutes');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    // origin: 'http://192.168.217.174:5173',
    credentials: true ,
    exposedHeaders: ['set-cookie']
}))

// app.use(bodyParser.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());


app.use('/user', userRouter);
app.use('/problem', problemRouter);
app.use('/submission',submitRoute)
app.use('/admin', adminRoutes);
app.use('/discuss', discussRoute);


const InitalizeConnection = async () => {
    try {
        await Promise.all([
            main(),
            await redisClient.connect()
        ]);
        console.log('db Connected');

        app.listen(process.env.PORT, () => {
            console.log('Server started at port:' + process.env.PORT);
        })
    }

    catch (err) {
        console.log("Error:" + err);
    }
}

InitalizeConnection();



// const express = require('express');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const connectDB = require('./src/config/db.js'); // Assuming you have a db connection file

// // Import Routes userRoutes = require('./srcs/userRoutes.js');
// const userRoutes = require('./src/routes/userRoute.js')
// const problemRoutes = require('./src/routes/problemRoute.js');
// const submissionRoutes = require('./src/routes/submitRoutes.js');
// const adminRoutes = require('./src/routes/adminRoutes.js'); // Import admin routes

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // --- CORS Configuration ---
// // This is the key fix for your cookie/token issue.
// const corsOptions = {
//   origin: 'http://localhost:5173', // Your exact frontend URL
//   credentials: true, // This allows the browser to send cookies
// };
// app.use(cors(corsOptions));

// // --- Body and Cookie Parsers ---
// // Must come after CORS and before routes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// // --- API Routes ---
// app.use('/user', userRoutes);
// app.use('/problem', problemRoutes);
// app.use('/submission', submissionRoutes);
// app.use('/admin', adminRoutes); // Admin routes are now correctly handled


// // --- Server Initialization ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // NOTE: You will need to create the files referenced above (e.g., config/db.js, models, etc.)
// // if they don't already exist.
