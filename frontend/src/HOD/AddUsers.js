import React from 'react';
import { Table, Form, Button } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Header from '../common/Header';

const AddUsers = () => {
  return (
    <div className="AddUsers">
        <Header/>
      {/* Row for navigation buttons */}
      <Row className="mb-3">
        <Col>
          <Link to="">
            <Button variant="secondary">Back</Button>
          </Link>
        </Col>
        <Col className="text-end">
          <Link to="">
            <Button variant="primary">Upload CSV</Button>
          </Link>
        </Col>
      </Row>

      {/* Row for the user table */}
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>example@mail.com</td>
                <td>1234</td>
              </tr>
              <tr>
                <td>user2@mail.com</td>
                <td>5678</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default AddUsers;
