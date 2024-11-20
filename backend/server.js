const express = require('express');
const cors = require('cors');
const db = require('./connection');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const port = process.env.PORT || 8081;
const base_url = (process.env.BASE_URL + ':' + process.env.PORT) || `http://localhost:${port}`;

// Import the user routes
const userRoutes = require('./routes/route.user');
const studentRoutes = require('./routes/route.student');
const lecturerRoutes = require('./routes/route.lecturer');
const newsRoutes = require('./routes/route.news');
const letterRoutes = require('./routes/route.letter');

// Use the user routes in the app
app.use('/api/user', userRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/letter', letterRoutes);

// Check DB health
async function checkDBHealth() {
    try {
      await db.query('SELECT 1');
      return { success: true, message: 'Database is connected' };
    } catch (error) {
      return { success: false, message: 'Database connection failed', error: error.message };
    }
}
  
// DB Health Check Route
app.get('/db/health', async (req, res) => {
    const dbHealth = await checkDBHealth();
  
    res.status(dbHealth.success ? 200 : 500).json({
      success: dbHealth.success,
      message: dbHealth.success ? 'Backend and Database are running!' : 'Backend is running but Database connection failed',
      dbStatus: dbHealth.message,
      timestamp: new Date().toISOString(),
    });
});

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${base_url}`);
});
