import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { QuestionData, Question } from "../AddQuestionPage/QuestionData";
import { Button } from "react-bootstrap";
import "../HomePage/HomePage.css";
import "./ViewQuestion.css";


function ViewQuestion() {
    const { id } = useParams(); // Get the question ID from the route parameter
    const storedData = localStorage.getItem("QuestionData");
    const questionData: Question[] = storedData ? JSON.parse(storedData) : [];
  
    const question: Question | undefined = questionData.find((q) => q.id === Number(id)); // Find the question by ID
  
    let history = useNavigate();

    if (!question) {
      // Handle the case where the question is not found
      return <div>Question not found</div>;
    }
  
    const handleBack = (e: any) => {
        e.preventDefault();

        history("/");
    };

  return (
    <div className="homepage">
        <div className="background" />

        <div className="navbar">
            <div className="title">Peer Prep</div>
        </div>
        
        <div className="view-question col-md-10">
            <div className="row">
                <div className="col-md-2">
                    <div className="question-details">
                        <div className="left-details">
                            <div className="detail">
                                <p>Question ID:</p>
                                <p>{question.id}</p>
                            </div>
                            <div className="detail">
                                <p>Complexity:</p>
                                <p>{question.complexity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-10">
                    <div className="question-details">
                        <div className="right-details">
                            <div className="detail">
                                <p>Question Title:</p>
                                <p>{question.title}</p>
                            </div>
                            <div className="detail">
                                <p>Category:</p>
                                <p>{question.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="view-question">
            <div className="description">
                <label>Question Description:</label>
                <div
                    className="description-content"
                    contentEditable="true"
                >
                    {question.description}
                </div>
            </div>
        </div>

        <div className="back-button text-right">
            <Button onClick={(e) => handleBack(e)} type="submit" variant="primary" size="lg">
                Back
            </Button>
        </div>
    </div>
  );
}

export default ViewQuestion;