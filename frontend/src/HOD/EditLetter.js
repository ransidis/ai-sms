import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill editor styles
import axios from "axios";
import jsPDF from "jspdf";

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
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });

    // Render HTML content to plain text with formatting
    const tempElement = document.createElement('div');
    tempElement.innerHTML = editorContent;
    const formattedContent = tempElement.innerHTML;

    const splitContent = doc.splitTextToSize(formattedContent, 190); // Split text to fit the paper width

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Letter Details", 10, 20); // Adjust the y-coordinate

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(splitContent, 10, 30); // Adjust the y-coordinate

    doc.save("letter.pdf");
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
              <button className="btn btn-secondary mt-3 ml-2" onClick={handleDownloadPDF}>
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