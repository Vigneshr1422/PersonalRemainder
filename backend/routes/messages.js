// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages for a task
router.get('/:taskId', async (req, res) => {
  try {
    const messages = await Message.find({ taskId: req.params.taskId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST a new message
router.post('/:taskId', async (req, res) => {
  try {
    const { content } = req.body;
    const message = new Message({ taskId: req.params.taskId, content });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to add message" });
  }
});

module.exports = router;
