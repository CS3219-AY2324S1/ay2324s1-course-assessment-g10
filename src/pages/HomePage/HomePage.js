import React, { useState, useEffect, Fragment } from 'react';
import './HomePage.css'; 
import "bootstrap/dist/css/bootstrap.min.css"
import {Button, Table} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import QuestionData from '../QuestionData.js';



function HomePage() {

  let history = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {}, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  const categories = ['Category A', 'Category B', 'Category C'];
  const complexities = ['Easy', 'Medium', 'Hard'];

  const handleDelete = (id) => {
    var index = QuestionData.map(function(e) {
      return e.id
    }).indexOf(id);

    QuestionData.splice(index,1);
    history('/');
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(QuestionData);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the tableData based on the search query
    const filtered = QuestionData.filter((item) =>
      Object.values(item).some((value) => {
        // Check if the value is a string before converting to lowercase
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query.toLowerCase());
        }

        // If it's not a string, convert it to a string and then check for inclusion
        return String(value).toLowerCase().includes(query.toLowerCase());
      })
    );

    // Set the new filtered data
    setFilteredData(filtered);
  };
  
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
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <div className="add-question-button">
          <Link to="/create" className='add-question-text'>
            Add Question
          </Link>
        </div>
      </div>

      <table className="question-table">
        <thead>
          <tr>
            <th>Question Id</th>
            <th>Question Title</th>
            <th>Question Description</th>
            <th>Question Category</th>
            <th>Question Complexity</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.complexity}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(item.id)}>
                  <i className="trash-icon"  ></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {isModalOpen && (
        <div className="modal-background">
          <div className="modal" id="dynamic-modal">
            <button className="close-button" onClick={closeModal}>
              X
            </button>
            <div className="modal-content">
              <h2>Add Question</h2>
              {/* First Row: Inputs */}
              <div className="modal-row">
                <div className="input-wrapper">
                  <label htmlFor="questionId" className='input-title'>ID: </label>
                  <input type="number" className="input-box" id="questionId" />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="questionTitle" className='input-title'>Title: </label>
                  <input type="text" className="input-box" id="questionTitle" />
                </div>
              </div>
              {/* Second Row: Dropdowns */}
              <div className="modal-row">
                <div className="input-wrapper">
                  <label htmlFor="category" className='input-title'>Category: </label>
                  <select id="category" className="dropdown">
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-wrapper">
                  <label htmlFor="complexity" className='input-title'>Complexity: </label>
                  <select id="complexity" className="dropdown">
                    {complexities.map((complexity) => (
                      <option key={complexity} value={complexity}>
                        {complexity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Third Row: Resizable Textarea */}
              <div className="modal-row">
                <div className="desc-wrapper">
                  <label htmlFor="questionDescription" className='input-title'>Description: </label>
                  <textarea
                    id="questionDescription"
                    rows="4" 
                    className="large-input-box"
                  ></textarea>
                </div>
              </div>
              {/* Fourth Row: Resizable Textarea */}
              <div className="modal-row">
                <button className="add-question-button" >Add Question</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default HomePage;