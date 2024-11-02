import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const LecRegister = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
    } else {
      setError('');
      // Proceed with registration logic here
      console.log("Registering with email:", email);
    }
  };

  return (
    <div className='Home'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <h1 className='mt-5 text-center'>Register - Lecturer Profile</h1>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '60vh' }}>
        <Container>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <Col md={6}>
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter University email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Eg: johndoe@mgt.sjp.ac.lk
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="stpassnew">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="stpassconfirm">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
                </Form.Group>

                <Button type="submit">
                  Register
                </Button>

                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" style={{ marginLeft: '10px' }}>
                    Back
                  </Button>
                </Link>

              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LecRegister;
