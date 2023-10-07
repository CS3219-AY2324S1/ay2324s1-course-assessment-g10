export type Question = {
  id: number;
  title: string;
  description: string;
  category: string;
  complexity: string;
};

function initializeData() {
  const storedData = localStorage.getItem('QuestionData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
}

const QuestionData = [
    {
      id: 1,
      title: 'Reverse a String',
      description: 'Write a function that reverses a string....',
      category: 'Strings, Algorithms',
      complexity: 'Easy',
    },
    {
      id: 2,
      title: 'Roman to Integer',
      description: 'Roman numerals are represented by seven different symbols: I, V, X.....',
      category: 'Data Structures, Algorithms',
      complexity: 'Easy',
    },
    
  ];


export { initializeData, QuestionData };
  