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
  const [urgent, setUrgent] = useState(false);
  const [urgentExpire, setUrgentExpire] = useState('');
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
      const newsToAdd = { ...newsData, urgent_expire: urgent ? urgentExpire : null };
      const response = await axios.post('http://localhost:8080/api/news/add', newsToAdd);
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
    <div className="add-news container mt-5">
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
          style={{ borderColor: '#ced4da', borderRadius: '0.25rem' }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Content</label>
        <ReactQuill 
          value={newsData.content} 
          onChange={handleContentChange} 
          style={{ height: '200px', marginBottom: '50px' }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-control"
          name="category"
          value={newsData.category}
          onChange={handleChange}
          style={{ borderColor: '#ced4da', borderRadius: '0.25rem' }}
        >
          <option value="">Select Category</option>
          <option value="Academic">Academic</option>
          <option value="Internship">Internship</option>
          <option value="Competitions">Competitions</option>
        </select>
      </div>
      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="urgent"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="urgent">Mark as Urgent</label>
        </div>
        {urgent && (
          <input
            type="text"
            className="form-control mt-2"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => (e.target.type = 'text')}
            value={urgentExpire}
            onChange={(e) => setUrgentExpire(e.target.value)}
            placeholder="Select Urgent Expire Date"
          />
        )}
      </div>
      <button 
        className="btn btn-danger" 
        onClick={handleSubmit}
        style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', marginBottom: '20px' }}
      >
        Save & Publish
      </button>
    </div>
  );
};

export default AddNews;