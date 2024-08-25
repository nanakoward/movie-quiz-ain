let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let highestScore = 0; // 최고 점수
let currentStreak = 0; // 현재 연속 정답 수
let showAnswerUsed = false; // Show Answer 버튼 사용 여부

// 로컬 저장소에서 최고 점수 가져오기
function getHighestScore() {
    return parseInt(localStorage.getItem('highestScore')) || 0;
}

// 로컬 저장소에 최고 점수 저장하기
function saveHighestScore(score) {
    localStorage.setItem('highestScore', score);
}

// JSON 파일에서 데이터를 가져와서 초기화합니다.
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleQuestions(); // 문제를 랜덤하게 섞음
        getRandomQuestion(); // 첫 질문을 출력
    })
    .catch(error => {
        console.error("Error loading questions:", error);
    });

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function getRandomQuestion() {
    if (questions.length === 0) {
        document.getElementById("question").innerText = "You've completed all the questions!";
        return;
    }
    
    currentQuestion = questions.pop(); // 문제를 하나씩 꺼냅니다.
    
    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
    document.getElementById("answer-input").focus(); // 정답 입력칸에 커서가 가도록 함
    showAnswerUsed = false; // 새로운 질문에서는 Show Answer 사용 여부 초기화
}

function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (userAnswer === correctAnswer && !showAnswerUsed) {
        currentStreak++;
        document.getElementById("feedback").innerText = "Correct!";
        document.getElementById("feedback").className = "correct";
        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion(); // 다음 질문으로 넘어갑니다.
        }, 1000);
    } else {
        document.getElementById("feedback").innerText = "Incorrect!";
        document.getElementById("feedback").className = "incorrect";
        resetStreak(); // 연속 정답 수 초기화
        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
        }, 1000);
    }

    answerInput.value = ''; // 입력된 텍스트 삭제
    answerInput.focus(); // 입력칸에 커서가 가도록 함
}

function resetStreak() {
    if (currentStreak > highestScore) {
        highestScore = currentStreak;
        saveHighestScore(highestScore);
    }
    currentStreak = 0;
    updateHighestScoreDisplay();
}

function updateHighestScoreDisplay() {
    document.getElementById("highest-score").innerText = highestScore;
}

function showHint() {
    document.getElementById("hint").innerText = currentQuestion.hint;
    document.getElementById("hint").style.display = 'block';
    document.getElementById("show-answer-btn").style.display = 'block'; // Show Answer 버튼 표시
    resetStreak(); // 힌트를 사용하면 연속 정답 수 초기화
}

function showAnswer() {
    document.getElementById("correct-answer").innerText = currentQuestion.answer;
    document.getElementById("correct-answer").style.display = 'block';
    showAnswerUsed = true; // Show Answer를 사용한 경우 연속 정답에서 제외
    resetStreak(); // 정답을 확인하면 연속 정답 수 초기화
}


// Enter 키를 눌렀을 때 checkAnswer 함수가 호출되도록 이벤트 추가
document.getElementById("answer-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault(); // 기본 Enter 키 동작 방지 (폼 제출 방지)
        checkAnswer(); // 정답 확인 함수 호출
    }
});

// 최고 점수를 로드하여 표시
highestScore = getHighestScore();
updateHighestScoreDisplay();

// "앱 닫기" 버튼 기능 구현
function closeApp() {
    alert("To close the app, use your device's navigation buttons.");
}
