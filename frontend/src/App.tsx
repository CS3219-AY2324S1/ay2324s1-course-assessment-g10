import React from "react";
// import "./App.css";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";
import { Navbar } from "./components/Navbar/Navbar.component";
import BankPage from "./pages/BankPage/Bank.page";
import ViewQuestion, {
  qnLoader,
} from "./pages/ViewQuestionPage/ViewQuestion.page";
import { Box, Center, Heading } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import ResgistrationPage from "./pages/RegistrationPage";
import './App.css';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectIsAuthenticated, selectUser } from './reducers/authSlice'

const NavbarWrapper = () => (
  <div>
    <Navbar />
    <Box width="100%" height="90vh">
      <Outlet />
    </Box>
  </div>
);

const PageNotFound = () => (
  <Center>
    <Heading>404 Page does not exist!</Heading>
  </Center>
);

const publicRoutes = [
  {path: "/login", Component: LoginPage},
  {path: "/register", Component: ResgistrationPage},
  {path: "*", element: (<Navigate to="/login" />)} //redirect all other routes to /login
]

const loggedInRoutes = [
  { path: "/", Component: HomePage },
  { path: "/bank", Component: BankPage },
  { path: "/view/:id", Component: ViewQuestion, loader: qnLoader },
  {path: "*", element: (<Navigate to="/" />)}
]

const adminOnlyRoutes = [
  { path: "/create", Component: Add },
]


function App() {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin)

  console.log(isAuthenticated)

  const router = createBrowserRouter([
    {
      Component: NavbarWrapper,
      children: isAuthenticated && isAdmin ? adminOnlyRoutes : []
    },
    {
      Component: NavbarWrapper,
      children: isAuthenticated ? loggedInRoutes : publicRoutes
    },
    { path: "*", Component: PageNotFound },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
