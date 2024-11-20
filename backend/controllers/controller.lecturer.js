const lecturerModel = require('../models/model.lecturer');
const userModel = require('../models/model.user');
const bcrypt = require('bcryptjs');

// Controller function to get lecturer by ID
async function getLecturerByIdController(req, res) {
    const lecturerId = req.params.id;

    try {
        const lecturer = await lecturerModel.getLecturerById(lecturerId);

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: 'Lecturer not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: lecturer
        });
    } catch (error) {
        console.error('Error fetching lecturer by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller function to get all lecturers
async function getAllLecturersController(req, res) {
    try {
        const lecturers = await lecturerModel.getAllLecturers();

        return res.status(200).json({
            success: true,
            data: lecturers
        });
    } catch (error) {
        console.error('Error fetching all lecturers:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller for adding a new lecturer
async function addLecturerController(req, res) {
    const { fullname, email, password, user_type, position, hod } = req.body;

    // Basic validation
    if (!fullname || !email || !password || !user_type || !position || (hod === undefined || hod === null)) {
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
            await lecturerModel.updateLecturerDetails(existingUser.user_id, {
                fullname,
                position
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

            // Add lecturer entry
            const newLecturer = {
                user_id: userId,
                position,
                hod
            };
            await lecturerModel.createLecturer(newLecturer);
        }

        // Response
        return res.status(201).json({
            success: true,
            message: 'Lecturer added successfully!'
        });
    } catch (error) {
        console.error('Error adding lecturer:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Controller function to handle updating a lecturer
async function updateLecturerController(req, res) {
    const lecturerId = req.params.id;
    const { fullname, position } = req.body;

    // Validate input data
    if (!fullname || !position) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required (fullname, position)',
        });
    }

    try {
        // Update the lecturer information
        const result = await lecturerModel.updateLecturerDetails(lecturerId, {
            fullname,
            position
        });

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: 'Lecturer not found or no changes made',
            });
        }

        // Send a success response
        res.status(200).json({
            success: true,
            message: 'Lecturer updated successfully',
        });
    } catch (error) {
        console.error('Error updating lecturer:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

// Controller for deleting a lecturer
async function deleteLecturerController(req, res) {
    const lecturerId = req.params.id;

    try {
        const result = await lecturerModel.deleteLecturer(lecturerId);
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

module.exports = {
    getLecturerByIdController,
    getAllLecturersController,
    addLecturerController,
    updateLecturerController,
    deleteLecturerController
};
