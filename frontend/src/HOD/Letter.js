import React from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import Header from "../common/Header";

const Letter = ({ student }) => {
  return (
    <div className="Letter d-flex flex-column justify-content-between p-4">
      {/* Header */}
      <Header />

      {/* Back Button */}
      <Row className="mb-4">
        <Col xs="auto">
          <Link to="">
            <Button>Back</Button>
          </Link>
        </Col>
      </Row>

      {/* Student Information */}
      <Row className="mb-3">
        <Col>
          <h6>
            <strong>Student Name:</strong>{" "}
            {student?.name || <span className="text-muted">Name here...</span>}
          </h6>
        </Col>
        <Col>
          <h6>
            <strong>Register No.:</strong>{" "}
            {student?.regNo || <span className="text-muted">Reg No here...</span>}
          </h6>
        </Col>
        <Col>
          <h6>
            <strong>Batch:</strong>{" "}
            {student?.batch || <span className="text-muted">Batch here...</span>}
          </h6>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row className="mb-3">
        <Col>
          <h6>
            <strong>Purpose:</strong>{" "}
            {student?.purpose || <span className="text-muted">Purpose here...</span>}
          </h6>
        </Col>
        <Col>
          <h6>
            <strong>To Address:</strong>{" "}
            {student?.toAddress || (
              <span className="text-muted">External party address here...</span>
            )}
          </h6>
        </Col>
      </Row>

      {/* Rich Text Editor Placeholder */}
      <Row className="mb-4">
        <Col>
          <div className="border p-3" style={{ minHeight: "200px" }}>
            <p className="text-muted">Rich text editor goes here...</p>
          </div>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row>
        <Col xs="auto">
          <Link to="">
            <Button variant="success">Save</Button>
          </Link>
        </Col>
        <Col xs="auto">
          <Link to="">
            <Button variant="danger">Download PDF</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Letter;
