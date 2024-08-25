let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let correctCount = 0; // 맞힌 문제 수
let totalQuestions = 0; // 전체 문제 수

// JSON 파일에서 데이터를 가져와서 초기화합니다.
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        console.log("Questions loaded:", questions); // 디버깅을 위한 로그 추가
        getRandomQuestion(); // JSON 데이터가 로드된 후 첫 질문을 출력
    })
    .catch(error => {
        console.error("Error loading questions:", error);
    });

function getRandomQuestion() {
    const category = document.getElementById('category').value;
    console.log("Selected category:", category); // 디버깅을 위한 로그 추가
    let filteredQuestions = questions;

    if (category !== 'all') {
        filteredQuestions = questions.filter(q => q.category === category);
        console.log("Filtered questions:", filteredQuestions); // 필터링된 질문들 로그
    }

    if (filteredQuestions.length === 0) {
        console.error("No questions found for the selected category.");
        document.getElementById("question").innerText = "No questions available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    currentQuestion = filteredQuestions[randomIndex];

    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
}

// function checkAnswer() {
//     const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
//     const correctAnswer = currentQuestion.answer.toLowerCase();

//     totalQuestions++;
//     if (userAnswer === correctAnswer) {
//         correctCount++;
//         document.getElementById("feedback").innerText = "Correct!";
//         document.getElementById("feedback").className = "correct";
//         setTimeout(() => getRandomQuestion(), 1000); // 1초 후 다음 질문으로 넘어갑니다.
//     } else {
//         document.getElementById("feedback").innerText = "Incorrect, try again!";
//         document.getElementById("feedback").className = "incorrect";
//     }

//     updateStats();
// }

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    totalQuestions++;
    if (userAnswer === correctAnswer) {
        correctCount++;
        document.getElementById("feedback").innerText = "Correct!";
        document.getElementById("feedback").className = "correct";
        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion(); // 1초 후 다음 질문으로 넘어갑니다.
        }, 1000); // 1초 동안 메시지가 표시된 후 사라지게 합니다.
    } else {
        document.getElementById("feedback").innerText = "Incorrect, try again!";
        document.getElementById("feedback").className = "incorrect";
        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
        }, 1000); // 1초 동안 메시지가 표시된 후 사라지게 합니다.
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
