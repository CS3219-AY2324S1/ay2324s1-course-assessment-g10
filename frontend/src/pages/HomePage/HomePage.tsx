import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { selectUser } from "../../reducers/authSlice";
import { useSelector } from "react-redux";

function HomePage() {
  // Use the useSelector hook to access the user from the Redux store
  const user = useSelector(selectUser);

  if (user === null) {
    return <div></div>;
  }

  // At this point, you're sure that user is not null
  return <div></div>;
}

export default HomePage;
