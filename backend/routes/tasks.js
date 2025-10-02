const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save task" });
  }
});

// PATCH task (update dailyStatus)
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Merge new dailyStatus into existing
    if (req.body.dailyStatus) {
      task.dailyStatus = {
        ...task.dailyStatus.toObject(),
        ...req.body.dailyStatus
      };
    }

    // Update other fields if provided
    const { title, type, date, endDate, week, status } = req.body;
    if (title !== undefined) task.title = title;
    if (type !== undefined) task.type = type;
    if (date !== undefined) task.date = date;
    if (endDate !== undefined) task.endDate = endDate;
    if (week !== undefined) task.week = week;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});


// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
