const express = require('express');
const dotenv = require('dotenv');
const data = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());
connectDB();

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 8000;
app.listen(port,()=>{
  console.log('server started on port ',port);
})