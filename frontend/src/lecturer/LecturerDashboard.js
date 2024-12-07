import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { FaUserEdit, FaSearch, FaNewspaper } from 'react-icons/fa'; // Import icons

const LecturerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='Dashboard'>
      <Container>
        <Row className='lecturer-row'>
          
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/lecturer-profile'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaUserEdit size={50} /> {/* Icon */}
                <div>Edit Profile</div> {/* Text */}
              </Button>
            </Link>
          </Col> 
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/search-students'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaSearch size={50} /> {/* Icon */}
                <div>View Student Details</div> {/* Text */}
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/news'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaNewspaper size={50} /> {/* Icon */}
                <div>Add/Edit News</div> {/* Text */}
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LecturerDashboard;