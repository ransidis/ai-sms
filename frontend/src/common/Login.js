import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/auth', {
        email,
        password,
      });
      const { token, user_type } = response.data;

      // Store token and user type in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user_type', user_type);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed! Please try again.');
    }
  };

  // Handle Google Login success
  const handleGoogleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/auth/google',
        { id_token }
      );
      const { token, user_type } = response.data;

      // Store token and user type in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user_type', user_type);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Google Login failed!');
    }
  };

  return (
    <div className='Home'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <h1 className='mt-5 text-center'>Login</h1>
      <div
        className='d-flex flex-column justify-content-center align-items-center'
        style={{ height: '60vh' }}
      >
        <Container>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <Col md={6}>
              <Form onSubmit={handleLogin}>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter University email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Text className='text-muted'>
                    Eg: 98730@mgt.sjp.ac.lk / abc@mgt.sjp.ac.lk
                  </Form.Text>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Link to='/reset-email'>Forgot Password?</Link>
                </Form.Group>
                <Button type='submit'>Login</Button>
                <Link to='/' style={{ marginLeft: 10 }}>
                  <Button>Back</Button>
                </Link>
              </Form>
            </Col>
          </Row>
          <Row className='mt-4 text-center'>
            <h3>Or Login with Google</h3>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google Sign-In Failed')}
              />
            </GoogleOAuthProvider>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Login;
