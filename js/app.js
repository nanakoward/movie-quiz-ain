let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let correctCount = 0; // 맞힌 문제 수
let totalQuestions = 0; // 전체 문제 수
let touchStartY = 0;

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
    document.getElementById("answer-input").focus(); // 정답 입력칸에 커서가 가도록 함
}

function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = answerInput.value.trim().toLowerCase();
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

    answerInput.value = ''; // 틀렸을 경우 입력된 텍스트 삭제
    answerInput.focus(); // 입력칸에 커서가 가도록 함
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

// Enter 키를 눌렀을 때 checkAnswer 함수가 호출되도록 이벤트 추가
document.getElementById("answer-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault(); // 기본 Enter 키 동작 방지 (폼 제출 방지)
        checkAnswer(); // 정답 확인 함수 호출
    }
});

// 터치 이벤트를 활용한 새로고침 기능 구현
document.addEventListener("touchstart", function(event) {
    touchStartY = event.touches[0].clientY;
});

document.addEventListener("touchmove", function(event) {
    const touchEndY = event.touches[0].clientY;
    if (touchStartY < touchEndY - 100) { // 아래로 100px 이상 스크롤했을 때
        location.reload(); // 페이지 새로고침
    }
});

// "앱 닫기" 버튼 기능 구현
function closeApp() {
    if (window.confirm("Do you really want to exit?")) {
        window.close(); // 윈도우 닫기 시도 (모바일 브라우저에서는 작동하지 않을 수 있음)
    }
}
