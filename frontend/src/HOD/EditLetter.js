import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill editor styles
import axios from "axios";
import html2pdf from "html2pdf.js";
import headerimg from "../HOD/uni_header.png"; // Correct the path to the header image

const EditLetter = () => {
  const { id } = useParams(); // Get the letter ID from the URL
  const [letter, setLetter] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const fetchLetterAndUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view this page.");
        navigate("/login");
        return;
      }

      try {
        // Fetch letter details by ID
        const responseLetter = await fetch(
          `http://localhost:8080/api/letter/details/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const letterData = await responseLetter.json();

        if (responseLetter.ok) {
          setLetter(letterData.data); // Set the letter details in state
          setEditorContent(letterData.data.content); // Set initial editor content

          // Fetch user details using user_id from the letter data
          const responseUser = await fetch(
            `http://localhost:8080/api/student/details/${letterData.data.user_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userData = await responseUser.json();

          if (responseUser.ok) {
            setUser(userData.data); // Set the user details in state
          } else {
            console.error("Error fetching user details:", userData);
            alert(userData.message || "Failed to fetch user details.");
          }
        } else {
          console.error("Error fetching letter:", letterData);
          alert(letterData.message || "Failed to fetch letter.");
        }
      } catch (error) {
        console.error("Error fetching letter or user details:", error);
        alert("An error occurred while fetching data.");
      }
    };

    fetchLetterAndUserDetails();
  }, [id, navigate]); // Dependencies: id (route param) and navigate

  // Handle change in the editor content
  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  // Toolbar modules for the editor
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      ["image"],
    ],
  };

  // Submit the content to the backend
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/letter/sign/${letter.id}`,
        { content: editorContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Content submitted successfully!");
        navigate("/letter-requests"); // Redirect to /letter-requests
      } else {
        alert("Failed to submit the content.");
      }
    } catch (error) {
      console.error("Error submitting content:", error);
      alert("An error occurred while submitting the content.");
    }
  };

  const handleDownloadPDF = () => {
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
    contentDiv.innerHTML = editorContent; // Load content from the editor
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
      {letter && user ? (
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">User Details</h5>
              <p className="card-text">
                <strong>Full Name:</strong> {user.fullname}
              </p>
              <p className="card-text">
                <strong>Registration No:</strong> {user.registration_no}
              </p>
              <p className="card-text">
                <strong>Batch:</strong> {user.batch}
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Letter Details</h5>
              <p className="card-text">
                <strong>Purpose:</strong> {letter.purpose}
              </p>
              <p className="card-text">
                <strong>Address:</strong> {letter.address}
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <ReactQuill
                value={editorContent}
                onChange={handleEditorChange}
                modules={modules}
                placeholder="Write something..."
              />
              <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btn btn-secondary mt-3" onClick={handleDownloadPDF} style={{marginLeft:'20px'}}>
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditLetter;