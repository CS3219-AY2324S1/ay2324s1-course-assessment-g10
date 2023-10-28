import React, { useState } from "react";
import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CollabEditor from "../../components/CollabEditor/CollabEditor.component";

function HomePage() {
  const [code, setCode] = useState("");
  return (
    <CollabEditor
      language="C++"
      onChange={(s) => setCode(s)}
      defaultValue="hello"
    ></CollabEditor>
  );
}

export default HomePage;
