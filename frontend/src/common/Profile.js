import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Profile = () => {
  const role = "Lecturer";
  const [formData, setFormData] = useState({
    fullName: "",
    cpmNumber: "",
    registerNumber: "",
    batch: "",
    completionYear: "",
    gpa: "",
    extraCurricular: ""
  });

  // Handle batch selection and set completion year
  const handleBatchChange = (event) => {
    const selectedBatch = event.target.value;
    const batchYear = parseInt(selectedBatch.split("/")[0], 10);
    setFormData({
      ...formData,
      batch: selectedBatch,
      completionYear: batchYear ? batchYear + 5 : ""
    });
  };

  // Handle GPA input to restrict to numbers only
  const handleGpaChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-4](\.[0-9]?)?$/; // Only allows numbers from 0 to 4 with up to one decimal place
    if (regex.test(value) || value === "") {
      setFormData({
        ...formData,
        gpa: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formData to your database here
    console.log("Form data submitted:", formData);
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className='Profile'>
      <Container className='d-flex flex-column justify-content-around vh-100'>
        <Row>
          <Col className='d-flex flex-column text-center m-2'>
            <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
              <div style={{ marginRight: '10px' }}>
                <svg height="50" width="50" viewBox="0 0 24 24" fill="#c4c4c4">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <h2>Howdy, [HOD]</h2>
                <p>xxx@mgt.sjp.ac.lk</p>
              </div>
            </div>
          </Col>
          <Col className='d-flex flex-column text-end m-2'>
            <Link to="/"><Button>Log Out</Button></Link>
          </Col>
        </Row>

        {role === "Student" && (
          <Row className='student-row'>
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
                  <Form.Label column sm="2">CPM Number</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      name="cpmNumber"
                      value={formData.cpmNumber}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Register Number</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      name="registerNumber"
                      value={formData.registerNumber}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Your Batch</Form.Label>
                  <Col sm="10">
                    <Form.Select 
                      value={formData.batch}
                      onChange={handleBatchChange}
                    >
                      <option value="">Select Your Batch</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                      <option value="2021/2022">2021/2022</option>
                      <option value="2019/2020">2019/2020</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Degree Completion Year</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      type="text" 
                      value={formData.completionYear} 
                      readOnly 
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Current GPA</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      type="text" 
                      name="gpa" 
                      value={formData.gpa} 
                      onChange={handleGpaChange} 
                      placeholder="e.g., 3.5" 
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Extra Curricular</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      as="textarea" 
                      name="extraCurricular" 
                      placeholder="Add your department related extra-curricular activities" 
                      rows={3} 
                      value={formData.extraCurricular} 
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
        )}

{role === "Lecturer" && (
          <Row className='Lecturer-row'>
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
                      name="cpmNumber"
                      value={formData.cpmNumber}
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
        )}
      </Container>
    </div>
  );
};

export default Profile;
