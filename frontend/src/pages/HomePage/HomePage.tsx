import React, { useState, useEffect } from 'react';
import './HomePage.css'; 
import "bootstrap/dist/css/bootstrap.min.css"
import {Link, useNavigate} from 'react-router-dom';
import { Question, initializeData, QuestionData }  from '../AddQuestionPage/QuestionData';

function HomePage() {

  let history = useNavigate();

  const [QuestionData, setQuestionData] = useState(initializeData());

  const handleDelete = (id: number) => {

    const confirmed = window.confirm('Are you sure you want to delete this question?');

  if (confirmed) {

    // Find the index of the question to delete in the QuestionData array
    const dataIndex = QuestionData.findIndex((item: Question) => item.id === id);
  
    // Find the index of the question to delete in the filteredData array
    const filteredIndex = filteredData.findIndex((item: Question) => item.id === id);
  
    if (dataIndex !== -1) {
      // Remove the question from the QuestionData array
      QuestionData.splice(dataIndex, 1);
    }
  
    if (filteredIndex !== -1) {
      // Remove the question from the filteredData array
      filteredData.splice(filteredIndex, 1);
    }
  
    // Update local storage with the modified QuestionData
    localStorage.setItem('QuestionData', JSON.stringify(QuestionData));
  
    // Navigate back to the homepage
    history('/');
  } else {
    // User canceled, do nothing
  }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(QuestionData);

  const handleSearchInputChange = (event: any) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      // If the search query is empty, revert to showing the original data
      setFilteredData(QuestionData);
      return;
    }

    // Filter the tableData based on the search query
    const filtered = QuestionData.filter((item: Question) =>
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
        <div className="title">Peer Prep</div>
      </div>

      <div className="content-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search questions"
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
          {filteredData.map((item: Question) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>
              <div style={{
                display: 'flex',
                  justifyContent: 'center', // Horizontally center the box
                  alignItems: 'center', // Vertically center the box
                    }}>
                  <div style={{
                  backgroundColor: item.complexity === '1' ? 'rgba(0, 255, 0, 0.3)' :
                        item.complexity === '2' ? 'rgba(255, 255, 0, 0.3)' :
                        'rgba(255, 0, 0, 0.3)',
                      padding: '4px',
                  borderRadius: '5px',
                  width: '30px', // Set the width here
                  textAlign: 'center',
                fontWeight: 'bold',
                color: 'white'
              }}>
          {item.complexity}
        </div>
      </div>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(item.id)}>
                  <i className="trash-icon"  ></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default HomePage;