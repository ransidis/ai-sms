import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Home = () => {
  return (
    <div className='Home'>
    <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
    <div className='d-flex flex-column justify-content-center align-items-center' style={{height:'60vh'}}>
    <Container>
        <Row>
            <Col className='bg-light border border-2 p-3 d-flex flex-column text-center m-2'>
                <h2>Lecturer</h2>
                <Button>LogIn</Button><br/>
                <Button>Register</Button>
            </Col>
            <Col className='bg-light border border-2 p-3 d-flex flex-column text-center m-2'>
                <h2>Students</h2>
                <Button>LogIn</Button><br/>
                <Button>Register</Button>
            </Col>
            <Col className='bg-light border border-2 p-3 d-flex flex-column text-center m-2'>
                <h2>HOD</h2>
                <Button>LogIn</Button><br/>
            </Col>
        </Row>
    </Container>
    </div>
    </div>
  )
}

export default Home
