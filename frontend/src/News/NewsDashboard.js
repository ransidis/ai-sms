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
  const [selectedCategory, setSelectedCategory] = useState(''); // Add state for selected category
  const [startDate, setStartDate] = useState(''); // Add state for start date
  const [endDate, setEndDate] = useState(''); // Add state for end date
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
        ((news.title && news.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.description && news.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.category && news.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (news.lecturerEmail && news.lecturerEmail.toLowerCase().includes(searchQuery.toLowerCase())) || // Match lecturer email
        (news.date && news.date.includes(searchQuery))) && // Match date
        (selectedCategory === '' || news.category === selectedCategory) && // Filter by selected category
        (startDate === '' || new Date(news.date) >= new Date(startDate)) && // Filter by start date
        (endDate === '' || new Date(news.date) <= new Date(endDate)) // Filter by end date
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
      const { fullname, email } = response.data.data;
      return `${fullname} (${email})`; // Return full name and email
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

        // Fetch lecturer details for each news item
        const newsWithLecturer = await Promise.all(
          newsData.map(async (news) => {
            const lecturerDetails = await fetchLecturerDetails(news.user_id);
            // Format date to remove text after 'T'
            const formattedDate = news.date.split('T')[0];
            return { ...news, lecturerDetails, date: formattedDate };
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
        <div className="input-group w-100">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-select me-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Urgent">Urgent</option>
            <option value="Academic">Academic</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            placeholder="Start Date"
            className="form-control me-2 textbox-n"
            type="text"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => (e.target.type = 'text')}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            placeholder="End Date"
            className="form-control me-2 textbox-n"
            type="text"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => (e.target.type = 'text')}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            <div className="card mb-3 shadow-sm" key={index} onClick={() => handleNewsClick(news.id)} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h5 className="card-title">{news.title}</h5>
                <p className="card-text text-secondary">{news.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <Calendar /> {news.date} &nbsp;|&nbsp; <PersonCircle /> {news.lecturerDetails}
                  </small>
                  <span className={`badge ${getCategoryClass(news.category)}`}>
                    {news.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No news found.</p>
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
