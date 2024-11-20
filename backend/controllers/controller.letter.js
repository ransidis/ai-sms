const userModel = require('../models/model.user');
const letterModel = require('../models/model.letter');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Controller function to get letter by atudent ID
async function getLetterByIdController(req, res) {
  const letterId = req.params.id;

  try {
      const letter = await letterModel.getLetterById(letterId)

      if (!letter) {
      return res.status(404).json({
          success: false,
          message: 'Letter not found'
      });
      }

      return res.status(200).json({
      success: true,
      data: letter
      });
  } catch (error) {
      console.error('Error fetching letter by ID:', error);
      return res.status(500).json({
      success: false,
      message: 'Internal server error'
      });
  }
}

// Controller function to get letter by atudent ID
async function getLetterByStudentIdController(req, res) {
  const studentId = req.params.id;

  try {
      const letter = await letterModel.getLetterByStudentId(studentId);

      if (!letter) {
      return res.status(404).json({
          success: false,
          message: 'Letter not found'
      });
      }

      return res.status(200).json({
      success: true,
      data: letter
      });
  } catch (error) {
      console.error('Error fetching letter by ID:', error);
      return res.status(500).json({
      success: false,
      message: 'Internal server error'
      });
  }
}

async function generateLetterController(req, res) {
  const { type, purpose, address, user_id  } = req.body;

  if (!type || !purpose || !address || !user_id) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {

    const user = await userModel.getUserById(user_id);

    const today = new Date();
    const requested_date = today.toISOString().split('T')[0];

    const prompt = `
        Write a formal ${type} letter addressed to ${address}. 
        The purpose of this letter is to ${purpose}. 
        The letter should be from ${user.fullname}, who is a ${user.user_type}. 
        Include these details directly in the letter:
        1. Full name of the sender: ${user.fullname}
        2. Addressee's name: ${address}
        3. Purpose: ${purpose}
        4. Avoid placeholders like [Your Name], and use actual names and details.
        5. Format the letter professionally with appropriate line breaks and indentation.

        To:
        ${address}
        Faculty of Management studies and Commerce,
        University of Jayewardenepura,
        Nugegode,
        10250

        Date: ${requested_date}

        [content need to generate by gemini]

        Sincerely,

        student name :${user.fullname},
        student Id :${user.registration_no},
        student address: University of Jayewardenepura, Nugegode.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text()

    // Save letter info to DB
    const newLetter = {
      type, purpose, address, requested_date, content, user_id
    };

    const letterId = await letterModel.createLetter(newLetter)

    return res.status(200).json({
      success: true,
      data: letterId
      });

  } catch (error) {
    console.error('Error generating letter:', error);
    if (error.code === 429) {
      res.status(429).json({ 
        success: false,
        error: 'API rate limit exceeded' });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'An error occurred while generating the letter' });
    }
  }
}

// Controller to update a news entry
async function updateLetterContentController(req, res) {
  const letterId = req.params.id;
  const { content } = req.body;

  if (!content) {
      return res.status(400).json({
          success: false,
          message: 'Content field is required!'
      });
  }

  try {
      await letterModel.updateLetterContent(letterId, content)

      return res.status(200).json({
          success: true,
          message: 'Letter content updated successfully'
      });
  } catch (error) {
      console.error('Error updating letter content:', error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
}

// Controller to handle letter signing and updating content with image upload
async function updateLetterSignController(req, res) {

  const letterId = req.params.id;
  const { content, lecturer_id } = req.body;

  const today = new Date();
  const submitted_date = today.toISOString().split('T')[0];

  const updatedLetter = {
    content,
    submitted_date,
    lecturer_id
  };

  try {
    // Call the model to update the letter
    await letterModel.signLetter(letterId, updatedLetter);

    return res.status(200).json({
      success: true,
      message: 'Letter content updated successfully'
    });
  } catch (error) {
    console.error('Error updating letter content:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  getLetterByIdController,
  getLetterByStudentIdController,
  generateLetterController,
  updateLetterContentController,
  updateLetterSignController
};