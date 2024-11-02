import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';


const Login = () => {
  return (
    <div className='Home'>
    <h1 className='mt-5 text-center'>AI Integrated Student Management System</h1>
    <h1 className='mt-5 text-center'>Login</h1>
    <div className='d-flex flex-column justify-content-center align-items-center' style={{height:'60vh'}}>
    <Container>
        <Row className='d-flex flex-column justify-content-center align-items-center'>
          <Col md={6} >
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter University email" />
                  <Form.Text className="text-muted">
                    Eg: 98730@mgt.sjp.ac.lk / abc@mgt.sjp.ac.lk
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <a href="https://www.example.com" rel="noopener noreferrer">Forget Password?</a>
                </Form.Group>
                <Button type="submit">
                  Login
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

export default Login