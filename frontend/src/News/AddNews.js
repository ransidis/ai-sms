import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNews = () => {
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    category: '',
    user_id: ''
  });
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setNewsData((prevData) => ({ ...prevData, user_id: decoded.user_id }));
        setUserType(decoded.user_type);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleContentChange = (value) => {
    setNewsData({ ...newsData, content: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/news/add', newsData);
      alert('News added successfully');
      navigate(`/news`);
    } catch (error) {
      console.error('Error adding news:', error);
      setError('Error adding news');
    }
  };

  if (userType === 'student') {
    return <p>Unauthorized</p>;
  }

  return (
    <div className="add-news container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/lecturer-dashboard">Home</a></li>
          <li className="breadcrumb-item"><a href="/news">News</a></li>
          <li className="breadcrumb-item active" aria-current="page">Add News</li>
        </ol>
      </nav>
      <h4 className="mb-4">Add News Article</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={newsData.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Content</label>
        <ReactQuill value={newsData.content} onChange={handleContentChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-control"
          name="category"
          value={newsData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Urgent">Urgent</option>
          <option value="Academic">Academic</option>
          <option value="Internship">Internship</option>
          <option value="Competitions">Competitions</option>
        </select>
      </div>
      <button className="btn btn-danger" onClick={handleSubmit}>
        Save & Publish
      </button>
    </div>
  );
};

export default AddNews;