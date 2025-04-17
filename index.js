// Quiz Data
const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Rome", correct: false },
            { text: "Berlin", correct: false }
        ]
    },
    {
        question: "Which language runs in a web browser?",
        answers: [
            { text: "Java", correct: false },
            { text: "C", correct: false },
            { text: "Python", correct: false },
            { text: "JavaScript", correct: true }
        ]
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: [
            { text: "Mars", correct: false },
            { text: "Jupiter", correct: true },
            { text: "Saturn", correct: false },
            { text: "Neptune", correct: false }
        ]
    },
    {
        question: "What is the chemical symbol for water?",
        answers: [
            { text: "Wo", correct: false },
            { text: "Wa", correct: false },
            { text: "H2O", correct: true },
            { text: "HO2", correct: false }
        ]
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: [
            { text: "Vincent van Gogh", correct: false },
            { text: "Leonardo da Vinci", correct: true },
            { text: "Pablo Picasso", correct: false },
            { text: "Claude Monet", correct: false }
        ]
    },
    {
        question: "What year did World War II end?",
        answers: [
            { text: "1943", correct: false },
            { text: "1945", correct: true },
            { text: "1950", correct: false },
            { text: "1939", correct: false }
        ]
    },
    {
        question: "What is the currency of Japan?",
        answers: [
            { text: "Won", correct: false },
            { text: "Yen", correct: true },
            { text: "Euro", correct: false },
            { text: "Pound", correct: false }
        ]
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        answers: [
            { text: "Oxygen", correct: false },
            { text: "Carbon Dioxide", correct: true },
            { text: "Nitrogen", correct: false },
            { text: "Hydrogen", correct: false }
        ]
    },
    {
        question: "What is the highest mountain in the world?",
        answers: [
            { text: "K2", correct: false },
            { text: "Mount Everest", correct: true },
            { text: "Kangchenjunga", correct: false },
            { text: "Lhotse", correct: false }
        ]
    },
    {
        question: "What is the main ingredient in guacamole?",
        answers: [
            { text: "Tomato", correct: false },
            { text: "Avocado", correct: true },
            { text: "Onion", correct: false },
            { text: "Lime", correct: false }
        ]
    }
];

// App State
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// DOM Elements
const questionContainer = document.getElementById('questionContainer');
const resultsContainer = document.getElementById('resultsContainer');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const answerContainer = document.getElementById('answerContainer');
const nextBtn = document.getElementById('nextBtn');
const scoreValue = document.getElementById('scoreValue');
const totalQuestions = document.getElementById('totalQuestions');
const resultsBreakdown = document.getElementById('resultsBreakdown');
const restartBtn = document.getElementById('restartBtn');
const progressGrid = document.getElementById('progressGrid');

// Initialize Quiz
function initializeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(questions.length).fill(null);

    // Generate progress grid
    progressGrid.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const progressItem = document.createElement('div');
        progressItem.classList.add('progress-item');
        progressItem.textContent = i + 1;
        if (i === 0) progressItem.classList.add('active');
        progressGrid.appendChild(progressItem);
    }

    // Display first question
    showQuestion(currentQuestionIndex);

    // Set total questions
    totalQuestions.textContent = questions.length;
}

// Display Question
function showQuestion(index) {
    resetState();

    const question = questions[index];
    questionNumber.textContent = `Question ${index + 1}/${questions.length}`;
    questionText.textContent = question.question;

    // Update progress grid
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) item.classList.add('active');
    });

    // Create answer buttons
    question.answers.forEach((answer, i) => {
        const button = document.createElement('div');
        button.classList.add('answer-option');
        button.innerHTML = `
            <span class="answer-text">${answer.text}</span>
        `;
        button.dataset.index = i;

        // Check if user has already answered this question
        if (userAnswers[currentQuestionIndex] !== null &&
            userAnswers[currentQuestionIndex].answerIndex === i) {
            button.classList.add('selected');
        }

        button.addEventListener('click', selectAnswer);
        answerContainer.appendChild(button);
    });

    // Enable next button if question is already answered
    if (userAnswers[currentQuestionIndex] !== null) {
        nextBtn.disabled = false;
    }
}

// Reset UI state
function resetState() {
    nextBtn.disabled = true;
    while (answerContainer.firstChild) {
        answerContainer.removeChild(answerContainer.firstChild);
    }
}

// Handle Answer Selection
function selectAnswer(e) {
    // If user has already selected an answer, don't allow changes
    if (userAnswers[currentQuestionIndex] !== null) return;

    const selectedButton = e.currentTarget;
    const answerIndex = parseInt(selectedButton.dataset.index);
    const question = questions[currentQuestionIndex];
    const isCorrect = question.answers[answerIndex].correct;

    // Store user's answer
    userAnswers[currentQuestionIndex] = {
        answerIndex: answerIndex,
        isCorrect: isCorrect
    };

    // Update score if answer is correct
    if (isCorrect) {
        score++;
    }

    // Mark selected answer
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => option.classList.remove('selected'));
    selectedButton.classList.add('selected');

    // Update progress grid
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems[currentQuestionIndex].classList.add('answered');
    if (isCorrect) {
        progressItems[currentQuestionIndex].classList.add('correct');
    } else {
        progressItems[currentQuestionIndex].classList.add('incorrect');
    }

    // Enable next button
    nextBtn.disabled = false;
}

// Handle Next Button Click
function handleNextButton() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        // Show next question
        showQuestion(currentQuestionIndex);
    } else {
        // Show results
        showResults();
    }
}

// Show Quiz Results
function showResults() {
    questionContainer.classList.remove('active');
    questionContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('active');

    // Update score
    scoreValue.textContent = score;

    // Generate results breakdown
    resultsBreakdown.innerHTML = '';
    questions.forEach((question, qIndex) => {
        const userAnswer = userAnswers[qIndex];
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        const questionEl = document.createElement('div');
        questionEl.classList.add('result-question');
        questionEl.textContent = `${qIndex + 1}. ${question.question}`;
        resultItem.appendChild(questionEl);

        const answersEl = document.createElement('div');
        answersEl.classList.add('result-answers');

        // User's answer
        const userSelectedAnswer = document.createElement('div');
        if (userAnswer.isCorrect) {
            userSelectedAnswer.classList.add('result-answer', 'user-correct');
            userSelectedAnswer.textContent = `✓ Your answer: ${question.answers[userAnswer.answerIndex].text}`;
        } else {
            userSelectedAnswer.classList.add('result-answer', 'user-incorrect');
            userSelectedAnswer.textContent = `✗ Your answer: ${question.answers[userAnswer.answerIndex].text}`;

            // Correct answer (if user was wrong)
            const correctAnswer = document.createElement('div');
            correctAnswer.classList.add('result-answer', 'correct-answer');
            const correctAnswerObj = question.answers.find(answer => answer.correct);
            correctAnswer.textContent = `✓ Correct answer: ${correctAnswerObj.text}`;
            answersEl.appendChild(correctAnswer);
        }
        answersEl.insertBefore(userSelectedAnswer, answersEl.firstChild);

        resultItem.appendChild(answersEl);
        resultsBreakdown.appendChild(resultItem);
    });
}

// Reset Quiz
function restartQuiz() {
    resultsContainer.classList.remove('active');
    resultsContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    questionContainer.classList.add('active');

    initializeQuiz();
}

// Event Listeners
nextBtn.addEventListener('click', handleNextButton);
restartBtn.addEventListener('click', restartQuiz);

// Initialize the Quiz
document.addEventListener('DOMContentLoaded', initializeQuiz);