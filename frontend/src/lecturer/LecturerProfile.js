
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';

const LecturerProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    position: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      try {
        const response = await axios.get(`http://localhost:8080/api/lecturer/details/${decoded.user_id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    try {
      await axios.put(`http://localhost:8080/api/lecturer/update/${decoded.user_id}`, formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <Row className='lecturer-row'>
      <Link to='/profile'><Button>👈 back</Button></Link>
      <Col className='d-flex flex-column m-2'>
        <h3>Personal Information</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">Full Name</Form.Label>
            <Col sm="10">
              <Form.Control 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">Position</Form.Label>
            <Col sm="10">
              <Form.Control 
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit" size="md">
            Save
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default LecturerProfile;