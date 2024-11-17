import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import DynamicTable from './DynamicTable';
import Header from '../common/Header';


const RequestLetter = () => {
  const role = "HOD";

  return (
    <div className='RequestLetter'>
    {role === "Student" && (
    <div className='Student'>
    <Row>
        <Col><Link to=""><Button>Back</Button></Link></Col>
    </Row>
    <Row>
        <Col>
            <h3>Request a Letter</h3>
            <Form>
            <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Your Batch</Form.Label>
                  <Col sm="10">
                    <Form.Select>
                      <option value="">Select Your Batch</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                      <option value="2021/2022">2021/2022</option>
                      <option value="2019/2020">2019/2020</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
            
            <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Extra Curricular</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="textarea"
                      name="extraCurricular"
                      placeholder="Add your department related extra-curricular activities" 
                      rows={3}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">Extra Curricular</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="textarea"
                      name="extraCurricular"
                      placeholder="Add your department related extra-curricular activities" 
                      rows={3}
                    />
                  </Col>
                </Form.Group>

                <Button variant="primary" type="submit" size="md">
                  Submit Request
                </Button>
            </Form>
        </Col>
    </Row>
    <Row>
      <Col>
      <Table striped bordered hover>
          <thead>
            <tr>
              <th>Letter Type</th>
              <th>Requested Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Recommendation Letter</td>
              <td>17/11/2024</td>
              <td>Pending Approval</td>
            </tr>
          </tbody>
      </Table>
      </Col>
    </Row>
    </div> )}

    {role === "HOD" && (
    <div className='HOD'>
    <Row>
        <Col><Link to=""><Button>Back</Button></Link></Col>
    </Row>
    <Row>
        <Col>
          <DynamicTable/>
        </Col>
    </Row>





    </div> )}
    </div>
  )
}

export default RequestLetter