import React, { useEffect } from "react";
import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar.component";
import BankPage from "./pages/BankPage/Bank.page";
import ViewQuestion, {
  qnLoader,
} from "./pages/ViewQuestionPage/ViewQuestion.page";
import { Box, Center, Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
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

const routes = [
  { path: "/bank", Component: BankPage },
  { path: "/view/:_id", Component: ViewQuestion, loader: qnLoader },
  { path: "/collab", Component: ViewQuestion },
  { path: "/create", Component: CreateQuestion },
  { path: "/edit/:_id", Component: EditQuestion, loader: qnLoader },
  { path: "*", element: <Navigate to="/bank" /> }, //redirect all other routes to /
];


let firstLoad = true;

function App() {

  const router = createBrowserRouter([
    {
      Component: NavbarWrapper,
      children: routes
    },
    { path: "*", Component: PageNotFound },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
