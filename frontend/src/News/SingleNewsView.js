import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const SingleNewsView = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // Added state for user type
  const [urgentExpire, setUrgentExpire] = useState(null); // Add state for urgent expire date

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/news/details/${id}`);
        setNews(response.data.data);
        setUrgentExpire(response.data.data.urgent_expire); // Set urgent expire date
        const userResponse = await axios.get(`http://localhost:8080/api/lecturer/details/${response.data.data.user_id}`);
        setUser(userResponse.data.data);
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
        setUserType(decoded.user_type); // Set user type from decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  if (!news || !user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-news-view container">
      <div className="row">
        <div className="col-md-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/lecturer-dashboard">Home</a></li>
              <li className="breadcrumb-item"><a href="/news">News</a></li>
              <li className="breadcrumb-item active" aria-current="page">{news.title}</li>
            </ol>
          </nav>
          <h3 className='fw-bold text-danger'>{news.title}</h3>
          <div className='fw-light' dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>
        <div className="col-md-4">
          <div className="more-info mt-4">
            <p><strong>Posted By:</strong> {user.email}</p>
            <p><strong>Category:</strong> {news.category}</p>
            {urgentExpire && (
              <>
                <p><strong>Urgent Until:</strong> {urgentExpire}</p>
                <p><strong>Urgent Category:</strong> Urgent</p>
              </>
            )}
            {userType === 'lecturer' && (
              <a href={`/edit-news/${id}`} className="btn btn-primary mt-2">Edit this news</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNewsView;