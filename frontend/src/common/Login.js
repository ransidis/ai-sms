import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/auth', {
        email,
        password,
      });
      const { token } = response.data;

      // Store token first
      localStorage.setItem('token', token);
      
      // Setup axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const decoded = jwtDecode(token);
      localStorage.setItem('userType', decoded.user_type);
      localStorage.setItem('userEmail', decoded.email);

      setMessageType('success');
      setMessage('Login successful');
      if (decoded.email === 'hod@sjp.ac.lk' || decoded.email === 'lasith@sjp.ac.lk' || decoded.email === 'malan@nsbm.com') {
        navigate('/hod-dashboard');
      } else if (decoded.user_type === 'student') {
        navigate('/student-dashboard');
      } else if (decoded.user_type === 'lecturer') {
        navigate('/lecturer-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessageType('danger');
      setMessage(error.response?.data?.message || 'Invalid email or password!');
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
      const { token } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const decoded = jwtDecode(token);
      localStorage.setItem('userType', decoded.user_type);
      localStorage.setItem('userEmail', decoded.email);

      setMessageType('success');
      setMessage('Google Login successful');
      if (decoded.email === 'hod@sjp.ac.lk' || decoded.email === 'lasith@sjp.ac.lk' || decoded.email === 'malan@nsbm.com') {
        navigate('/hod-dashboard');
      } else if (decoded.user_type === 'student') {
        navigate('/student-dashboard');
      } else if (decoded.user_type === 'lecturer') {
        navigate('/lecturer-dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessageType('danger');
      setMessage(error.response?.data?.message || 'Google Login failed!');
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
                {message && (
                  <div className={`mt-3 alert alert-${messageType}`}>
                    {message}
                  </div>
                )}
              </Form>
            </Col>
          </Row>
          <Row className='mt-4 text-center d-flex flex-column justify-content-center align-items-center'>
            <h3>Or Login with Google</h3>
            <div style={{ width: '20%'}}>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setMessageType('danger');
                  setMessage('Google Sign-In Failed');
                }}
              />
            </GoogleOAuthProvider>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Login;
