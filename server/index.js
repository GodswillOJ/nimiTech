const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const blogRoutes = require('./routes/blogRoutes');
const businessRoutes = require('./routes/businessRoutes');
const authRoutes = require('./routes/authRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/auth', authRoutes);

// Uploads (static files)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve frontend (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  );
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
