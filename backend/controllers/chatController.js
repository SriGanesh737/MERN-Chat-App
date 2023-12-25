const asyncHandler = require('express-async-handler')

const Chat = require('../models/chat');
const User = require('../models/user');

const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        res.status(400)
        throw new Error('Please provide userId')
    }
    var isChat = await Chat.find({
      isGroupChat:false,
      $and:[
        {users:{$elemMatch:{$eq:userId}}},
        {users:{$elemMatch:{$eq:req.user._id}}}
      ]
    }).populate('users','-password').populate('latestMessage');

    isChat = await User.populate(
      isChat, 
      {path: 'latestMessage.sender',
     select: 'name pic email',
    });

    if(isChat.length>0){
      res.json(isChat[0])
    }
    else{
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try{
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findById(createdChat._id).populate('users','-password');

        res.status(201).json(FullChat);
      }
      catch(error){
        console.log(error);
      }
    }

});

const fetchChats = asyncHandler(async(req,res)=>{
  try{
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate('users','-password')
    .populate('groupAdmin','-password')
    .populate('latestMessage')
    .sort({updatedAt:-1})
    .then(async(result)=>{
      result = await User.populate(
        result, 
        {path: 'latestMessage.sender',
       select: 'name pic email',
      });
      res.status(200).json(result);
    });
  } catch (error){
    res.status(400)
    throw new Error(error)
  }
});

const createGroupChat = asyncHandler(async(req,res)=>{
  if(!req.body.users || !req.body.name){
    res.status(400)
    throw new Error('Please provide all the fields')
  }
  var users = JSON.parse(req.body.users);
  if(users.length < 2){
    res.status(400)
    throw new Error('Please add atleast 2 users')
  }

  users.push(req.user._id);

  try{
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const FullChat = await Chat.findById(groupChat._id)
    .populate('users','-password')
    .populate('groupAdmin','-password');

    res.status(201).json(FullChat);
  }
  catch(error){
    res.status(400);
    throw new Error(error);
  }

});

const renameGroupChat = asyncHandler(async(req,res)=>{
  if(!req.body.chatId || !req.body.chatName){
    res.status(400)
    throw new Error('Please provide all the fields')
  }

  try{
   const {chatId,chatName} = req.body;
   const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {chatName:chatName},
    {new:true})
    .populate('users','-password')
    .populate('groupAdmin','-password');

    if(!updatedChat){
      res.status(400)
      throw new Error('Chat not found')
    }else{
      res.status(201).json(updatedChat);
    }
  }
  catch(error){
    res.status(400);
    throw new Error(error);
  }

});

const addToGroup = asyncHandler(async(req,res)=>{
  const {chatId,userId} = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {$push:{users:userId}},
    {new:true}
  ).populate('users','-password')
  .populate('groupAdmin','-password');


  if(!added){
    res.status(400)
    throw new Error('Chat not found')
  }
  else{
    res.status(201).json(added);
  }
});

const removeFromGroup = asyncHandler(async(req,res)=>{
  const {chatId,userId} = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {$pull:{users:userId}},
    {new:true}
  ).populate('users','-password')
  .populate('groupAdmin','-password');

  if(!removed){
    res.status(400)
    throw new Error('Chat not found')
  }
  else{
    res.status(201).json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
}