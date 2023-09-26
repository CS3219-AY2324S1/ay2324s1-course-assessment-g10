import React from 'react';
import './HomePage.css'; 

function HomePage() {
  return (
    <div className="homepage">
      <div className="background" />

      <div className="navbar">
        <div className="title">Question Bank</div>
      </div>

      <div className="content-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search Question Here"
        />
        <button className="add-question-button">Add Question</button>
      </div>

    </div>
  );
}

export default HomePage;