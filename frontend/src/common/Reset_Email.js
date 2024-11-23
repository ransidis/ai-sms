import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Reset_Email = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reset-password', { email });
      if (response.status === 200) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
    }
  };

  return (
    <div className='Reset_Email'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <h1 className='mt-5 text-center'>Reset Password</h1>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '60vh' }}>
        <Container>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter University email" 
                    value={email} 
                    onChange={handleEmailChange} 
                  />
                  <Form.Text className="text-muted">
                    Enter your university email to receive password reset link.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit">
                    Send Reset Link
                  </Button>

                  {/* Link to another page */}
                  <Link to="/login">
                    <Button>
                      Back
                    </Button>
                  </Link>
                </div>
              </Form>
              {emailSent && (
                <div className="mt-3 text-success">
                  <p>Reset link sent successfully. Please check your email.</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Reset_Email;
