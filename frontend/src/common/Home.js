import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className='Home'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '60vh' }}>
        <Container>
          <Row>
            <Col className='bg-light border border-2 p-3 d-flex flex-column text-center m-2'>
              <p>
                This proposed system leverages AI to automate letter generation for student requests, secure data management,
                and improve communication between students and faculty. Key features include an AI-powered letter generation
                tool, a secure authentication system using University email, and a personalized dashboard for real-time
                information access. Additionally, the system will centralize student data, facilitating easier tracking of
                achievements and letter requests, ultimately enhancing the department's operational efficiency and student
                support.
              </p>
            </Col>
          </Row>
          <center><Button onClick={handleLoginClick}> Login to the System ➡️</Button></center>
        </Container>
      </div>
    </div>
  );
};

export default Home;
