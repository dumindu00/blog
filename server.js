require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const postsRouter = require('./routes/posts');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/posts', postsRouter);

// Simple root
app.get('/', (req, res) => res.send('Portfolio API is running'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.DB_URI;

mongoose.connect(MONGO_URI, {
  // options not required for mongoose v6+
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});