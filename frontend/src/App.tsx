import React, { useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, setUser } from './reducers/authSlice'
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import { useDispatch } from 'react-redux';
import { getSessionUser } from './api/auth';
import { useToast } from '@chakra-ui/toast';

let firstLoad = true;

function App() {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser)
  const dispatch = useDispatch();
  const toast = useToast();

  /**
   * Attempt to load the previously logged in user if their cookie still exists
   */
  useEffect(() => {
    console.log(`first load: ${firstLoad}`);

    if (firstLoad) {
      firstLoad = false;
      getSessionUser()
        .then((fetchedUser) => {
          console.log(fetchedUser)

          if (!fetchedUser) {
            console.log('no user fetched!');
          } else {
            dispatch(setUser(fetchedUser));
          }
        })
        .catch((err) => {
          toast({
            description: 'Please login again',
            status: 'warning',
            isClosable: true,
          });

          console.error(err.message);
        });
    }
  }, []);

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
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>)
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
