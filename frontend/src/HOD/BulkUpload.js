import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Container, Row, Col, Button, Table, Alert } from 'react-bootstrap'; // For consistent styling

const BulkUpload = () => {
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState(null); // To track whether we are uploading students or lecturers
  const [uploadStatus, setUploadStatus] = useState(''); // To display success or failure messages

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log('Parsed CSV data:', result);

          if (uploadType === 'students') {
            // Filter out any empty rows for students
            const validStudents = result.data.filter(student => student.fullname && student.email);
            setStudents(validStudents);
          } else if (uploadType === 'lecturers') {
            // Filter out any empty rows for lecturers
            const validLecturers = result.data.filter(lecturer => lecturer.fullname && lecturer.email && lecturer.password && lecturer.position);
            setLecturers(validLecturers);
          }
        },
        header: true, // Assumes the first row contains headers
      });
    }
  };

  // Function to send students to the backend
  const uploadStudents = async () => {
    setIsUploading(true);
    setError(null);
    setUploadStatus('');

    try {
      for (const student of students) {
        const studentData = {
          fullname: student.fullname,
          email: student.email,
          password: student.password, // You may want to hash this server-side
          user_type: 'student',
          cpm_no: student.cpm_no,
          registration_no: student.registration_no,
          cgpa: student.cgpa,
          batch: student.batch,
          extra_curricular: student.extra_curricular,
          who_edited: null, // Add this line
        };

        await axios.post('http://localhost:8080/api/student/add', studentData);
      }
      setUploadStatus('Students upload successful!');
    } catch (err) {
      console.error('Error uploading students:', err);
      setUploadStatus('Students upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to send lecturers to the backend
  const uploadLecturers = async () => {
    setIsUploading(true);
    setError(null);
    setUploadStatus('');

    try {
      for (const lecturer of lecturers) {
        const lecturerData = {
          fullname: lecturer.fullname,
          email: lecturer.email,
          password: lecturer.password, // You may want to hash this server-side
          user_type: 'lecturer',
          position: lecturer.position,
          hod: false, // Always send false
        };

        await axios.post('http://localhost:8080/api/lecturer/add', lecturerData);
      }
      setUploadStatus('Lecturers upload successful!');
    } catch (err) {
      console.error('Error uploading lecturers:', err);
      setUploadStatus('Lecturers upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <h2 className="text-center mt-4 mb-4">Bulk Upload</h2>
      <Row className="justify-content-center">
        {/* Buttons to choose between student and lecturer upload */}
        <Col md={5} className="mb-3">
          <Button variant="primary" style={{ width: '100%' }} onClick={() => setUploadType('students')}>Upload Students</Button>
        </Col>
        <Col md={5} className="mb-3">
          <Button variant="primary" style={{ width: '100%' }} onClick={() => setUploadType('lecturers')}>Upload Lecturers</Button>
        </Col>
      </Row>

      {/* File input */}
      {uploadType === 'students' && (
        <div className="mb-3">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <label className="btn btn-secondary mt-2" style={{ width: '100%' }}>Choose Students CSV</label>
        </div>
      )}

      {uploadType === 'lecturers' && (
        <div className="mb-3">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <label className="btn btn-secondary mt-2" style={{ width: '100%' }}>Choose Lecturers CSV</label>
        </div>
      )}

      {/* Show students' records if uploading students */}
      {uploadType === 'students' && students.length > 0 && (
        <div>
          <h3>Student Records</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>CPM No</th>
                <th>Registration No</th>
                <th>Batch</th>
                <th>CGPA</th>
                <th>Extra Curricular</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.fullname}</td>
                  <td>{student.email}</td>
                  <td>{student.cpm_no}</td>
                  <td>{student.registration_no}</td>
                  <td>{student.batch}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.extra_curricular}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={uploadStudents} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Students'}
          </Button>
        </div>
      )}

      {/* Show lecturers' records if uploading lecturers */}
      {uploadType === 'lecturers' && lecturers.length > 0 && (
        <div>
          <h3>Lecturer Records</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map((lecturer, index) => (
                <tr key={index}>
                  <td>{lecturer.fullname}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.password}</td>
                  <td>{lecturer.position}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={uploadLecturers} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Lecturers'}
          </Button>
        </div>
      )}

      {/* Display upload status message */}
      {uploadStatus && (
        <div className="mt-3">
          <Alert variant={uploadStatus.includes('successful') ? 'success' : 'danger'}>
            {uploadStatus}
          </Alert>
        </div>
      )}

      {/* Display error message if there is one */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default BulkUpload;
