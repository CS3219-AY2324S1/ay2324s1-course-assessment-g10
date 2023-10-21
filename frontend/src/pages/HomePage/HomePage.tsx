import React, { useState } from "react";
import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Question, initializeData } from "../AddQuestionPage/QuestionData";

function HomePage() {
  let history = useNavigate();

  const [QuestionData, setQuestionData] = useState(initializeData());

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (confirmed) {
      // Find the index of the question to delete in the QuestionData array
      const dataIndex = QuestionData.findIndex(
        (item: Question) => item.id === id
      );

      // Find the index of the question to delete in the filteredData array
      const filteredIndex = filteredData.findIndex(
        (item: Question) => item.id === id
      );

      if (dataIndex !== -1) {
        // Remove the question from the QuestionData array
        QuestionData.splice(dataIndex, 1);
      }

      if (filteredIndex !== -1) {
        // Remove the question from the filteredData array
        filteredData.splice(filteredIndex, 1);
      }

      // Update local storage with the modified QuestionData
      localStorage.setItem("QuestionData", JSON.stringify(QuestionData));

      // Navigate back to the homepage
      history("/");
    } else {
      // User canceled, do nothing
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(QuestionData);

  const handleSearchInputChange = (event: any) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === "") {
      // If the search query is empty, revert to showing the original data
      setFilteredData(QuestionData);
      return;
    }

    // Filter the tableData based on the search query
    const filtered = QuestionData.filter((item: Question) =>
      Object.values(item).some((value) => {
        // Check if the value is a string before converting to lowercase
        if (typeof value === "string") {
          return value.toLowerCase().includes(query.toLowerCase());
        }

        // If it's not a string, convert it to a string and then check for inclusion
        return String(value).toLowerCase().includes(query.toLowerCase());
      })
    );

    // Set the new filtered data
    setFilteredData(filtered);
  };

  return <></>;
}

export default HomePage;
