const userModel = require('../models/model.user');
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Initialize the Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Controller function to get student by ID
async function getUserByID(req, res) {
  const userId = req.params.id;

  try {
      const user = await userModel.getUserById(userId);

      if (!user) {
      return res.status(404).json({
          success: false,
          message: 'User not found'
      });
      }

      return res.status(200).json({
      success: true,
      data: user
      });
  } catch (error) {
      console.error('Error fetching user by ID:', error);
      return res.status(500).json({
      success: false,
      message: 'Internal server error'
      });
  }
}

// Controller function to get all users
async function getAllUsers(req, res) {
  try {
      const students = await userModel.getAllUsers();

      return res.status(200).json({
      success: true,
      data: students
      });
  } catch (error) {
      console.error('Error fetching all users:', error);
      return res.status(500).json({
      success: false,
      message: 'Internal server error'
      });
  }
}

// Controller for user login
async function loginUser(req, res) {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required!'
    });
  }

  try {
    // Find the user by email
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        fullname: user.fullname,
        user_type: user.user_type
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return the token and user details
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Controller for Google Login
async function googleLogin(req, res) {
  const { id_token } = req.body;

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;

    // Check if the user exists by email
    let user = await userModel.getUserByEmail(email);

    if (!user) {
      // User does not exist, return error response
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    // If user exists but google_id is not set, update the user's google_id
    if (!user.google_id) {
      await userModel.updateGoogleId(user.user_id, googleId);
      user.google_id = googleId; // Update the user object locally
    }

    console.log(user.user_id)
    // Generate a JWT token
    const token = jwt.sign(

      {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        user_type: user.user_type
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return the token and user details
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}

// Controller for requesting a password reset
async function responseResetLink(req, res) {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
      return res.status(400).json({
          success: false,
          message: 'Email is required!'
      });
  }

  try {
      // Check if the email exists in the database
      const user = await userModel.getUserByEmail(email);
      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'Email not found!'
          });
      }

      // Generate a unique timestamp for the reset token
    const timestamp = Date.now(); // Current timestamp in milliseconds

    // Create JWT with timestamp for uniqueness
    const resetToken = jwt.sign(
      { id: user.user_id, email: user.email, timestamp },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await userModel.updateResetToken(user.user_id, resetToken)

    // Construct the password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Configure nodemailer for Mailtrap
    var transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
        from: `"Support" <hello@demomailtrap.com>`, 
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Hello ${user.fullname},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link is valid for 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email!'
    });

  } catch (error) {
      console.error('Error during password reset request:', error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
}

// Controller for updating the password
async function updatePassword(req, res) {
  const { token, newPassword } = req.body;

  // Check if token and new password are provided
  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required!'
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;

    // Find the user in the database
    const user = await userModel.getUserById(id);
    if (!user || user.email !== email || user.token !== token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token!'
      });
    }

    // Hash the new password (assuming bcrypt is being used)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await userModel.updatePassword(id, hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password has been updated successfully!'
    });

  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}


module.exports = { getUserByID, getAllUsers, loginUser, googleLogin, responseResetLink, updatePassword };