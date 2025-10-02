// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
