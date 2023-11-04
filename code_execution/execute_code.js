const axios = require("axios");

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
    let status;
    let response;

    do {
      response = await axios.get(`${SERVER_URL}/result/${token}`);
      status = response.data.statusId;

      if (status === 1 || status === 2) {
        // Still processing, wait for 1 second and then check again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (status === 1 || status === 2);

    return response.data.output; // Return the result obtained from the server
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching code execution result");
  }
}


// Function to compare results with expected values
function compareResults(result, expectedValue) {
  return result.trim() === expectedValue.trim();
}
  
async function execute(language_id, source_code, testCases) {
  try {
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const stdin = testCases[i].stdin;
      const expectedValue = testCases[i].expected;

      // Submit the code for execution
      const token = await submitCode(language_id, source_code, stdin);

      // Get the result of code execution using the token
      const result = await getResult(token);

      // Compare the result with the expected value for this test case
      const testResult = compareResults(result, expectedValue);

      console.log(`Test Case ${i}: ${testResult ? 'Passed' : 'Failed'} Actual: ${result} Expected: ${expectedValue}`);

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

module.exports = { execute };
