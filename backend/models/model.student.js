const db = require('../connection');

// Function to get student by ID
async function getStudentById(studentId) {
    const query = `
        SELECT 
        users.user_id, 
        users.email, 
        users.fullname, 
        users.user_type, 
        students.cpm_no, 
        students.registration_no, 
        students.cgpa, 
        students.batch,
        students.extra_curricular,
        students.who_edited,
        students.gender
        FROM users
        INNER JOIN students ON users.user_id = students.user_id
        WHERE users.user_id = ? AND users.user_type = 'student';
    `;
    const [rows] = await db.execute(query, [studentId]);
    return rows[0];
}

// Function to get all students
async function getAllStudents() {
    const query = `
        SELECT 
        users.user_id, 
        users.email, 
        users.fullname, 
        users.user_type, 
        students.cpm_no, 
        students.registration_no, 
        students.cgpa, 
        students.batch, 
        students.extra_curricular,
        students.gender
        FROM users
        INNER JOIN students ON users.user_id = students.user_id
        WHERE users.user_type = 'student';
    `;
    const [rows] = await db.execute(query);
    return rows;
}

// Function to create a new student
async function createStudent(student) {
    const { user_id, cpm_no, registration_no, cgpa, batch, extra_curricular, gender } = student;
    const query = `
      INSERT INTO students (user_id, cpm_no, registration_no, cgpa, batch, extra_curricular, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [user_id, cpm_no, registration_no, cgpa, batch, extra_curricular, gender || 'Male']);
}

// Function to update fullname in users and other details in students
async function updateStudentDetails(userId, studentData) {
    const { fullname, cpm_no, registration_no, cgpa, batch, extra_curricular, who_edited, gender } = studentData;
  
    // Update query for `users` table
    const updateUserQuery = `
      UPDATE users
      SET fullname = ?
      WHERE user_id = ?
    `;
  
    // Update query for `students` table
    const updateStudentQuery = `
      UPDATE students
      SET 
        cpm_no = ?,
        registration_no = ?,
        cgpa = ?,
        batch = ?,
        extra_curricular = ?,
        who_edited = ?,
        gender = ?
      WHERE user_id = ?
    `;
  
    // Execute the queries in a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
  
      // Update fullname in the users table
      await connection.execute(updateUserQuery, [fullname, userId]);
  
      // Update student details in the students table
      await connection.execute(updateStudentQuery, [
        cpm_no,
        registration_no,
        cgpa,
        batch,
        extra_curricular,
        who_edited,
        gender,
        userId,
      ]);
  
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
}

// Delete student function
async function deleteStudent(studentId) {
    const connection = await db.getConnection();
    try {
      // Start a transaction
      await connection.beginTransaction();
  
      // 1. Delete the student record
      const studentDeleteQuery = 'DELETE FROM students WHERE user_id = ?';
      await connection.query(studentDeleteQuery, [studentId]);
  
      // 2. Delete the user record (ensure you use the correct foreign key)
      const userDeleteQuery = 'DELETE FROM users WHERE user_id = ?';
      await connection.query(userDeleteQuery, [studentId]);
  
      // Commit the transaction if both delete operations were successful
      await connection.commit();
      return { success: true, message: 'Student and associated user deleted successfully.' };
    } catch (error) {
      // Rollback the transaction if there was any error
      await connection.rollback();
      console.error('Error deleting student and user:', error);
      return { success: false, message: 'Failed to delete student and associated user.' };
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  }
    
module.exports = {
    getStudentById,
    getAllStudents,
    createStudent,
    updateStudentDetails,
    deleteStudent
};