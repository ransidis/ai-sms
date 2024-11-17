import React, { useState } from 'react';

const AddEditNews = ({ initialData = {}, onSave }) => {
  const [newsData, setNewsData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || 'username',
    category: initialData.category || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleSubmit = () => {
    // Send data to backend
    onSave(newsData);
  };

  return (
    <div className="add-edit-news container">
      <h4 className="mb-4">{initialData.id ? 'Edit News Article' : 'Add News Article'}</h4>
      <textarea
        className="form-control mb-3"
        rows="10"
        name="content"
        value={newsData.content}
        onChange={handleChange}
      />
      <button className="btn btn-danger" onClick={handleSubmit}>
        Save & Publish
      </button>
    </div>
  );
};

export default AddEditNews;
