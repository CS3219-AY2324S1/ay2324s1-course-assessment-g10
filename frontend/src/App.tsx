import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  HomePage  from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";
import ViewQuestion from "./pages/ViewQuestionPage/ViewQuestion";
import { Provider } from 'react-redux';




function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path = "/create" element={<Add />} />
          <Route path="/question/:id" element={<ViewQuestion />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
