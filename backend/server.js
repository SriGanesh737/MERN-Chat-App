const express = require('express');
const dotenv = require('dotenv');
const data = require('./data/data');

const app = express();
app.use(express.json());
dotenv.config();

app.get('/api/chat',(req,res)=>{
  console.log(data.chats);
  res.send(data.chats);
});


const port = process.env.PORT || 5000;
app.listen(port,()=>{
  console.log('server started on port ',port);
})