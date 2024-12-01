import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { PersonCircle } from 'react-bootstrap-icons';
import { Calendar } from 'react-bootstrap-icons';
import { Breadcrumb } from 'react-bootstrap';

const NewsDashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState(''); // Add state for user type
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleBack = () => {
    navigate(-1);
  };

  // Handle search
  const handleSearch = () => {
    const filtered = newsList.filter(
      (news) =>
        (news.title && news.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.description && news.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.category && news.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.lecturerEmail && news.lecturerEmail.toLowerCase().includes(searchQuery.toLowerCase())) || // Match lecturer email
        (news.date && news.date.includes(searchQuery)) // Match date
    );
    setFilteredNews(filtered);
  };

  const handleNewsClick = (id) => {
    navigate(`/news/${id}`);
  };

  // Fetch lecturer details
  const fetchLecturerDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/lecturer/details/${userId}`);
      return response.data.data.email;
    } catch (error) {
      console.error('Error fetching lecturer details:', error);
      return 'Unknown';
    }
  };

  useEffect(() => {
    const fetchNewsWithLecturer = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/news/all');
        const newsData = response.data.data;

        // Fetch lecturer emails for each news item
        const newsWithLecturer = await Promise.all(
          newsData.map(async (news) => {
            const email = await fetchLecturerDetails(news.user_id);
            // Format date to remove text after 'T'
            const formattedDate = news.date.split('T')[0];
            return { ...news, lecturerEmail: email, date: formattedDate };
          })
        );

        setNewsList(newsWithLecturer);
        setFilteredNews(newsWithLecturer);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNewsWithLecturer();
  }, []);

  return (
    <div className="news-dashboard container">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={handleBack}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>News</Breadcrumb.Item>
      </Breadcrumb>

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
                  <PersonCircle/> {news.lecturerEmail} |{' '}
                  <Calendar/> {news.date}
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
    case 'Academic':
      return 'bg-primary text-white';
    case 'Internship':
      return 'bg-success text-white';
    default:
      return 'bg-dark text-white';
  }
};

export default NewsDashboard;
