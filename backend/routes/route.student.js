const express = require('express');
const router = express.Router();
const studentController = require('../controllers/controller.student');

// Route to add a new student (fullname, cpm_no, registraion_no, cgpa, batch, extra_curricular, user_type)
router.post('/add', studentController.addStudentController);

// Route to get student details by ID
router.get('/details/:id', studentController.getStudentByIdController);

// Route to get all Students
router.get('/all', studentController.getAllStudentsController);

// Update student details including fullname (fullname, cpm_no, registraion_no, cgpa, batch, extra_curricular)
router.put('/update/:id', studentController.updateStudentController);

// Route for deleting a student
router.delete('/delete/:id', studentController.deleteStudentController);

module.exports = router;
