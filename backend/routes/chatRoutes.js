const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {accessChat, fetchChats,createGroupChat,renameGroupChat,addToGroup,removeFromGroup} = require('../controllers/chatController');

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroupChat);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup);

module.exports = router;