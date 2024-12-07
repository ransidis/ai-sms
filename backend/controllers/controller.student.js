const studentModel = require('../models/model.student');
const userModel = require('../models/model.user');
const bcrypt = require('bcryptjs');

// Controller function to get student by ID
async function getStudentByIdController(req, res) {
    const studentId = req.params.id;

    try {
        const student = await studentModel.getStudentById(studentId);

        if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
        }

        return res.status(200).json({
        success: true,
        data: student
        });
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
        });
    }
}

// Controller function to get all students
async function getAllStudentsController(req, res) {
    try {
        const students = await studentModel.getAllStudents();

        return res.status(200).json({
        success: true,
        data: students
        });
    } catch (error) {
        console.error('Error fetching all students:', error);
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
        });
    }
}

// Controller for adding a new student
async function addStudentController(req, res) {
    const { fullname, email, password, user_type, cpm_no, registration_no, cgpa, batch, extra_curricular, gender } = req.body;
  
    // Basic validation
    if (!fullname || !email || !password || !user_type || !cpm_no || !batch || !registration_no) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required!'
      });
    }
  
    try {
      // Check if email already exists
      const existingUser = await userModel.getUserByEmail(email);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (existingUser) {

        await studentModel.updateStudentDetails(existingUser.user_id, {
          fullname,
          cpm_no,
          registration_no,
          cgpa,
          batch,
          extra_curricular,
        });
    

      } else {
        // Add user entry
        const newUser = {
          fullname,
          email,
          password: hashedPassword,
          user_type
        };

        const userId = await userModel.createUser(newUser);
    
        // Add student entry
        const newStudent = {
          user_id: userId,
          cpm_no,
          registration_no,
          cgpa,
          batch,
          extra_curricular,
          gender: gender || 'Male'
        };
        await studentModel.createStudent(newStudent);
      }
  
      // Response
      return res.status(201).json({
        success: true,
        message: 'Student added successfully!'
      });
    } catch (error) {
      console.error('Error adding student:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
}

// Controller function to handle updating a student
async function updateStudentController(req, res) {
    const studentId = req.params.id;
    const { fullname, cpm_no, registration_no, cgpa, batch, extra_curricular, who_edited, gender } = req.body;
  
    // Validate input data
    if (!fullname || !cpm_no || !registration_no || cgpa === undefined || !batch || !extra_curricular) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (fullname, cpm_no, registration_no, cgpa, batch, extra_curricular)',
      });
    }
  
    try {
      // Update the student information in both tables
      const result = await studentModel.updateStudentDetails(studentId, {
        fullname,
        cpm_no,
        registration_no,
        cgpa,
        batch,
        extra_curricular,
        who_edited,
        gender,
      });
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: 'Student not found or no changes made',
        });
      }
  
      // Send a success response
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
      });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
}

// Controller for deleting a student
async function deleteStudentController(req, res) {
    const studentId = req.params.id;
  
    try {
      const result = await studentModel.deleteStudent(studentId);
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
  
module.exports = { getStudentByIdController, getAllStudentsController, addStudentController, updateStudentController, deleteStudentController };