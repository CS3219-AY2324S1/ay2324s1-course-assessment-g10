const axios = require("axios");
const { language_id, source_code, testCases } = require('./input_sample');

// Define the URL 
const SERVER_URL = "http://localhost:3000";

// Function to submit code for execution
async function submitCode(language_id, source_code, stdin) {
  try {
    source_code = btoa(source_code);
    stdin = btoa(stdin)
    // Make a POST request to your server's /submit endpoint
    const response = await axios.post(`${SERVER_URL}/submit`, {
      language_id,
      source_code,
      stdin,
    });

    // Return the token obtained from the server's response
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error while submitting code");
  }
}

// Function to get the result of code execution
async function getResult(token) {
  try {
    // Make a GET request to your server's /sresult endpoint using the token
    const response = await axios.get(`${SERVER_URL}/result/${token}`);

    const status = response.data.statusId;

    // Still processing, request again
    if (status === 1 || status === 2) {
        // still processing
        setTimeout(() => {
          getResult(token);
        }, 1000);
    }

    // Return the result obtained from the server
    return response.data.output;
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching code execution result");
  }
}

// Function to compare results with expected values
function compareResults(result, expectedValue) {
    return result === expectedValue;
}
  
async function execute(language_id, source_code, testCases) {
  try {
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const stdin = testCases[i].stdin;
      const expectedValue = testCases[i].expected;

      // Submit the code for execution
      const token = await submitCode(language_id, source_code, testCases);

      // Get the result of code execution using the token
      const result = await getResult(token);

      // Compare the result with the expected value for this test case
      const testResult = compareResults(result, expectedValue);

      console.log(`Test Case ${i}: ${testResult ? 'Passed' : 'Failed'} ${result} ${expectedValue}`);
      
      results.push({
        status: testResult,
        output: result,
        expected: expectedValue,
      });
    }
    return results;
  } catch (error) {
    console.error(error);
  }
}
// Example usage
execute(language_id, source_code, testCases);

module.exports = { execute };
