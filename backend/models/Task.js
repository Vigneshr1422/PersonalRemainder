// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  type: String,      // Aptitude / Coding / Personal
  date: String,      // YYYY-MM-DD
  endDate: String,   // optional
  week: Number,
  status: String,    // complete / incomplete
  dailyStatus: {     // add this for per-day completion
    type: Map,
    of: String,      // "complete" or "incomplete"
    default: {}
  }
});

module.exports = mongoose.model('Task', taskSchema);
