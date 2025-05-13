const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Create message
router.post('/', async (req, res) => {
  const { sender, content, image } = req.body;

  try {
    const newMessage = new Message({ sender, content, image });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message', error });
  }
});

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
});

// Edit message
router.put('/:id', async (req, res) => {
  const { content } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { content }, { new: true });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update message', error });
  }
});

// Delete message
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message', error });
  }
});

module.exports = router;
