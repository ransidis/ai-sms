import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import jsPDF from "jspdf"; // Import jsPDF
import html2pdf from "html2pdf.js"; // Import html2pdf
import headerimg from "../HOD/uni_header.png"; // Import the header image

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
    // Create a container for the letter content
    const pdfContent = document.createElement('div');
    pdfContent.style.fontFamily = "Times New Roman, serif";
    pdfContent.style.fontSize = "13px";
    pdfContent.style.lineHeight = "1.5"; // Reduced line spacing
    pdfContent.style.margin = "-10mm 10mm 10mm 10mm"; // Normal margins (1 inch)
    pdfContent.style.textAlign = "justify"; // Justify the content

    // Add university header image
    const headerImg = document.createElement('img');
    headerImg.src = headerimg; // Use the correct variable for the image source
    headerImg.style.width = '130%';
    headerImg.style.marginLeft = '-30mm'; // Add margin to the top of the header
    headerImg.style.marginBottom = '10mm'; 
    pdfContent.appendChild(headerImg);

    // Insert editor content into the container
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content; // Load content from the editor
    pdfContent.appendChild(contentDiv);

    // Set options for html2pdf.js
    const options = {
      margin: [0, 10, 10, 10], // 1 inch margin on all sides
      filename: 'letter.pdf',
      html2canvas: { scale: 2 }, // Improve canvas quality
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // Generate and download the PDF
    html2pdf().set(options).from(pdfContent).save();
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
