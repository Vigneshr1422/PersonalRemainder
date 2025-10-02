const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(express.json());

// CORS setup: allow frontend origins
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-netlify-app.netlify.app'],
  credentials: true,
}));
app.use('/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Test route
app.get('/', (req, res) => {
  res.send("Backend Working");
});

// Task routes
app.use('/tasks', taskRoutes);

// Listen on PORT from Render or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
