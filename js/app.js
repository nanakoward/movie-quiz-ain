let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        getRandomQuestion(); // JSON 데이터가 로드된 후 첫 질문을 출력
    });

function getRandomQuestion() {
    const category = document.getElementById('category').value;
    let filteredQuestions = questions;

    if (category !== 'all') {
        filteredQuestions = questions.filter(q => q.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    currentQuestion = filteredQuestions[randomIndex];

    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById("feedback").innerText = "Correct!";
        document.getElementById("feedback").className = "correct";
        setTimeout(() => getRandomQuestion(), 1000); // 1초 후 다음 질문으로 넘어갑니다.
    } else {
        document.getElementById("feedback").innerText = "Incorrect, try again!";
        document.getElementById("feedback").className = "incorrect";
    }
}

function showHint() {
    document.getElementById("hint").innerText = currentQuestion.hint;
    document.getElementById("hint").style.display = 'block';
}

function showAnswer() {
    document.getElementById("correct-answer").innerText = currentQuestion.answer;
    document.getElementById("correct-answer").style.display = 'block';
}

let questions = [];
let currentQuestion = null;
let correctCount = 0;
let totalQuestions = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        getRandomQuestion(); // JSON 데이터가 로드된 후 첫 질문을 출력
    });

function getRandomQuestion() {
    const category = document.getElementById('category').value;
    let filteredQuestions = questions;

    if (category !== 'all') {
        filteredQuestions = questions.filter(q => q.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    currentQuestion = filteredQuestions[randomIndex];

    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    totalQuestions++;
    if (userAnswer === correctAnswer) {
        correctCount++;
        document.getElementById("feedback").innerText = "Correct!";
        document.getElementById("feedback").className = "correct";
        setTimeout(() => getRandomQuestion(), 1000); // 1초 후 다음 질문으로 넘어갑니다.
    } else {
        document.getElementById("feedback").innerText = "Incorrect, try again!";
        document.getElementById("feedback").className = "incorrect";
    }

    updateStats();
}

function updateStats() {
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    document.getElementById("correct-count").innerText = correctCount;
    document.getElementById("total-questions").innerText = totalQuestions;
    document.getElementById("accuracy").innerText = accuracy.toFixed(2);
}

function showHint() {
    document.getElementById("hint").innerText = currentQuestion.hint;
    document.getElementById("hint").style.display = 'block';
}

function showAnswer() {
    document.getElementById("correct-answer").innerText = currentQuestion.answer;
    document.getElementById("correct-answer").style.display = 'block';
}
