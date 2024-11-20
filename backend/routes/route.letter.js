const express = require('express');
const router = express.Router();
const letterController = require('../controllers/controller.letter');

// Route to generate new letter (type, purpose, address, user_id)
router.post('/generate', letterController.generateLetterController);

// Route to update letter content (content)
router.put('/update/:id', letterController.updateLetterContentController);

// Update letter content (and sign) with image upload handling
router.put('/sign/:id', letterController.updateLetterSignController);

// Get letter by ID
router.get('/details/:id', letterController.getLetterByIdController);

// Get letter history by student ID
router.get('/history/:id', letterController.getLetterByStudentIdController);

module.exports = router;
