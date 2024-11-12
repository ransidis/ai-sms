import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  // Define the role (e.g., "Student", "Lecturer", "HOD")
  const role = "Lecturer"
  return (
    <div className='Dashboard'>
      <div >
        <Container className='d-flex flex-column justify-content-around vh-100 '>
          <Row>
            <Col className='  d-flex flex-column text-center m-2'>
              <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ marginRight: '10px' }}>
                  {/* Placeholder for avatar icon */}
                  <svg height="50" width="50" viewBox="0 0 24 24" fill="#c4c4c4">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <h2>Howdy, [HOD]</h2>
                  <p>xxx@mgt.sjp.ac.lk</p>
                </div>
              </div>
            </Col>
            <Col className='  d-flex flex-column text-end m-2'>
              <Link to="/"><Button>Log Out</Button></Link>
            </Col>
          </Row>

          {role === "HOD" && (
            <Row className='hod-row'>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Add/Edit Users</Button></Link>
              </Col>
              <Col className='_ d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>View Letter Requests</Button></Link>
              </Col>
              <Col className='_ d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Add/Edit News</Button></Link>
              </Col>
            </Row>
          )}

          {role === "Lecturer" && (
            <Row className='lecturer-row'>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Edit Profile</Button></Link>
              </Col>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>View Student Details</Button></Link>
              </Col>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Add/Edit News</Button></Link>
              </Col>
            </Row>
          )}

          {role === "Student" && (
            <Row className='student-row'>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Edit Profile</Button></Link>
              </Col>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>Letter Requests</Button></Link>
              </Col>
              <Col className='  d-flex flex-column text-center m-2'>
                <Link to=''><Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>View Department News</Button></Link>
              </Col>
            </Row>
          )}

          {/* Latest Department News Marquee */}
          <Row className='d-flex flex-column align-items-center mt-5' style={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
            <marquee direction="left" scrollamount="5" style={{ width: '100%' }}>
              Latest News 1 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Latest News 2 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Latest News 3
            </marquee>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashBoard;
