import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const HODDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='Dashboard'>
      <Container>
        <Row className='hod-row'>
          
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/addusers'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                Add User
              </Button>
            </Link>
          </Col> 
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/letter-requests'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                View Letter Requests
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/search-students'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                View Student Details
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/news'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                Add/Edit News
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HODDashboard;