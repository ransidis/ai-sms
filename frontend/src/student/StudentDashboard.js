import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { FaUserEdit, FaEnvelope, FaNewspaper } from 'react-icons/fa'; // Import icons

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [urgentNews, setUrgentNews] = useState([]);

  useEffect(() => {
    const fetchUrgentNews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/news/all');
        const currentDate = new Date();
        const urgentNews = response.data.data.filter(news => 
          news.urgent_expire && new Date(news.urgent_expire) >= currentDate
        );
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
      <Container fluid>
        <Row className='student-row'>
          
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/student-profile'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaUserEdit size={50} /> {/* Icon */}
                <div>Edit Profile</div> {/* Text */}
              </Button>
            </Link>
          </Col> 
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/request-letter'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaEnvelope size={50} /> {/* Icon */}
                <div>Letter Requests</div> {/* Text */}
              </Button>
            </Link>
          </Col>
          <Col className='d-flex flex-column text-center m-2'>
            <Link to='/news'>
              <Button style={{ width: '100%', height: '100px', fontSize: '20px' }}>
                <FaNewspaper size={50} /> {/* Icon */}
                <div>View Department News</div> {/* Text */}
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col sm={2} className='fw-bold text-danger d-flex align-items-center justify-content-center'>
            Urgent News:
          </Col>
          <Col>
            {urgentNews.length > 0 && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px' }}>
                <marquee behavior="scroll" direction="left" scrollamount="5">
                  {urgentNews.map((news, index) => (
                    <Link
                      key={index}
                      to={`/news/${news.id}`}
                      className='text-danger fw-bolder text-decoration-underline'
                      style={{ marginRight: '20px', display: 'inline-block' }}
                    >
                      {news.title}
                    </Link>
                  ))}
                </marquee>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;