
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='Dashboard'>
      <Container>

        <Row className='student-row'>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/student-profile'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                Edit Profile
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/letter-requests'>
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
      </Container>
    </div>
  );
};

export default StudentDashboard;