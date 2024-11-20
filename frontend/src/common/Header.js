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

  if (!user) return null;

  return (
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
            <h2>Howdy, {user.fullname}!</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </Col>
      <Col className='d-flex flex-column text-end m-2'>
        <Button onClick={handleLogout} variant="danger">
          Log Out
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
