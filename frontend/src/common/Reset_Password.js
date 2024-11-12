import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const Reset_Password = () => {
  // State for the passwords, validation message, and reset success
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);  // flag to check if passwords match
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false); // flag for success message

  // Function to handle password changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to handle confirm password changes
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Check if the passwords match
    setPasswordMatch(e.target.value === password);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Simulate password reset logic here (e.g., API call)
      setPasswordResetSuccess(true);
    }
  };

  return (
    <div className='Reset_Password'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <h1 className='mt-5 text-center'>Reset Password</h1>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{height: '60vh'}}>
        <Container>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Enter New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange} 
                  />
                  {!passwordMatch && <div style={{ color: 'red', marginTop: '5px' }}>Passwords do not match</div>}
                </Form.Group>

                <Button type="submit" disabled={!passwordMatch}>Reset</Button>

                <Link to="https://chatgpt.com/c/67265205-1064-800a-b232-c4adfe1e1e4f">
                  <Button style={{ marginLeft: 10 }}>
                    Back
                  </Button>
                </Link>
              </Form>

              {/* Show the success message if password reset is successful */}
              {passwordResetSuccess && (
                <div className="mt-3 text-success">
                  <p>Password reset successful. <Link to="/login">Click here to login</Link></p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Reset_Password;
