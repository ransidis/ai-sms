const db = require('../connection');

// Function to get lecturer by ID
async function getLecturerById(lecturerId) {
    const query = `
        SELECT 
        users.user_id, 
        users.email, 
        users.fullname, 
        users.user_type, 
        lecturers.position, 
        lecturers.hod
        FROM users
        INNER JOIN lecturers ON users.user_id = lecturers.user_id
        WHERE users.user_id = ? AND users.user_type = 'lecturer';
    `;
    const [rows] = await db.execute(query, [lecturerId]);
    return rows[0];
}

// Function to get all lecturers
async function getAllLecturers() {
    const query = `
        SELECT 
        users.user_id, 
        users.email, 
        users.fullname, 
        users.user_type, 
        lecturers.position, 
        lecturers.hod
        FROM users
        INNER JOIN lecturers ON users.user_id = lecturers.user_id
        WHERE users.user_type = 'lecturer';
    `;
    const [rows] = await db.execute(query);
    return rows;
}

// Function to create a new lecturer
async function createLecturer(lecturer) {
    const { user_id, position, hod } = lecturer;
    const query = `
      INSERT INTO lecturers (user_id, position, hod)
      VALUES (?, ?, ?)
    `;
    await db.execute(query, [user_id, position, hod]);
}

// Function to update fullname in users and other details in lecturers
async function updateLecturerDetails(userId, lecturerData) {
    const { fullname, position } = lecturerData;
  
    // Update query for `users` table
    const updateUserQuery = `
      UPDATE users
      SET 
        fullname = ?
      WHERE user_id = ?
    `;
  
    // Update query for `lecturers` table
    const updateLecturerQuery = `
      UPDATE lecturers
      SET 
        position = ?
      WHERE user_id = ?
    `;
  
    // Execute the queries in a transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
  
      // Update fullname in the users table
      await connection.execute(updateUserQuery, [fullname, userId]);
  
      // Update lecturer details in the lecturers table
      await connection.execute(updateLecturerQuery, [
        position,
        userId
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

// Delete lecturer function
async function deleteLecturer(lecturerId) {
    const connection = await db.getConnection();
    try {
      // Start a transaction
      await connection.beginTransaction();
  
      // 1. Delete the lecturer record
      const lecturerDeleteQuery = 'DELETE FROM lecturers WHERE user_id = ?';
      await connection.query(lecturerDeleteQuery, [lecturerId]);
  
      // 2. Delete the user record
      const userDeleteQuery = 'DELETE FROM users WHERE user_id = ?';
      await connection.query(userDeleteQuery, [lecturerId]);
  
      // Commit the transaction if both delete operations were successful
      await connection.commit();
      return { success: true, message: 'Lecturer and associated user deleted successfully.' };
    } catch (error) {
      // Rollback the transaction if there was any error
      await connection.rollback();
      console.error('Error deleting lecturer and user:', error);
      return { success: false, message: 'Failed to delete lecturer and associated user.' };
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
}

module.exports = {
    getLecturerById,
    getAllLecturers,
    createLecturer,
    updateLecturerDetails,
    deleteLecturer
};
