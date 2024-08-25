// app.js 파일 내용

// JSON 파일에서 질문 데이터를 불러오기
let questions = [];
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadNewQuestion(); // 첫 번째 질문을 로드
    });

let currentQuestionIndex = 0;
let correctStreak = 0;
let highestStreak = 0;
let selectedCategory = "all";

// 질문 카테고리 선택
function selectCategory() {
    selectedCategory = document.getElementById("category").value;
    loadNewQuestion();
}

// 새로운 질문 로드
function loadNewQuestion() {
    const filteredQuestions = selectedCategory === "all" ? questions : questions.filter(q => q.category === selectedCategory);
    currentQuestionIndex = Math.floor(Math.random() * filteredQuestions.length);
    document.getElementById("question").innerText = filteredQuestions[currentQuestionIndex].question;
    document.getElementById("answer-input").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("hint").style.display = "none";
    document.getElementById("correct-answer").style.display = "none";
    document.getElementById("show-answer-btn").style.display = "none";
}

// 답 체크
function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim();
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (userAnswer === correctAnswer) {
        document.getElementById("feedback").innerText = "Correct!";
        correctStreak++;
        if (correctStreak > highestStreak) {
            highestStreak = correctStreak;
            document.getElementById("highest-score").innerText = "Highest Streak: " + highestStreak;
        }
    } else {
        document.getElementById("feedback").innerText = "Wrong! The correct answer was: " + correctAnswer;
        correctStreak = 0;
        loadNewQuestion();  // 오답일 경우 새로운 질문 로드
    }

    document.getElementById("all-time-highest-score").innerText = "All-Time Highest Streak: " + highestStreak;
}

// 힌트 보기
function showHint() {
    document.getElementById("hint").style.display = "block";
    document.getElementById("hint").innerText = "Hint: " + questions[currentQuestionIndex].hint;
}

// 정답 보기
function showAnswer() {
    document.getElementById("correct-answer").style.display = "block";
    document.getElementById("correct-answer").innerText = "The correct answer is: " + questions[currentQuestionIndex].answer;
}

// 닉네임 저장 (예시로 사용됨)
function saveNickname() {
    const nickname = document.getElementById("nickname-input").value.trim();
    if (nickname) {
        alert("Nickname saved: " + nickname);
        document.getElementById("nickname-popup").style.display = "none";
    }
}

// 설정 열기 (예시로 사용됨)
function openSettings() {
    document.getElementById("settings-popup").style.display = "block";
}

// 설정 닫기 (예시로 사용됨)
function closeApp() {
    window.close(); // 예시로 창을 닫는 기능
}

// 초기화 확인
document.getElementById("reset-button").addEventListener("click", () => {
    document.getElementById("reset-confirmation").style.display = "block";
});

// 초기화 확인 메시지
document.getElementById("confirm-reset-button").addEventListener("click", () => {
    correctStreak = 0;
    highestStreak = 0;
    document.getElementById("highest-score").innerText = "Highest Streak: " + highestStreak;
    document.getElementById("all-time-highest-score").innerText = "All-Time Highest Streak: " + highestStreak;
    document.getElementById("reset-confirmation").style.display = "none";
});

// 초기화 취소
document.getElementById("cancel-reset-button").addEventListener("click", () => {
    document.getElementById("reset-confirmation").style.display = "none";
});
