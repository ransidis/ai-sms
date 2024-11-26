import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const NewsDashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState(''); // Add state for user type
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/news/all');
        setNewsList(response.data.data);
        setFilteredNews(response.data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Fetch user type from token
    const fetchUserType = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserType(decoded.user_type);
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserType();
  }, [navigate]);

  // Handle search
  const handleSearch = () => {
    const filtered = newsList.filter(
      (news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNews(filtered);
  };

  const handleNewsClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="news-dashboard container">
      {/* Row for Add New and Search */}
      <div className="d-flex justify-content-between align-items-center my-3">
        {userType === 'lecturer' && (
          <button className="btn btn-danger" onClick={() => navigate('/add-news')}>
            Add New
          </button>
        )}
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="news-list">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => (
            <div className="card mb-3" key={index} onClick={() => handleNewsClick(news.id)} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h5 className="card-title">{news.title}</h5>
                <p className="card-text">{news.description}</p>
                <small className="text-muted">
                  <i className="bi bi-person"></i> {news.author} |{' '}
                  <i className="bi bi-calendar"></i> {news.date}
                </small>
                <span className={`badge ms-3 ${getCategoryClass(news.category)}`}>
                  {news.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No news found.</p>
        )}
      </div>
    </div>
  );
};

// Helper function to style categories
const getCategoryClass = (category) => {
  switch (category) {
    case 'Urgent':
      return 'bg-danger text-white';
    case 'Technology':
      return 'bg-primary text-white';
    case 'Education':
      return 'bg-success text-white';
    default:
      return 'bg-secondary text-white';
  }
};

export default NewsDashboard;
