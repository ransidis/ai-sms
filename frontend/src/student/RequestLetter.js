import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct named import
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const RequestLetter = () => {
  const [userId, setUserId] = useState('');
  const [studentName, setStudentName] = useState(''); // New state for student name
  const [letterType, setLetterType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [address, setAddress] = useState('');
  const role = "Student";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token); // Correct usage
      console.log('Decoded Token:', decoded); // Debug log for decoded token
      setUserId(decoded.email); // Ensure this is the correct field for userId
      setStudentName(decoded.fullname); // Ensure this is the correct field for fullname
    } else {
      console.log('No token found in localStorage'); // Debug log for missing token
    }
  }, []);

  useEffect(() => {
    console.log('User ID:', userId); // Debug log for userId state
    console.log('Student Name:', studentName); // Debug log for studentName state
  }, [userId, studentName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!letterType || !purpose || !address) {
      alert('All fields are required!');
      return;
    }

    try {
      const today = new Date();
      const requested_date = today.toISOString().split('T')[0];

      const newLetter = {
        type: letterType,
        purpose,
        address,
        requested_date,
        user_id: userId
      };

      const response = await axios.post(`/api/letters/request/${userId}`, newLetter);

      if (response.data.success) {
        alert('Letter request submitted successfully');
      } else {
        alert('There was an error submitting the letter request!');
      }
    } catch (error) {
      console.error('Error generating letter:', error);
      if (error.response && error.response.status === 429) {
        alert('API rate limit exceeded');
      } else {
        alert('An error occurred while generating the letter');
      }
    }
  };

  return (
    <div className='RequestLetter'>
      {role === "Student" && (
        <div className='Student'>
          <Row>
            <Col><Link to=""><Button>Back</Button></Link></Col>
          </Row>
          <Row>
            <Col>
              <h3>Request a Letter</h3>
              <p>Student Name: {studentName}</p> {/* Display student name */}
              <p>Student ID: {userId}</p> {/* Display student ID */}
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Letter Type</Form.Label>
                  <Col sm="10">
                    <Form.Select value={letterType} onChange={(e) => setLetterType(e.target.value)}>
                      <option value="">Letter type</option>
                      <option value="Recommendation">Recommendation</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Purpose</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="textarea"
                      name="Purpose"
                      placeholder="Purpose of the letter"
                      rows={3}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">To Address</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="textarea"
                      name="To Address"
                      placeholder="To what external party this letter should be addressed"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Button variant="primary" type="submit" size="md">
                  Submit Request
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default RequestLetter;