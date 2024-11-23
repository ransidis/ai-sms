const express = require('express');
const router = express.Router();
const letterController = require('../controllers/controller.letter');

// send letter request (type, purpose, address)
router.post('/request/:id', letterController.requestLetterController);

// Route to generate new letter (lecturerId)
router.put('/generate/:id', letterController.generateLetterController);

// Route to sign the letter (content)
router.put('/sign/:id', letterController.updateLetterSignController);

// Route to change the status of letter to approved (status, lecturerId)
router.put('/status/:id', letterController.changeStatusController);

// Get letter by ID
router.get('/all', letterController.getAllLetterController);

// Get letter by ID
router.get('/details/:id', letterController.getLetterByIdController);

// Get letter history by student ID
router.get('/history/:id', letterController.getLetterByStudentIdController);

// Route to delete a letter by ID
router.delete('/delete/:id', letterController.deleteLetterController);

module.exports = router;
