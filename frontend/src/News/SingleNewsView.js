import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const SingleNewsView = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // Added state for user type

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/news/details/${id}`);
        setNews(response.data.data);
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
          <h3>{news.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>
        <div className="col-md-4">
          <div className="more-info mt-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Category:</strong> {news.category}</p>
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