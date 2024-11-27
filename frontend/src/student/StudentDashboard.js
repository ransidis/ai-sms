import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [urgentNews, setUrgentNews] = useState([]);

  useEffect(() => {
    const fetchUrgentNews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/news/all');
        const urgentNews = response.data.data.filter(news => news.category === 'Urgent');
        setUrgentNews(urgentNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchUrgentNews();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='Dashboard'>
      <Container>
        <Row className='student-row'>
          
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/student-profile'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                Edit Profile
              </Button>
            </Link>
          </Col> 
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/request-letter'>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                Letter Requests
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to=''>
              <Button style={{ width: '100%', height: '150%', fontSize: '20px' }}>
                View Department News
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className='mt-5 border border-secondary rounded text-danger'>
          <Col sm={2} className='fw-bold' >
            Urgent News :
          </Col>
          <Col >
          {urgentNews.length > 0 && (
          <marquee className='fw-bolder text-decoration-underline'>
            {urgentNews.map((news, index) => (
              <Link key={index} to={`/news/${news.id}`} style={{ marginRight: '20px', color: 'inherit', textDecoration: 'none' }}>
                {news.title}
              </Link>
            ))}
          </marquee>
        )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;