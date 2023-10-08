import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import {useNavigate} from 'react-router-dom';
import { Question, initializeData, QuestionData } from './QuestionData';
import '../HomePage/HomePage.css'; 
// import '../App.css'

function Add() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('');
  const [QuestionData, setQuestionData] = useState(initializeData());

    let history = useNavigate();

    const handleSubmit = (e: any) => {
        e.preventDefault();

    // Find the maximum ID in the existing QuestionData
    const maxId = Math.max(...QuestionData.map((item: Question) => item.id), 0);

    // Increment the maximum ID to generate a new ID
    const newId = maxId + 1;

    // Create a new question object with the new ID and the title provided by the user
    const newQuestion = {
        id: newId,
        title: title,
        description: description,
        category: category,
        complexity: complexity,
      };
   
    // Add the new question to the QuestionData array
    const updatedData = [...QuestionData, newQuestion];
    setQuestionData(updatedData);

    // Store the updated data in local storage
    localStorage.setItem('QuestionData', JSON.stringify(updatedData));

    // Navigate back to the homepage
    history("/");
  
    }

    const handleCancel = (e: any) => {
        e.preventDefault();

        history("/");
  
    }

    return (
        <div className="homepage">
          <div className="background" />
    
          <div className="navbar">
            <div className="title">Question Bank</div>
          </div>
    
            <Form className="d-grid gap-2" style={{margin:"15rem", width: "80%", alignItems: "center"}}>

                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder = "Enter Question Title" required onChange= {(e) => setTitle(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder = "Enter Question Complexity" required onChange= {(e) => setComplexity(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder = "Enter Question Category" required onChange= {(e) => setCategory(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder = "Enter Question Description" style={{ height: '200px' }} required onChange= {(e) => setDescription(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button onClick={(e) => handleCancel(e)} type ="submit" style={{width: "30%"}}> Cancel </Button>
                    <Button onClick={(e) => handleSubmit(e)} type ="submit" style={{width: "30%"}}> Submit</Button> 
                </div>
            </Form>
        </div>
      );
}

export default Add;