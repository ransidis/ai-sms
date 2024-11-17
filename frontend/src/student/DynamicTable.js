import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const DynamicTable = () => {
  const [rows, setRows] = useState([
    {
      regNo: "MC98730",
      status: "Pending Approval",
      requestedDate: "10/10/2024",
      submittedDate: "",
      letter: "Change status to continue",
    },
    {
      regNo: "MC99750",
      status: "Approved",
      requestedDate: "10/10/2024",
      submittedDate: "",
      letter: "Generate",
    },
    {
      regNo: "MC98740",
      status: "Processing",
      requestedDate: "10/10/2024",
      submittedDate: "",
      letter: "View/Edit",
    },
    {
      regNo: "MC98740",
      status: "Ready",
      requestedDate: "10/10/2024",
      submittedDate: "16/10/2024",
      letter: "View/Edit",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (index, newStatus) => {
    const updatedRows = [...rows];
    updatedRows[index].status = newStatus;

    switch (newStatus) {
      case "Pending Approval":
        updatedRows[index].letter = "Change status to continue";
        updatedRows[index].submittedDate = "";
        break;
      case "Approved":
        updatedRows[index].letter = "Generate";
        break;
      case "Processing":
      case "Ready":
        updatedRows[index].letter = "View/Edit";
        if (newStatus === "Ready") {
          updatedRows[index].submittedDate = "16/10/2024";
        }
        break;
      default:
        break;
    }
    setRows(updatedRows);
  };

  // Filter rows based on search query
  const filteredRows = rows.filter((row) =>
    row.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Field */}
      <Row>
        <Col sm="12" className="d-flex flex-row justify-content-end mt-5 mb-5">
        <Form.Group controlId="search" className="d-flex">
            <Form.Control 
            type="text"
            
            placeholder="Search student"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </Form.Group>
        </Col>
      </Row>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>MC</th>
            <th>Status</th>
            <th>Requested Date</th>
            <th>Submitted Date</th>
            <th>Letter</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={index}>
              <td>{row.regNo}</td>
              <td>
                <select
                  value={row.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready">Ready</option>
                </select>
              </td>
              <td>{row.requestedDate}</td>
              <td>{row.submittedDate || "-"}</td>
              <td>{row.letter}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DynamicTable;
