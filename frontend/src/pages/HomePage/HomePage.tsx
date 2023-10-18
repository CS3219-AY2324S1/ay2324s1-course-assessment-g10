import React, { useState, useEffect } from "react";
import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Question,
  initializeData,
} from "../AddQuestionPage/QuestionData";

function HomePage() {
  let history = useNavigate();

  const [questionData, setQuestionData] = useState(initializeData());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(questionData);
  const viewQuestion = useNavigate();

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (confirmed) {
      const updatedQuestionData = questionData.filter(
        (item: Question) => item.id !== id
      );
      setQuestionData(updatedQuestionData);

      const updatedFilteredData = filteredData.filter(
        (item: Question) => item.id !== id
      );
      setFilteredData(updatedFilteredData);

      localStorage.setItem("QuestionData", JSON.stringify(updatedQuestionData));

      history("/");
    } else {
      // User canceled, do nothing
    }
  };

  const handleSearchInputChange = (event: any) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredData(questionData);
      return;
    }

    const filtered = questionData.filter((item: Question) =>
      Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query.toLowerCase());
        }
        return String(value).toLowerCase().includes(query.toLowerCase());
      })
    );

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
          <Link to="/create" className="add-question-text">
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
            <tr key={item.id} onClick={() => viewQuestion(`/question/${item.id}`)} className="table-row">
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        item.complexity === "1"
                          ? "rgba(0, 255, 0, 0.3)"
                          : item.complexity === "2"
                          ? "rgba(255, 255, 0, 0.3)"
                          : "rgba(255, 0, 0, 0.3)",
                      padding: "4px",
                      borderRadius: "5px",
                      width: "30px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {item.complexity}
                  </div>
                </div>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={(event) => handleDelete(event, item.id)}
                >
                  <i className="trash-icon"></i>
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
