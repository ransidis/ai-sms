import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const Reset_Email = () => {
  return (
    <div className='Reset_Email'>
      <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
      <h1 className='mt-5 text-center'>Reset Password</h1>
      <div className='d-flex flex-column justify-content-center align-items-center' style={{ height: '60vh' }}>
        <Container>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter University email" />
                  <Form.Text className="text-muted">
                    Enter your university email to receive password reset link.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit">
                    Send Reset Link
                  </Button>

                  {/* Link to another page */}
                  <Link to="/login">
                    <Button>
                      Back
                    </Button>
                  </Link>
                </div>

              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Reset_Email;
