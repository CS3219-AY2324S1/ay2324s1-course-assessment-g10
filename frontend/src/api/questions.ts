import { questionServiceClient } from "./server";

export async function fetchAllQuestions() {
    const response = await questionServiceClient.get('/api/questions');

    return response;
}

export async function fetchQuestion(questionId: string) {
    const response = await questionServiceClient.get(`/api/questions/${questionId}`);

    return response;
}

export async function addQuestion(
    title: string, 
    description: string, 
    category: string[], 
    complexity: string) {

    const response = await questionServiceClient.post('/api/questions', {
        title: title,
        description: description,
        category: category,
        complexity: complexity
    })

    return response;
}

/**
 * @param id - question id 
 */
export async function delQuestion(id : string) {
    const response = await questionServiceClient.delete(`/api/questions/${id}`);

    return response;
}



