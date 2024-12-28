const levelSelectionElement = document.getElementById('level-selection');
const quizElement = document.getElementById('quiz');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart');

let score = 0;
let currentQuestionIndex = 0;
let startTime;
let totalTime = 0;
let questions = [];

// Generate questions based on difficulty
function generateQuestions(difficulty) {
  const numQuestions = 10;
  const generatedQuestions = [];

  for (let i = 0; i < numQuestions; i++) {
    const num1 = Math.floor(Math.random() * (difficulty === 'hard' ? 100 : difficulty === 'medium' ? 50 : 20)) + 1;
    const num2 = Math.floor(Math.random() * (difficulty === 'hard' ? 100 : difficulty === 'medium' ? 50 : 20)) + 1;
    const operators = difficulty === 'hard' ? ['+', '-', '*', '/'] : ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const correctAnswer = parseFloat(eval(`${num1} ${operator} ${num2}`).toFixed(1));

    const options = [
      correctAnswer,
      (correctAnswer + Math.floor(Math.random() * 5) + 1).toFixed(1),
      (correctAnswer - Math.floor(Math.random() * 5) - 1).toFixed(1),
      (correctAnswer + Math.floor(Math.random() * 10) - 5).toFixed(1),
    ];

    generatedQuestions.push({
      question: `What is ${num1} ${operator} ${num2}?`,
      correctAnswer,
      options: options.sort(() => Math.random() - 0.5),
    });
  }

  return generatedQuestions;
}

function startQuiz(difficulty) {
  levelSelectionElement.style.display = 'none';
  quizElement.style.display = 'block';

  questions = generateQuestions(difficulty);
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex === 0) {
    startTime = Date.now();
  }

  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    answerButtonsElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.classList.add('option-button');
      button.onclick = () => selectAnswer(option);
      answerButtonsElement.appendChild(button);
    });
  } else {
    showResult();
  }
}

function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.option-button');

  buttons.forEach(button => {
    if (parseFloat(button.textContent) === currentQuestion.correctAnswer) {
      button.classList.add('correct');
    } else if (parseFloat(button.textContent) === parseFloat(selectedOption)) {
      button.classList.add('wrong');
    }
    button.disabled = true;
  });

  if (parseFloat(selectedOption) === currentQuestion.correctAnswer) {
    score++;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}

function showResult() {
  totalTime = (Date.now() - startTime) / 1000; // Total time in seconds
  const averageTime = (totalTime / questions.length).toFixed(2);

  quizElement.style.display = 'none';
  resultElement.style.display = 'block';
  scoreElement.innerHTML = `Score: ${score}/${questions.length} <br>Total Time: ${totalTime}s <br>Average Time: ${averageTime}s per question`;

  const starsContainer = document.createElement('div');
  starsContainer.classList.add('stars');
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.innerHTML = i < Math.ceil((score / questions.length) * 5) ? '★' : '☆';
    starsContainer.appendChild(star);
  }

  resultElement.appendChild(starsContainer);
}

function restartQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  totalTime = 0;
  questions = [];
  resultElement.style.display = 'none';
  levelSelectionElement.style.display = 'block';
}

restartButton.addEventListener('click', restartQuiz);
