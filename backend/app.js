
const express = require('express');
const app = express();
const userRoutes = require('./routes/route.user');


app.use('/api/users', userRoutes);
