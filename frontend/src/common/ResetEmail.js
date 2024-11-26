import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ResetEmail = () => {
  const [email, setEmail] = useState(''); // State to track email input
  const [emailSent, setEmailSent] = useState(false); // State for success message
  const [error, setError] = useState(''); // State for error messages

  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError(''); // Clear previous errors
    setEmailSent(false); // Reset success state

    try {
      // Make API request to reset password endpoint
      const response = await axios.post('http://localhost:8080/api/user/reset-password', { email });

      if (response.data.success) {
        setEmailSent(true); // Show success message
      } else {
        setError(response.data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      console.error('Error sending reset link:', err);

      if (err.response && err.response.data) {
        setError(err.response.data.message); // Error message from the server
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="Reset_Email">
      <h1 className="mt-5 text-center">AI Integrated Student Management System</h1>
      <h2 className="mt-3 text-center">Reset Password</h2>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '60vh' }}
      >
        <Container>
          <Row className="d-flex flex-column justify-content-center align-items-center">
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter your email to receive a password reset link.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" disabled={!email.trim()}>
                    Send Reset Link
                  </Button>
                  <Link to="/login">
                    <Button variant="secondary">Back</Button>
                  </Link>
                </div>
              </Form>

              {/* Success message */}
              {emailSent && (
                <div className="mt-3 text-success">
                  <p>A password reset link has been sent to your email.</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-3 text-danger">
                  <p>{error}</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ResetEmail;
