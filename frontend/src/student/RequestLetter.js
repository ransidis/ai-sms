import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import jsPDF from "jspdf"; // Import jsPDF

const RequestLetter = () => {
  const [letterHistory, setLetterHistory] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    purpose: "",
    address: "",
  });
  const navigate = useNavigate();

  // Memoizing the fetchLetterHistory function and adding token as a dependency
  const fetchLetterHistory = useCallback(async (decoded, token) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/letter/history/${decoded.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setLetterHistory(data.data);
      } else {
        console.error("Error fetching letter history:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []); // No dependencies inside useCallback as the token is passed directly

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(storedToken);
        fetchLetterHistory(decoded, storedToken); // Pass the decoded token directly here
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate, fetchLetterHistory]); // Adding fetchLetterHistory to the dependency array

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
      return;
    }
  
    const decoded = jwtDecode(token);
    const { type, purpose, address } = formData;
  
    try {
      
      const response = await fetch(`http://localhost:8080/api/letter/request/${decoded.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, purpose, address }),
      });
  
      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Attempt to parse the response as JSON
      const data = await response.json();
  
      // Check if the response is a valid JSON object
      if (data) {
        alert("Letter requested successfully");
        setFormData({ type: "", purpose: "", address: "" });
        fetchLetterHistory(decoded, token); // Fetch letter history after submitting
      } else {
        console.error("Invalid response data:", data);
        alert("Failed to submit request");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the request");
    }
  };

  // Function to handle PDF download
  const handleDownloadPDF = (content) => {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });

    // Add image as header
    const imgData = ''; // Replace with your valid base64 image data
    doc.addImage(imgData, 'PNG', 10, 10, 190, 30); // Adjust the dimensions as needed

    // Convert HTML content to plain text with line breaks
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    const plainTextContent = tempElement.innerText.replace(/\n/g, '\n\n'); // Double line breaks for paragraphs

    const splitContent = doc.splitTextToSize(plainTextContent, 190); // Split text to fit the paper width

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Letter Details", 10, 50); // Adjust the y-coordinate to fit below the image

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(splitContent, 10, 60); // Adjust the y-coordinate to fit below the image

    doc.save("letter.pdf");
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>Back</button>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="form-container p-4 border rounded shadow-sm">
            <h2 className="mb-4">Request a Letter</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="type">Type:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Type</option>
                  <option value="Recommendation Letter">Recommendation Letter</option>
                  <option value="Endorsement Letter">Endorsement Letter</option>
                  <option value="Field Visit Request Letter">Field Visit Request Letter</option>
                  <option value="Internship Introduction Letter">Internship Introduction Letter</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="purpose">Purpose:</label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="table-container p-4 border rounded shadow-sm">
            <h3 className="mb-4">Letter History</h3>
            {letterHistory.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Request Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {letterHistory.map((letter) => (
                    <tr key={letter.id}>
                      <td>{letter.type}</td>
                      <td>{new Date(letter.request_date).toLocaleDateString()}</td>
                      <td>
                        {letter.status === "Ready" ? (
                          <a href="#" onClick={() => handleDownloadPDF(letter.content)}>Download PDF</a>
                        ) : (
                          letter.status
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No letter history found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestLetter;
