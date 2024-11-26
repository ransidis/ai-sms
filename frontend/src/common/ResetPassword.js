import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await axios.put('http://localhost:8080/api/user/update-password', { token, newPassword: password });
        if (response.status === 200) {
          setPasswordResetSuccess(true);
        }
      } catch (error) {
        console.error('Error resetting password:', error);
      }
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

                <Link to="/reset-email">
                  <Button style={{ marginLeft: 10 }}>
                    Back
                  </Button>
                </Link>
              </Form>
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

export default ResetPassword;