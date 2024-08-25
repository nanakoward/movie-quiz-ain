let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let highestScores = {}; // 카테고리별 현재 최고 점수 저장 객체
let allTimeHighestScores = {}; // 카테고리별 가장 높았던 최고 점수 저장 객체
let currentStreak = 0; // 현재 연속 정답 수
let showAnswerUsed = false; // Show Answer 버튼 사용 여부
let selectedCategory = 'all'; // 기본 선택 카테고리
let nickname = ''; // 사용자 닉네임

// 로컬 저장소에서 현재 최고 점수와 모든 시간의 최고 점수, 닉네임 가져오기
function getHighestScores() {
    return JSON.parse(localStorage.getItem('highestScores')) || {};
}

function getAllTimeHighestScores() {
    return JSON.parse(localStorage.getItem('allTimeHighestScores')) || {};
}

function getNickname() {
    return localStorage.getItem('nickname') || '';
}

// 로컬 저장소에 현재 최고 점수와 모든 시간의 최고 점수, 닉네임 저장하기
function saveHighestScores(scores) {
    localStorage.setItem('highestScores', JSON.stringify(scores));
}

function saveAllTimeHighestScores(scores) {
    localStorage.setItem('allTimeHighestScores', JSON.stringify(scores));
}

function saveNickname() {
    nickname = document.getElementById('nickname-input').value.trim();
    if (nickname) {
        localStorage.setItem('nickname', nickname);
        document.getElementById('nickname-popup').style.display = 'none';
    }
}

function saveNicknameFromSettings() {
    const newNickname = document.getElementById('settings-nickname-input').value.trim();
    if (newNickname) {
        nickname = newNickname;
        localStorage.setItem('nickname', nickname);
        closeSettings();
    }
}

function closeSettings() {
    document.getElementById('settings-popup').style.display = 'none';
}

function openSettings() {
    document.getElementById('settings-nickname-input').value = nickname; // 현재 닉네임을 입력 필드에 표시
    document.getElementById('settings-popup').style.display = 'block';
}

// JSON 파일에서 데이터를 가져와서 초기화합니다.
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        highestScores = getHighestScores();
        allTimeHighestScores = getAllTimeHighestScores();
        nickname = getNickname();

        if (!nickname) {
            document.getElementById('nickname-popup').style.display = 'block';
        }

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

    if (showAnswerUsed) {
        resetStreak();
    }

    if (userAnswer === correctAnswer) {
        currentStreak++;
        document.getElementById("feedback").innerText = `${nickname}, 정답!`;
        document.getElementById("feedback").className = "correct";
        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion(); // 다음 질문으로 넘어갑니다.
        }, 1000);
    } else {
        document.getElementById("feedback").innerText = `${nickname}, 까비..`;
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
    if (currentStreak > (highestScores[selectedCategory] || 0)) {
        highestScores[selectedCategory] = currentStreak;
        saveHighestScores(highestScores);
        updateAllTimeHighestScores(selectedCategory, currentStreak);
    }
    currentStreak = 0;
    updateHighestScoreDisplay();
}

function updateAllTimeHighestScores(category, score) {
    if (score > (allTimeHighestScores[category] || 0)) {
        allTimeHighestScores[category] = score;
        saveAllTimeHighestScores(allTimeHighestScores);
    }
}

function updateHighestScoreDisplay() {
    document.getElementById("highest-score").innerText = `${selectedCategory} Highest Streak: ${highestScores[selectedCategory] || 0}`;
    document.getElementById("all-time-highest-score").innerText = `All-Time ${selectedCategory} Highest Streak: ${allTimeHighestScores[selectedCategory] || 0}`;
}

function showHint() {
    document.getElementById("hint").innerText = currentQuestion.hint;
    document.getElementById("hint").style.display = 'block';

    // Show Answer 버튼 표시
    const showAnswerButton = document.getElementById("show-answer-btn");
    showAnswerButton.style.display = 'block'; 
    showAnswerButton.style.opacity = '0.2'; // 투명도 설정
}

function showAnswer() {
    document.getElementById("correct-answer").innerText = currentQuestion.answer;
    document.getElementById("correct-answer").style.display = 'block';
    showAnswerUsed = true; // Show Answer를 사용한 경우 연속 정답에서 제외
}

function selectCategory() {
    selectedCategory = document.getElementById('category').value;
    updateHighestScoreDisplay(); // 선택한 카테고리에 따라 최고 점수를 업데이트
    shuffleQuestions(); // 선택한 카테고리에 맞게 질문을 섞음
    getRandomQuestion(); // 첫 질문을 출력
}

// 새로고침 기능 추가
let isRefreshing = false;

function handleTouchStart(event) {
    // 스크롤 위치가 0일 때만 새로고침을 준비합니다.
    isRefreshing = window.scrollY === 0;
}

function handleTouchMove(event) {
    if (isRefreshing) {
        const refreshIndicator = document.getElementById('refresh-indicator');
        // 일정 거리 이상 스크롤이 움직이면 새로고침 애니메이션을 표시합니다.
        if (window.scrollY > 10) {
            refreshIndicator.style.display = 'block';
        }
    }
}

function handleTouchEnd(event) {
    const refreshIndicator = document.getElementById('refresh-indicator');
    if (isRefreshing && window.scrollY > 10) {
        // 스크롤 위치가 일정 이상 내려가면 페이지를 새로고침합니다.
        location.reload();
    } else {
        // 새로고침이 트리거되지 않으면 애니메이션을 숨깁니다.
        refreshIndicator.style.display = 'none';
    }
    isRefreshing = false;
}

// 이벤트 리스너 추가
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);


// Enter 키를 눌렀을 때 checkAnswer 함수가 호출되도록 이벤트 추가
document.getElementById("answer-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault(); // 기본 Enter 키 동작 방지 (폼 제출 방지)
        checkAnswer(); // 정답 확인 함수 호출
    }
});

// 최고 점수를 로드하여 표시
highestScores = getHighestScores();
allTimeHighestScores = getAllTimeHighestScores();
nickname = getNickname();
updateHighestScoreDisplay();

// "앱 닫기" 버튼 기능 구현
function closeApp() {
    alert("To close the app, use your device's navigation buttons.");
}
