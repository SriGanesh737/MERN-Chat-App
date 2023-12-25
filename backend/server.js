const express = require('express');
const dotenv = require('dotenv');
const data = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());
connectDB();

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 8000;

const server = app.listen(port,()=>{
  console.log('server started on port ',port);
})

const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:'*',
  },
});

io.on("connection",(socket)=>{
  console.log('connected to socket');

  socket.on("setup", (userData) =>{
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });
  
  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log('joined room ',room);
  });

  socket.on('typing', (room)=>socket.in(room).emit('typing'));
  socket.on('stop typing', (room)=>socket.in(room).emit('stop typing'));


  socket.on('new message', (newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;

    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user)=>{
      if(user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message recieved',newMessageRecieved);
    });
  });

})