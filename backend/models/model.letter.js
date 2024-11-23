const db = require('../connection');

// Function to get letter by ID
async function getAllLetters() {
  const query = `
      SELECT *
      FROM letter
  `;
  const [rows] = await db.execute(query);
  return rows;
}

// Function to get letter by ID
async function getLetterById(letterId) {
    const query = `
        SELECT *
        FROM letter
        WHERE id = ?
    `;
    const [rows] = await db.execute(query, [letterId]);
    return rows[0];
}

// Function to get student by ID
async function getLetterByStudentId(studentId) {
    const query = `
        SELECT *
        FROM letter
        WHERE user_id = ?
    `;
    const [rows] = await db.execute(query, [studentId]);
    return rows;
}

// Function to create a new letter
async function createLetter(letter) {
    const { type, purpose, address, requested_date, user_id } = letter;
    const query = `
      INSERT INTO letter (type, purpose, address, request_date, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Execute the insert query
    const [result] = await db.execute(query, [type, purpose, address, requested_date, "Pending Approval", user_id]);

    // Get the ID of the inserted record
    return result.insertId;
}

// Function to update letter content
async function updateLetterContent(letterId, content) {
    const query = `
        UPDATE letter
        SET content = ?, status = ?
        WHERE id = ?
    `;
    
    // Execute the update query
    await db.execute(query, [content, "Pending Approval", letterId]);
}

// Function to update letter in the database
async function generateLetter(letterId, updatedLetter) {

    try {
      const query = `
        UPDATE letter
        SET content = ?, status = ?, lecturer_id = ?
        WHERE id = ?
      `;
      const values = [updatedLetter.content, "Processing", updatedLetter.lecturer_id, letterId];
      
      // Execute query (assuming `db.query` is a wrapper around a database client like MySQL)
      const [rows] = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error updating letter:', error);
      throw error;
    }
}


// Function to update letter in the database
async function signLetter(letterId, updatedLetter) {

    try {
      const query = `
        UPDATE letter
        SET content = ?, status = ?, submitted_date = ?
        WHERE id = ?
      `;
      const values = [updatedLetter.content, "Ready", updatedLetter.submitted_date, letterId];
      
      // Execute query (assuming `db.query` is a wrapper around a database client like MySQL)
      const [rows] = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error updating letter:', error);
      throw error;
    }
}

// Function to update letter in the database
async function statusChange(letterId, updatedLetter) {

    try {
      const query = `
        UPDATE letter
        SET status = ?, lecturer_id = ?
        WHERE id = ?
      `;
      const values = [updatedLetter.status, updatedLetter.lecturerId, letterId];
      
      // Execute query (assuming `db.query` is a wrapper around a database client like MySQL)
      const [rows] = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error updating letter:', error);
      throw error;
    }
}

async function deleteLetter(letterId) {
  const query = `
    DELETE FROM letter
    WHERE id = ?
  `;
  const [result] = await db.execute(query, [letterId]);
  return result;
}

module.exports = {
    getLetterById,
    getLetterByStudentId,
    createLetter,
    generateLetter,
    updateLetterContent,
    signLetter,
    statusChange,
    getAllLetters,
    deleteLetter
};