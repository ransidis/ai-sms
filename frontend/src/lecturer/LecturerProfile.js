import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const LecturerProfile = () => {
  const [userId, setUserId] = useState('');
  const [lecturerInfo, setLecturerInfo] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});

  const fetchLecturerInfo = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/lecturer/details/${userId}`);
      setLecturerInfo(response.data.data);
      setUpdatedInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching lecturer information:', error);
      setError('Error fetching lecturer information');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
        fetchLecturerInfo(decoded.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token');
      }
    }
  }, [fetchLecturerInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/lecturer/update/${userId}`, updatedInfo);
      setLecturerInfo(updatedInfo);
      setIsEditing(false);
      alert('Lecturer profile updated successfully');
    } catch (error) {
      console.error('Error updating lecturer profile:', error);
      setError('Error updating lecturer profile');
    }
  };

  return (
    <Row className='lecturer-row'>
      <Col md={6} className='d-flex flex-column m-2'>
        <h3>Lecturer Profile</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {lecturerInfo ? (
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4">Full Name</Form.Label>
              <Col sm="8">
                <Form.Control
                  name="fullname"
                  value={updatedInfo.fullname}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4">Position</Form.Label>
              <Col sm="8">
                <Form.Control
                  name="position"
                  value={updatedInfo.position}
                  readOnly={!isEditing}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            
            
            <div className="d-flex align-items-start justify-content-end">
              {isEditing ? (
                <Button onClick={handleUpdate}>Save</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </Form>
        ) : (
          <p>Loading...</p>
        )}
      </Col>
    </Row>
  );
};

export default LecturerProfile;
