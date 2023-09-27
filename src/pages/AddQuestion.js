import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import {v4 as uuid} from "uuid";
import {Link, useNavigate} from 'react-router-dom';
import QuestionData from './QuestionData.js';

function Add(){

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('');

    let history = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Find the maximum ID in the existing QuestionData
    const maxId = Math.max(...QuestionData.map((question) => question.id), 0);

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
      QuestionData.push(newQuestion);
  
      // Navigate back to the homepage
      history("/");
  
    }



    return (
    <div>
        <Form className="d-grid gap-2" style={{margin:"15rem"}}>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Control type="text" placeholder = "Enter Question Title" required onChange= {(e) => setTitle(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Control type="text" placeholder = "Enter Question Description" required onChange= {(e) => setDescription(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Control type="text" placeholder = "Enter Question Category" required onChange= {(e) => setCategory(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
                <Form.Control type="text" placeholder = "Enter Question Complexity" required onChange= {(e) => setComplexity(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button onClick={(e) => handleSubmit(e)} type ="submit"> Submit</Button>
        </Form>
    </div>

);
}

export default Add;