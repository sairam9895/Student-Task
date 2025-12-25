const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// GET /api/tasks?userId=...&status=pending|completed|todo|in-progress
router.get('/', protect, async (req, res) => {
  try {
    const { userId: queryUserId, status } = req.query;

    // Always scope to the authenticated user; ignore mismatched query userIds
    const userId = queryUserId && queryUserId === req.user.id ? queryUserId : req.user.id;

    const filters = { userId };
    if (status === 'pending') {
      filters.completed = false;
    } else if (status === 'completed') {
      filters.status = 'completed';
    } else if (status === 'todo' || status === 'in-progress') {
      filters.status = status;
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { title, description, priority, dueDate, completed, status } = req.body;

  try {
    const normalizedStatus = status || 'todo';
    const normalizedPriority = priority ? priority.toLowerCase() : undefined;
    const task = new Task({
      userId: req.user.id,
      title,
      description,
      priority: normalizedPriority,
      dueDate,
      status: normalizedStatus,
      completed:
        typeof completed === 'boolean'
          ? completed
          : normalizedStatus === 'completed'
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET single task
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId?.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  const { title, description, priority, dueDate, completed, status } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId?.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;
      // keep completed in sync with provided values or status
      if (typeof completed === 'boolean') {
        task.completed = completed;
        if (completed) {
          task.status = 'completed';
        } else if (status === undefined) {
          task.status = 'todo';
        }
      } else if (status) {
        task.completed = status === 'completed';
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId?.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      await Task.deleteOne({ _id: req.params.id });
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
