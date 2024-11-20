const db = require('../connection');

// Model to check if email already exists
async function checkEmailExists(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

// Find a user by User ID
async function getUserById(id) {
  const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Function to get all users
async function getAllUsers() {
  const query = `
      SELECT 
      user_id, 
      email, 
      fullname, 
      user_type
      FROM users;
  `;
  const [rows] = await db.execute(query);
  return rows;
}

// Update user's Google ID
async function updateGoogleId(userId, googleId) {
  const query = `UPDATE users SET google_id = ? WHERE user_id = ?`;
  await db.execute(query, [googleId, userId]);
}

// Update user's Google ID
async function updateResetToken(userId, token) {
  const query = `UPDATE users SET token = ? WHERE user_id = ?`;
  await db.execute(query, [token, userId]);
}

// Function to update the user's password in the database
async function updatePassword(userId, newPassword) {
  const query = `UPDATE users SET password = ?, token = NULL WHERE user_id = ?`;
  await db.execute(query, [newPassword, userId]);
}

// Find a user by Google ID
async function findUserByGoogleId(googleId) {
  const [rows] = await db.execute('SELECT * FROM users WHERE google_id = ?', [googleId]);
  return rows.length > 0 ? rows[0] : null;
}

// Model to find a user by email
async function getUserByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
}

// Function to create a new user
async function createUser(user) {
  const { fullname, email, password, user_type } = user;
  const query = `
    INSERT INTO users (fullname, email, password, user_type)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.execute(query, [fullname, email, password, user_type]);
  return result.insertId;
}

// Create a new user with Google ID
async function createGoogleUser(googleId, email, fullname, userType) {
  const [result] = await db.execute(
    'INSERT INTO users (google_id, email, fullname, user_type) VALUES (?, ?, ?, ?)',
    [googleId, email, fullname, userType]
  );
  return result.insertId;
}
  
module.exports = {
    checkEmailExists,
    getUserById,
    getAllUsers,
    updateResetToken,
    updateGoogleId,
    findUserByGoogleId,
    getUserByEmail,
    createUser,
    createGoogleUser,
    updatePassword
};
