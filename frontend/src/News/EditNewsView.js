import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditNewsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({ title: '', content: '', category: '' });
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/news/details/${id}`);
        setNews(response.data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.user_type);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({
      ...prevNews,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setNews((prevNews) => ({
      ...prevNews,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/news/update/${id}`, news);
      navigate(`/news/${id}`);
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/news/delete/${id}`);
      navigate('/news');
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  if (userType !== 'lecturer') {
    return <p>Unauthorized</p>;
  }

  return (
    <div className="edit-news-view container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/news">News</a></li>
          <li className="breadcrumb-item active" aria-current="page">Edit News</li>
        </ol>
      </nav>
      <div className="row">
        <div className="col-md-8">
          <h3>Edit News</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={news.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <ReactQuill
                className="form-control"
                id="content"
                name="content"
                value={news.content}
                onChange={handleContentChange}
                required
                
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={news.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Urgent">Urgent</option>
                <option value="Academic">Academic</option>
                <option value="Internship">Internship</option>
                <option value="Competitions">Competitions</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-2">Update News</button>
            <button type="button" className="btn btn-danger mt-2 ms-2" onClick={handleDelete}>Delete News</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewsView;