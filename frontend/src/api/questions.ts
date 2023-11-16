import { AxiosResponse } from "axios";
import { Question } from "../models/Question.model";
import { qnServiceClient } from "./gateway";

export async function fetchAllQuestions() {
    const response = await qnServiceClient.get('/api/questions');

    const resData = response.data;
    const questions : Question[] = resData.map((q : any) => new Question(q._id, q.id, q.title, q.description, q.topics, q.difficulty))
    return questions;
}

/**
 * Tries to fetch a specific question from the backend
 * 
 * @param _id The uuid identifying the question resource
 * @returns The fetched question, or undefined on error
 */
export async function fetchQuestion(_id: string) {
    try {
        const response = await qnServiceClient.get(`/api/questions/${_id}`);
    
        const resData = response.data;
        const resQuestion : Question = new Question(
            resData._id, 
            resData.id, 
            resData.title, 
            resData.description, 
            resData.topics, 
            resData.difficulty);
    
        return resQuestion;
    } catch (err) {
        return undefined;
    }
}

/**
 * Adds a question to the backend server via POST
 * 
 * @param question The question to add to the database
 * @returns
 */
export async function addQuestion(question: Question) {

    const response: AxiosResponse = await qnServiceClient.post('/api/questions', {
        title: question.title,
        description: question.descMd,
        topics: question.topics,
        difficulty: question.difficulty
    });

    const resData = response.data;
    
    const resQuestion : Question = new Question(
        resData._id, 
        resData.id, 
        resData.title, 
        resData.description, 
        resData.topics, 
        resData.difficulty);

    return resQuestion;
}

/**
 * @param _id The uuid identifying the question resource
 */
export async function delQuestion(_id : string) {
    const response = await qnServiceClient.delete(`/api/questions/${_id}`);

    return response;
}


/**
 * Updates a question on the backend server via PUT 
 * 
 * @param _id The uuid identifying the question resource
 * @param question The new question info to add to the database
 * @returns
 */
export async function updateQuestion(_id: string, question: Question) {

    const response: AxiosResponse = await qnServiceClient.put(`/api/questions/${_id}`, {
        title: question.title,
        description: question.descMd,
        topics: question.topics,
        difficulty: question.difficulty
    })

    const resData = response.data;
    const resQuestion : Question = new Question(
        resData._id, 
        resData.id,
        resData.title, 
        resData.description, 
        resData.topics, 
        resData.difficulty
    );

    return resQuestion;

}


