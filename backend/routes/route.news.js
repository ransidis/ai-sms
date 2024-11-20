const express = require('express');
const router = express.Router();
const newsController = require('../controllers/controller.news');

// Route to add a new news entry
router.post('/add', newsController.addNewsController);

// Route to get news details by ID
router.get('/details/:id', newsController.getNewsByIdController);

// Route to get all news entries
router.get('/all', newsController.getAllNewsController);

// Update news details
router.put('/update/:id', newsController.updateNewsController);

// Route for deleting a news entry
router.delete('/delete/:id', newsController.deleteNewsController);

module.exports = router;
