const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware
app.use(express.json());

// CORS setup: allow frontend origins dynamically
const allowedOrigins = [
  'http://localhost:5000',
  'https://vigneshdailyplan.netlify.app',
  'https://todovignesh.netlify.app',
  'https://todoapp-1-l8t1.onrender.com' // add any deployed frontend on Render
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman / curl
    if(allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    if(/\.netlify\.app$/.test(origin)) return callback(null, true);
    if(/\.onrender\.com$/.test(origin)) return callback(null, true); // allow Render frontends
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true
}));

// Routes
app.use('/messages', messageRoutes);
app.use('/tasks', taskRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Test route
app.get('/', (req, res) => res.send("Backend Working"));

// Listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// const taskRoutes = require('./routes/tasks');
// const messageRoutes = require('./routes/messages');

// const app = express();

// // Middleware
// app.use(express.json());

// // CORS setup: allow frontend origins dynamically
// const allowedOrigins = [
//   'http://localhost:3000' // add any deployed frontend on Render
// ];

// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true); // allow Postman / curl
//     if(allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
//     if(/\.netlify\.app$/.test(origin)) return callback(null, true);
//     if(/\.onrender\.com$/.test(origin)) return callback(null, true); // allow Render frontends
//     return callback(new Error('CORS not allowed'), false);
//   },
//   credentials: true
// }));

// // Routes
// app.use('/messages', messageRoutes);
// app.use('/tasks', taskRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

// // Test route
// app.get('/', (req, res) => res.send("Backend Working"));

// // Listen on PORT
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
