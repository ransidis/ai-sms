import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const StudentProfile = () => {
  const [userId, setUserId] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStudentInfo = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/student/details/${userId}`);
      setStudentInfo(response.data.data);
      setUpdatedInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching student information:', error);
      setError('Error fetching student information');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
        fetchStudentInfo(decoded.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token');
      }
    }
  }, [fetchStudentInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const editorEmail = decoded.email;

      await axios.put(`http://localhost:8080/api/student/update/${userId}`, {
        ...updatedInfo,
        who_edited: editorEmail,
      });
      setStudentInfo(updatedInfo);
      setIsEditing(false);
      setSuccessMessage('Student details updated successfully');
    } catch (error) {
      console.error('Error updating student information:', error);
      setError('Error updating student information');
    }
  };

  return (
    <Container>
      <Row>
        <Col><Link to="/student-dashboard"><Button>Back</Button></Link></Col>
      </Row>
      <Row>
        <Col md={6}>
          <h3>Student Profile</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {studentInfo ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullname"
                  value={updatedInfo.fullname}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updatedInfo.email}
                  readOnly
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  name="registration_no"
                  value={updatedInfo.registration_no}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Batch</Form.Label>
                <Form.Control
                  type="text"
                  name="batch"
                  value={updatedInfo.batch}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CGPA</Form.Label>
                <Form.Control
                  type="text"
                  name="cgpa"
                  value={updatedInfo.cgpa}
                  readOnly
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Extra Curricular</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="extra_curricular"
              value={updatedInfo.extra_curricular}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex align-items-start justify-content-end">
            {isEditing ? (
              <Button onClick={handleUpdate}>Save</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
          {updatedInfo.who_edited && (
            <p className="text-muted mt-2">Your profile was last edited by {updatedInfo.who_edited}</p>
          )}
          {successMessage && (
            <p className="text-success mt-2 border p-2">{successMessage}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;
