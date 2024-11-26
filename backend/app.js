
const express = require('express');
const app = express();
const userRoutes = require('./routes/route.user');
// ...existing code...

app.use('/api/users', userRoutes);

// ...existing code...