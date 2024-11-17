import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const DashBoard = () => {
  // Define the role (e.g., "Student", "Lecturer", "HOD")
  const role = "HOD"
  return (
    <div className='Dashboard'>
      <div style={{marginTop:'100px'}} >
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
        
      </div>
    </div>
  );
};

export default DashBoard;
