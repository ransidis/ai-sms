import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const SearchStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});

  // Fetch all students and filter based on the search query
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      setError('Please enter a search query');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/student/all');
      const allStudents = response.data.data || [];

      // Filter students based on search query (fullname or email)
      const filtered = allStudents.filter(
        (student) =>
          student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredSuggestions(filtered);
      setError(''); // Clear previous errors
    } catch (error) {
      console.error('Error fetching student list:', error);
      setFilteredSuggestions([]);
      setError('Error fetching student list');
    }
  };

  // Fetch detailed student info for selected student
  const fetchStudentInfo = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/student/details/${userId}`);
      setStudentInfo(response.data.data || null);
      setUpdatedInfo(response.data.data || {});
      setError(''); // Clear previous errors
    } catch (error) {
      console.error('Error fetching student information:', error);
      setStudentInfo(null);
      setError('Error fetching student information');
    }
  }, []);

  // Update student information
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/student/update/${studentInfo.user_id}`, updatedInfo);
      setStudentInfo(updatedInfo);
      setIsEditing(false);
      alert('Student details updated successfully');
      setError(''); // Clear previous errors
    } catch (error) {
      console.error('Error updating student information:', error);
      setError('Error updating student information');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="Dashboard">
      <Container>
       
        <Row className="student-row">
          <Col className="d-flex flex-column text-center m-2">
            <Form.Group className="mb-3">
              <Form.Label>Search by Name or Email</Form.Label>
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleSearch} style={{ marginTop: '10px' }}>Search</Button>
            </Form.Group>
          </Col>
        </Row>
        <Row className="student-row">
          <Col className="d-flex flex-column text-center m-2">
            {filteredSuggestions.length > 0 && (
              <ul>
                {filteredSuggestions.map((student) => (
                  <li
                    key={student.user_id}
                    onClick={() => fetchStudentInfo(student.user_id)}
                    style={{ cursor: 'pointer', marginBottom: '5px', color: 'blue' }}
                  >
                    {student.fullname} ({student.email})
                  </li>
                ))}
              </ul>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {studentInfo && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={updatedInfo.fullname || ''}
                        readOnly={!isEditing}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={updatedInfo.email || ''}
                        readOnly={!isEditing}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Registration Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="registration_no"
                        value={updatedInfo.registration_no || ''}
                        readOnly={!isEditing}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Batch</Form.Label>
                      <Form.Control
                        type="text"
                        name="batch"
                        value={updatedInfo.batch || ''}
                        readOnly={!isEditing}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>CGPA</Form.Label>
                      <Form.Control
                        type="text"
                        name="cgpa"
                        value={updatedInfo.cgpa || ''}
                        readOnly={!isEditing}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Extra Curricular</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="extra_curricular"
                        value={updatedInfo.extra_curricular || ''}
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
                  </Col>
                </Row>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchStudents;
