import React from "react";
// import "./App.css";
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { Navbar } from "./components/Navbar/Navbar.component";
import BankPage from "./pages/BankPage/Bank.page";
import ViewQuestion, {
  qnLoader,
} from "./pages/ViewQuestionPage/ViewQuestion.page";
import { Box, Center, Heading } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import ResgistrationPage from "./pages/RegistrationPage";
import "./App.css";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "./reducers/authSlice";
import CreateQuestion from "./pages/CreateQuestionPage/CreateQuestion.page";
import EditQuestion from "./pages/EditQuestionPage/EditQuestion.page";

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
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: ResgistrationPage },
  { path: "*", element: <Navigate to="/login" /> }, //redirect all other routes to /login
];

const loggedInRoutes = [
  { path: "/", Component: HomePage },
  { path: "/create", Component: CreateQuestion },
  { path: "/bank", Component: BankPage },
  { path: "/view/:id", Component: ViewQuestion, loader: qnLoader },
  { path: "/edit/:id", Component: EditQuestion, loader: qnLoader },
];


function App() {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser)

  console.log(user)
  console.log(isAuthenticated)

  const router = createBrowserRouter([
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
