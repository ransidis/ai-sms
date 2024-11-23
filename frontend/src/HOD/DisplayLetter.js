import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';

const DisplayLetter = () => {
  const [letters, setLetters] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // New state for preloader
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const navigate = useNavigate();

  // Fetch all letters
  const fetchAllLetters = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/letter/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setLetters(data.data || []);
      } else {
        console.error("Error fetching letters:", data);
        alert(data.message || "Failed to fetch letters.");
      }
    } catch (error) {
      console.error("Error fetching letters:", error);
      alert("An error occurred while fetching letters.");
    }
  };

  // Fetch all students
  const fetchAllStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/student/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStudents(data.data || []);
      } else {
        console.error("Error fetching students:", data);
        alert(data.message || "Failed to fetch students.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("An error occurred while fetching students.");
    }
  };

// Update status in the database
const updateStatus = async (id, newStatus) => {
    if (!id || !newStatus) {
      alert("Invalid data. Cannot update status.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }
  
    let lecturerId;
    try {
      const decoded = jwtDecode(token);
      lecturerId = decoded.user_id;
    } catch (error) {
      alert("Invalid token. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/letter/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, lecturerId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the local state
        setLetters((prevLetters) =>
          prevLetters.map((letter) =>
            letter.id === id ? { ...letter, status: newStatus } : letter
          )
        );
        alert("Status updated successfully.");
      } else {
        console.error("Error updating status:", data);
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An unexpected error occurred while updating the status.");
    }
  };  

  // Combine letters with students based on user_id
  const getLetterWithStudentData = () => {
    return letters.map((letter) => {
      const student = students.find((student) => student.user_id === letter.user_id);
      return {
        ...letter,
        registration_no: student ? student.registration_no : "N/A",
      };
    });
  };

  const handleGenerate = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve the token
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const decoded = jwtDecode(token);
    const lecturerId = decoded.user_id; // Replace this with the actual lecturerId

    setIsGenerating(true); // Show preloader
  
    try {
      const response = await fetch(`http://localhost:8080/api/letter/generate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lecturerId }), // Include lecturerId in the request body
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Letter generated successfully!");
        await fetchAllLetters();
        // Optionally, refresh the data or update the UI
      } else {
        console.error("Error generating letter:", data);
        alert(data.message || "Failed to generate letter.");
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      alert("An error occurred while generating the letter.");
    } finally {
      setIsGenerating(false); // Hide preloader
    }
  };  

  // Handle Edit Button Click
  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to the edit page with the letter ID
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/letter/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setLetters((prevLetters) => prevLetters.filter((letter) => letter.id !== id));
        alert("Letter deleted successfully.");
      } else {
        const data = await response.json();
        console.error("Error deleting letter:", data);
        alert(data.message || "Failed to delete letter.");
      }
    } catch (error) {
      console.error("Error deleting letter:", error);
      alert("An error occurred while deleting the letter.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllLetters();
      await fetchAllStudents();
      setLoading(false); // Set loading to false after both data are fetched
    };

    fetchData();
  }, []);

  const mergedLetters = getLetterWithStudentData();
  const filteredLetters = mergedLetters.filter(letter =>
    letter.registration_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      {isGenerating && (
        <div className="preloader">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`display-letter-container ${isGenerating ? "blur" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Available Letters</h2>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by Registration No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : filteredLetters.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Registration No</th>
                <th>Type</th> {/* New column for letter type */}
                <th>Status</th>
                <th>Request Date</th>
                <th>Submitted Date</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredLetters.map((letter) => (
                <tr key={letter.id}>
                  <td>{letter.registration_no}</td>
                  <td>{letter.type}</td> {/* Display letter type */}
                  <td>
                    <select
                      className="form-control"
                      value={letter.status || "Pending"}
                      onChange={(e) => updateStatus(letter.id, e.target.value)}
                      disabled={letter.status === "Approved" && !letter.generated} // Disable dropdown if status is "Approved" and not generated
                    >
                      {letter.status === "Pending Approval" ? (
                            <>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Approved">Approved</option>
                            </>
                        ) : letter.status === "Approved" ? (
                            <>
                            <option value="Approved">Approved</option>
                            {letter.generated && <option value="Processing">Processing</option>}
                            </>
                        ) : letter.status === "Processing" ? (
                            <>
                            <option value="Processing">Processing</option>
                            <option value="Ready">Ready</option>
                            </>
                        ) : (
                            <>
                            <option value={letter.status}>{letter.status}</option>
                            </>
                        )}
                    </select>
                  </td>
                  <td>{new Date(letter.request_date).toLocaleDateString()}</td>
                  <td>
                    {letter.submitted_date
                      ? new Date(letter.submitted_date).toLocaleDateString()
                      : "Not Submitted"}
                  </td>
                  <td>
                    {letter.status === "Approved" ? (
                            <>
                            <button
                                className="btn btn-primary"
                                onClick={async () => {
                                  await handleGenerate(letter.id);
                                  letter.generated = true; // Mark as generated
                                }}
                                >
                                Generate
                            </button>
                            </>
                        ) : letter.status === "Processing" || letter.status === "Ready" ? (
                            <>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleEdit(letter.id)}
                                >
                                Edit
                            </button>
                            </>
                        ) : (
                            <>
                            </>
                        )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(letter.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No letters available.</p>
        )}
      </div>
    </div>
  );
};

// Add CSS for preloader and blur effect
const styles = `
  .preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #000;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .blur {
    filter: blur(5px);
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default DisplayLetter;
