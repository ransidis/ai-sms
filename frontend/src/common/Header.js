import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!user) return null;

  return (
    <Row>
      
      <Col className='d-flex flex-column text-center m-2'>
        <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <h2>Howdy, {user.fullname}!</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </Col>
      <Col className='d-flex flex-row justify-content-end m-2'>
        <Button onClick={handleBack} style={{ width: '20%', height: '50%', fontSize: '20px', marginRight: '10px' }}>
          Back
        </Button>
        <Button onClick={handleLogout} style={{ width: '20%', height: '50%', fontSize: '20px' }}>
          Logout
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
