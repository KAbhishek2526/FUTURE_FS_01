const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');

// POST /api/chat  — AI agent with Gemini + tool calling
router.post('/', chat);

module.exports = router;
