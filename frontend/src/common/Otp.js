import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const Otp = () => {
  return (
    <div className='Otp'>
    <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
    <h1 className='mt-5 text-center'>Account Verification</h1>
    <div className='d-flex flex-column justify-content-center align-items-center' style={{height:'60vh'}}>
    <Container>
        <Row className='d-flex flex-column justify-content-center align-items-center'>
          <Col md={6} >
          <p className='mt-5 text-center' style={{color: 'red'}}> An OTP has been sent to your university email address, please verify</p>
              <Form>
              <Form.Group className="mb-3" controlId="otp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control placeholder="Enter OTP" />
                </Form.Group>


                <Button type="submit">
                  Verify
                </Button>
                <Link to="https://chatgpt.com/c/67265205-1064-800a-b232-c4adfe1e1e4f">
                    <Button style={{marginLeft:10}}>
                      Back
                    </Button>
                  </Link>

          </Form>
          </Col>
        </Row>
    </Container>
    </div>
    </div>
  )
}

export default Otp