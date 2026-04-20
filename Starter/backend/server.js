const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();

const postsRouter = require('./routes/posts');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

app.use(express.json());

app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Internal server error' });
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('  /api/posts -> routes/posts.js');
  });
});