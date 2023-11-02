// Define your input values
const language_id = 71;
const source_code = `x = input()
print(x)`;

const testCases = [
    { stdin: "Hello, World!", expected: "Hello, World!"},
    { stdin: "42", expected: "42!"},
    { stdin: "Python is fun!", expected: "Python is fun!" },
    { stdin: "123.45", expected: "123.45" },
    { stdin: "Random Text", expected: "Random Text" },
  ];
  

// Export the input values as constants
module.exports = {
  language_id,
  source_code,
  testCases,
};