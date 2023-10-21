import React from "react";
// import "./App.css";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";
import { Navbar } from "./components/Navbar/Navbar.component";
import BankPage from "./pages/BankPage/Bank.page";
import ViewQuestion, {
  qnLoader,
} from "./pages/ViewQuestionPage/ViewQuestion.page";
import { Box, Center, Heading } from "@chakra-ui/react";

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

const router = createBrowserRouter([
  {
    path: "/",
    Component: NavbarWrapper,
    children: [
      { path: "/", Component: HomePage },
      { path: "/create", Component: Add },
      { path: "/bank", Component: BankPage },
      { path: "/view/:id", Component: ViewQuestion, loader: qnLoader },
    ],
  },
  { path: "*", Component: PageNotFound },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
