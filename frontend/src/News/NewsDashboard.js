import React, { useState, useEffect } from 'react';

const NewsDashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock sample news data with categories
    const sampleNews = [
      {
        title: 'New University Policy Announced',
        description: 'A brief about the new university policy updates.',
        author: 'Admin',
        date: '10/11/2024',
        category: 'Urgent',
      },
      {
        title: 'Seminar on AI Innovations',
        description: 'Join us for an insightful seminar on AI trends.',
        author: 'Tech Team',
        date: '09/11/2024',
        category: 'Technology',
      },
      {
        title: 'Scholarship Opportunities',
        description: 'Details about upcoming scholarship programs.',
        author: 'Admissions Office',
        date: '08/11/2024',
        category: 'Education',
      },
    ];

    // Simulate fetching data
    setTimeout(() => {
      setNewsList(sampleNews);
      setFilteredNews(sampleNews);
    }, 500);
  }, []);

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

  return (
    <div className="news-dashboard container">
      {/* Row for Add New and Search */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <button className="btn btn-danger">Add New</button>
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
            <div className="card mb-3" key={index}>
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
