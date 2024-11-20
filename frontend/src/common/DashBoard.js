import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(''); // State to track user role
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Assign HOD role if email matches the HOD email
      if (decoded.email === 'hod@sjp.ac.lk') {
        setRole('hod');
      } else {
        setRole(decoded.user_type); // Default to 'student' if no user_type
      }

      setUser(decoded);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className='Dashboard'>
      <Container>
        {role === 'hod' && (
          <Row className='hod-row'>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to='/addusers'>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Add/Edit Users
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  View Letter Requests
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Add/Edit News
                </Button>
              </Link>
            </Col>
          </Row>
        )}

        {role === 'lecturer' && (
          <Row className='lecturer-row'>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Edit Profile
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  View Student Details
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Add/Edit News
                </Button>
              </Link>
            </Col>
          </Row>
        )}

        {role === 'student' && (
          <Row className='student-row'>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Edit Profile
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  Letter Requests
                </Button>
              </Link>
            </Col>
            <Col className='d-flex flex-column text-center m-2'>
              <Link to=''>
                <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                  View Department News
                </Button>
              </Link>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DashBoard;
