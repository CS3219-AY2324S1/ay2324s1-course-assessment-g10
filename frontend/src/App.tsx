import React from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from './reducers/authSlice'
import LoginPage from './pages/LoginPage';


function App() {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser)

  console.log(user)
  console.log(isAuthenticated)

  return (
    <div className="app">
      <BrowserRouter>
        {isAuthenticated ?
          (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<Add />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          ) :
          (<Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegistrationPage />} /> */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>)
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
