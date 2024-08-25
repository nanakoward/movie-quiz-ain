let originalQuestions = []; // 초기 질문 데이터를 저장하는 배열
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
    return {}; // 사이트를 열 때마다 highestScores를 초기화
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
        closeSettings(); // 닉네임을 저장한 후 팝업을 닫습니다.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('settings-nickname-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Return') {
            event.preventDefault();
            saveNicknameFromSettings();
        }
    });

    document.getElementById("save-settings-button").addEventListener("click", saveNicknameFromSettings);
    document.getElementById("close-settings-button").addEventListener("click", closeSettings);
// Reset 확인 버튼 작동하도록 설정
document.getElementById("reset-button").addEventListener("click", confirmReset);

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'confirm-reset-yes') {
            resetAllData();
        }
        if (event.target && event.target.id === 'confirm-reset-no') {
            openSettings();
        }
    });

    document.getElementById("answer-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === "Return") {
            event.preventDefault(); 
            checkAnswer(); 
        }
    });

    document.getElementById("submit-answer-button").addEventListener("click", checkAnswer);
});

function closeSettings() {
    document.getElementById('settings-popup').style.display = 'none';
}

function openSettings() {
    const settingsPopup = document.getElementById('settings-popup');
    settingsPopup.style.backgroundColor = "#333";  // Setting 메뉴의 배경색 설정
    settingsPopup.style.display = 'block';
    document.getElementById("reset-button").addEventListener("click", confirmReset);
}

function resetAllData() {
    localStorage.clear(); // 로컬 스토리지 전체 초기화
    location.reload(); // 페이지 새로고침
}

function confirmReset() {
    const settingsPopup = document.getElementById('settings-popup');
    settingsPopup.innerHTML = `
        <h2 style="color: red;">정말 초기화 하시겠습니까?</h2>
        <button id="confirm-reset-yes">네</button>
        <button id="confirm-reset-no">아니오</button>
    `;
}
function normalizeString(str) {
    return str.toLowerCase().replace(/\s+/g, ''); // 소문자로 변경하고 모든 띄어쓰기를 제거
}

function getNormalizedAnswer(answer) {
    return normalizeString(answer);
}

// JSON 파일에서 데이터를 가져와서 초기화합니다.
fetch('questions.json')
.then(response => response.json())
.then(data => {
    originalQuestions = data.map(question => {
        question.answer = normalizeString(question.answer); // 정답을 소문자와 띄어쓰기 없는 상태로 정규화
        return question;
    });
    resetQuestions();
    highestScores = getHighestScores();
    allTimeHighestScores = getAllTimeHighestScores();
    nickname = getNickname();

    if (!nickname) {
        document.getElementById('nickname-popup').style.display = 'block';
    }

    getRandomQuestion();
})
.catch(error => {
    console.error("Error loading questions:", error);
});

function resetQuestions() {
    if (selectedCategory === 'all') {
        questions = [...originalQuestions];
    } else {
        questions = originalQuestions.filter(q => q.category === selectedCategory);
    }
    shuffleQuestions();
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function getRandomQuestion() {
    if (questions.length === 0) {
        document.getElementById("question").innerText = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
        return;
    }

    currentQuestion = questions.pop();

    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("show-answer-btn").style.display = 'none'; // Show Answer 버튼 숨김
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
    document.getElementById("answer-input").focus();
    showAnswerUsed = false;
}

function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = normalizeString(answerInput.value);  // 입력된 답변을 정규화
    const correctAnswer = getNormalizedAnswer(currentQuestion.answer);  // 정답을 정규화

    if (showAnswerUsed) {
        resetStreak();
    }

    if (userAnswer === correctAnswer) {
        currentStreak++;
        document.getElementById("feedback").innerText = `${nickname}, 정답!`;
        document.getElementById("feedback").className = "correct";

        if (currentStreak > (highestScores[selectedCategory] || 0)) {
            highestScores[selectedCategory] = currentStreak;
            saveHighestScores(highestScores);
            updateAllTimeHighestScores(selectedCategory, currentStreak);
        }

        updateHighestScoreDisplay();

        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion();
        }, 1000);
    } else {
        document.getElementById("feedback").innerText = `${nickname}, 까비..`;
        document.getElementById("feedback").className = "incorrect";
        resetStreak();
        resetQuestions();

        updateHighestScoreDisplay();

        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion();
        }, 1000);
    }

    answerInput.value = '';
    answerInput.focus();
}

function resetStreak() {
    currentStreak = 0;
    highestScores[selectedCategory] = 0;
    updateHighestScoreDisplay();
}

function updateAllTimeHighestScores(category, score) {
    if (score > (allTimeHighestScores[category] || 0)) {
        allTimeHighestScores[category] = score;
        saveAllTimeHighestScores(allTimeHighestScores);
    }
}

function updateHighestScoreDisplay() {
    document.getElementById("all-time-highest-score").innerText = `All-Time ${selectedCategory} Highest Streak: ${allTimeHighestScores[selectedCategory] || 0}`;
    document.getElementById("highest-score").innerText = `${selectedCategory} Highest Streak: ${highestScores[selectedCategory] || 0}`;
}

function showHint() {
    document.getElementById("hint").innerText = currentQuestion.hint;
    document.getElementById("hint").style.display = 'block';

    const showAnswerButton = document.getElementById("show-answer-btn");
    showAnswerButton.style.display = 'block';
    showAnswerButton.style.opacity = '0.2';
}

function showAnswer() {
    document.getElementById("correct-answer").innerText = currentQuestion.answer;
    document.getElementById("correct-answer").style.display = 'block';
    showAnswerUsed = true;
    resetStreak();
}

function selectCategory() {
    selectedCategory = document.getElementById('category').value;
    updateHighestScoreDisplay();
    resetQuestions();
    getRandomQuestion();
}
let isRefreshing = false;

function handleTouchStart(event) {
    isRefreshing = window.scrollY === 0;
}

function handleTouchMove(event) {
    if (isRefreshing) {
        const refreshIndicator = document.getElementById('refresh-indicator');
        if (window.scrollY > 10) {
            refreshIndicator.style.display = 'block';
        }
    }
}

function handleTouchEnd(event) {
    const refreshIndicator = document.getElementById('refresh-indicator');
    if (isRefreshing && window.scrollY > 10) {
        location.reload();
    } else {
        refreshIndicator.style.display = 'none';
    }
    isRefreshing = false;
}

window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);

document.getElementById("answer-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault(); 
        checkAnswer(); 
    }
});

highestScores = getHighestScores();
allTimeHighestScores = getAllTimeHighestScores();
nickname = getNickname();
updateHighestScoreDisplay();

function closeApp() {
    alert("To close the app, use your device's navigation buttons.");
}