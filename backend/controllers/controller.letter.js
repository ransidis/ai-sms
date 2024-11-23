const userModel = require('../models/model.user');
const letterModel = require('../models/model.letter');
const studentModel = require('../models/model.student');
const lecturerModel = require('../models/model.lecturer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Controller function to get letters
async function getAllLetterController(req, res) {
  try {
    const letters = await letterModel.getAllLetters();

    return res.status(200).json({
        success: true,
        data: letters
    });
} catch (error) {
    console.error('Error fetching all lecturers:', error);
    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
}

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

async function requestLetterController(req, res) {
  const user_id = req.params.id;
  const { type, purpose, address } = req.body;

  if (!type || !purpose || !address ) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {

    const today = new Date();
    const requested_date = today.toISOString().split('T')[0];

    // Save letter info to DB
    const newLetter = {
      type, purpose, address, requested_date, user_id
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

async function generateLetterController(req, res) {
  const letterId = req.params.id;
  const { lecturerId } = req.body;

  if (!lecturerId) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Fetch letter details
    const letter = await letterModel.getLetterById(letterId);
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Letter not found' });
    }

    // Fetch lecturer details
    const lecturer = await lecturerModel.getLecturerById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ success: false, message: 'Lecturer not found' });
    }

    const student = await studentModel.getStudentById(letter.user_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const today = new Date();
    const today_date = today.toISOString().split('T')[0];

    // Prompt construction
    const prompt = `
        I need to directly display your generated output on my webpage. please only generate letter.
        Don't add \'\'\'html and \'\'\'
        Generate letter to return html web page. use html tags.

        if no addrress set use default address as Faculty of Management Studies and Commerce, University of Jayewardenepura, Nugegoda, 10250.

        Letter details:
        Write a formal ${letter.type} letter addressed to ${letter.address} . 
        The purpose of this letter is to ${letter.purpose}.
        
        Letter requested by  student:
        Applicant's Name: ${student.fullname}
        Applicant's Position: student
        Applicant's registration Number: ${student.registration_no}
        Applicant's CGPA: ${student.cgpa}
        Applicant's Batch: ${student.batch}
        Applicant's Extra curricular activities: ${student.extra_curricular}

        My details:
        My name: ${lecturer.fullname}
        Address: Faculty of Management Studies and Commerce,
              University of Jayewardenepura,
              Nugegoda,
              10250
        My position: ${lecturer.position}


        Sample letter is below here -

        <div>
          <div>
            <p>
              <span id="lecturerPosition">
                <!-- Insert HOD and position dynamically -->
                ${lecturer.hod ? "Head of the Department, " : ""}${lecturer.position}
              </span><br />
              <span id="lecturerFullName">${lecturer.fullname}</span><br />
              Faculty of Management Studies and Commerce,<br />
              University of Jayewardenepura,<br />
              Nugegoda,<br />
              10250
            </p>
          </div>

          <div>
            <p>
              <span id="letterAddress">${letter.address}</span>
            </p>
          </div>

          <div>
            <p>
              <span id="todayDate">${today_date}</span>
            </p>
          </div>

          <div>
            <p id="content">
              <!-- Content generated dynamically by Gemini -->
              Applicant's Name: ${student.fullname}
              Applicant's Position: student
              Applicant's registration Number: ${student.registration_no}
              Applicant's CGPA: ${student.cgpa}
              Applicant's Batch: ${student.batch}
              Applicant's Extra curricular activities: ${student.extra_curricular}
              [Content will be generated here by Gemini]
            </p>
          </div>

          <div>
            <p>
              Sincerely,<br />
              <span id="lecturerSignature">${lecturer.fullname}</span><br />
              Faculty of Management Studies and Commerce,<br />
              University of Jayewardenepura,<br />
              Nugegoda,<br />
              10250
            </p>
          </div>
        </div>
    `;

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    const updatedLetter = {
      content,
      lecturerId,
    };

    // Update letter in the database
    await letterModel.generateLetter(letterId, updatedLetter);

    return res.status(200).json({
      success: true,
      message: 'Letter content updated successfully',
      content,
    });
  } catch (error) {
    console.error('Error generating letter:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}


// Controller to handle letter signing and updating content with image upload
async function updateLetterSignController(req, res) {

  const letterId = req.params.id;
  const { content } = req.body;

  const today = new Date();
  const submitted_date = today.toISOString().split('T')[0];

  const updatedLetter = {
    content,
    submitted_date
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

async function changeStatusController(req, res) {

  const letterId = req.params.id;
  const { status, lecturerId } = req.body;

  const updatedLetter = {
    status,
    lecturerId
  };

  try {
    // Call the model to update the letter
    await letterModel.statusChange(letterId, updatedLetter);

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

async function deleteLetterController(req, res) {
  const letterId = req.params.id;

  try {
    const result = await letterModel.deleteLetter(letterId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Letter deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting letter:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  getLetterByIdController,
  requestLetterController,
  getLetterByStudentIdController,
  generateLetterController,
  updateLetterSignController,
  changeStatusController,
  getAllLetterController,
  deleteLetterController
};