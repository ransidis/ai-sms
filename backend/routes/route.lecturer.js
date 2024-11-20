const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/controller.lecturer');

// Route to add a new lecturer
router.post('/add', lecturerController.addLecturerController);

// Route to get lecturer details by ID
router.get('/details/:id', lecturerController.getLecturerByIdController);

// Route to get all lecturers
router.get('/all', lecturerController.getAllLecturersController);

// Update lecturer details
router.put('/update/:id', lecturerController.updateLecturerController);

// Route for deleting a lecturer
router.delete('/delete/:id', lecturerController.deleteLecturerController);

module.exports = router;
