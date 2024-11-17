import React from 'react';

const SingleNewsView = ({ news }) => {
  return (
    <div className="single-news-view container">
      <h3>{news.title}</h3>
      <p>{news.content}</p>
      <div className="more-info mt-4">
        <small className="text-muted">
          <i className="bi bi-person"></i> {news.author} |{' '}
          <i className="bi bi-calendar"></i> {news.date}
        </small>
        <div>
          <button className="btn btn-link">Edit News Article</button>
        </div>
      </div>
    </div>
  );
};

export default SingleNewsView;
