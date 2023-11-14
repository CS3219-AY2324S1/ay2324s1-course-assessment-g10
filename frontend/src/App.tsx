import React, { useEffect } from "react";
import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { Navbar } from "./components/Navbar/Navbar.component";
import BankPage from "./pages/BankPage/Bank.page";
import ViewQuestion, {
  qnLoader,
} from "./pages/ViewQuestionPage/ViewQuestion.page";
import { Box, Center, Heading } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import ResgistrationPage from "./pages/RegistrationPage";
import { useSelector } from "react-redux";
import {
  clearUser,
  selectIsAdmin,
  selectIsAuthenticated,
  setUser,
} from "./reducers/authSlice";
import { useDispatch } from "react-redux";
import { getSessionUser } from "./api/auth";
import { useToast } from "@chakra-ui/toast";
import CreateQuestion from "./pages/CreateQuestionPage/CreateQuestion.page";
import EditQuestion from "./pages/EditQuestionPage/EditQuestion.page";
import { MatchmakeProvider } from "./contexts/matchmake.context";
import ProfilePage from "./pages/ProfilePage";

const NavbarWrapper = () => (
  <div>
    <MatchmakeProvider>
      <Navbar />
      <Box width="100%" height="90vh">
        <Outlet />
      </Box>
    </MatchmakeProvider>
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
  { path: "/bank", Component: BankPage },
  { path: "/view/:_id", Component: ViewQuestion, loader: qnLoader },
  { path: "/collab", Component: ViewQuestion },
  { path: "/profile", Component: ProfilePage },
  { path: "/profile/:username", Component: ProfilePage },
  { path: "*", element: <Navigate to="/" /> }, //redirect all other routes to /
];

const adminOnlyRoutes = [
  { path: "/create", Component: CreateQuestion },
  { path: "/edit/:_id", Component: EditQuestion, loader: qnLoader },
];

let firstLoad = true;

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const toast = useToast();

  /**
   * Attempt to load the previously logged in user if their cookie still exists
   */

  useEffect(() => {
    console.log(`first load: ${firstLoad}`);
    console.log(process.env.REACT_APP_ENV_TYPE);
    if (process.env.REACT_APP_ENV_TYPE === "prod") {
      console.log("running in prod");
    }

    if (firstLoad && process.env.REACT_APP_ENV_TYPE === "prod") {
      firstLoad = false;
      getSessionUser()
        .then((fetchedUser) => {
          console.log(fetchedUser);

          if (!fetchedUser) {
            console.log("no user fetched!");
            dispatch(clearUser()); //clear authSlice user if somehow still exists
          } else {
            dispatch(setUser(fetchedUser));
          }
        })
        .catch((err) => {
          toast({
            description: "Please login again",
            status: "warning",
            isClosable: true,
          });

          console.error(err.message);
        });
    }
  });

  console.log(isAuthenticated);

  const router = createBrowserRouter([
    {
      Component: NavbarWrapper,
      children: isAuthenticated && isAdmin ? adminOnlyRoutes : [],
    },
    {
      Component: NavbarWrapper,
      children: isAuthenticated ? loggedInRoutes : publicRoutes,
    },
    { path: "*", Component: PageNotFound },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
