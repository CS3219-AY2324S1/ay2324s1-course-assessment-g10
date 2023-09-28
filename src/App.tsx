import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import  HomePage  from "./pages/HomePage/HomePage";
import Add from "./pages/AddQuestionPage/AddQuestion";


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path = "/create" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
