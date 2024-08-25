let originalQuestions = []; // 초기 질문 데이터를 저장하는 배열
let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let highestScores = {}; // 카테고리별 현재 최고 점수 저장 객체
let allTimeHighestScores = {}; // 카테고리별 가장 높았던 최고 점수 저장 객체
let currentStreak = 0; // 현재 연속 정답 수
let showAnswerUsed = false; // Show Answer 버튼 사용 여부
let selectedCategory = 'all'; // 기본 선택 카테고리
let nickname = ''; // 사용자 닉네임
let showAnswerClicked = false; // Show Answer 버튼 클릭 여부

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
    document.getElementById("reset-button").addEventListener("click", confirmReset); // 초기화 버튼 리스너 추가

    updateAllCategoriesCount(); // All Categories의 질문 개수를 업데이트
    // 기존 카테고리의 All-Time Highest Streak를 확인하여 마스터 메시지 및 입력 비활성화 처리
    checkAllTimeHighestStreak();
});

function updateAllCategoriesCount() {
    const totalQuestions = originalQuestions.length; // 모든 카테고리의 질문 개수를 합산
    const allCategoriesOption = document.querySelector('option[value="all"]'); // 'All Categories' 옵션 선택
    allCategoriesOption.textContent = `All Categories (${totalQuestions} questions)`; // 텍스트 업데이트
}

function checkAllTimeHighestStreak() {
    const totalQuestionsInCategory = originalQuestions.filter(q => q.category === selectedCategory).length;
    const currentAllTimeHighestStreak = allTimeHighestScores[selectedCategory] || 0;

    if (currentAllTimeHighestStreak === totalQuestionsInCategory) {
        displayMasterMessage();
        disableAnswerInputs();
        displayMasterInInput(); // 입력창에 마스터 메시지 표시
    } else {
        enableAnswerInputs(); // 다른 카테고리에서 활성화
    }
}

// 입력창에 Master 메시지를 표시하는 함수
function displayMasterInInput() {
    const answerInput = document.getElementById("answer-input");
    answerInput.value = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
    answerInput.style.textAlign = "center"; // 텍스트를 가운데 정렬
    answerInput.style.color = "#000"; // 텍스트 색상 설정
    answerInput.style.fontWeight = "bold"; // 텍스트 굵게 설정
}

// 답변 입력창 및 버튼을 활성화하는 함수
function enableAnswerInputs() {
    const answerButton = document.getElementById("submit-answer-button"); // checkAnswer()가 연결된 버튼
    const answerInput = document.getElementById("answer-input"); // 답변 입력창

    answerButton.disabled = false; // 버튼 활성화
    answerButton.classList.remove("disabled-button"); // 비활성화 스타일 제거

    answerInput.disabled = false; // 입력창 활성화
    answerInput.classList.remove("disabled-input"); // 비활성화 스타일 제거

    // 기존에 표시된 마스터 메시지를 초기화
    answerInput.value = '';
    answerInput.style.textAlign = "left"; // 기본 텍스트 정렬로 되돌림
    answerInput.style.color = ""; // 기본 텍스트 색상으로 되돌림
    answerInput.style.fontWeight = "normal"; // 기본 텍스트 굵기로 되돌림
}


function closeSettings() {
    document.getElementById('settings-popup').style.display = 'none';
}

function openSettings() {
    document.getElementById('settings-nickname-input').value = nickname; 
    document.getElementById('settings-popup').style.display = 'block';
}

// JSON 파일에서 데이터를 가져와서 초기화합니다.
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        originalQuestions = data; 
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
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
    document.getElementById("answer-input").focus(); 
    showAnswerUsed = false; 
}

// 기존의 checkAnswer() 함수 내 마스터 메시지 출력 및 비활성화 부분을 제거
function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    // 정답이 맞든 틀리든 show-answer-btn과 correct-answer의 스타일을 display:none으로 설정
    document.getElementById("show-answer-btn").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';

    if (userAnswer === correctAnswer && !showAnswerClicked) {
        currentStreak++;
        document.getElementById("feedback").innerText = `${nickname}, 정답!`;
        document.getElementById("feedback").className = "correct";

        // Highest Streak 갱신
        highestScores[selectedCategory] = currentStreak;

        // All-Time Highest Streak 갱신
        if (currentStreak > (allTimeHighestScores[selectedCategory] || 0)) {
            allTimeHighestScores[selectedCategory] = currentStreak;
            saveAllTimeHighestScores(allTimeHighestScores);
        }

        saveHighestScores(highestScores);
        updateHighestScoreDisplay(); 

        // All-Time Highest Streak가 질문 개수와 동일해진 경우 처리
        if (allTimeHighestScores[selectedCategory] === originalQuestions.filter(q => q.category === selectedCategory).length) {
            displayMasterMessage();
            disableAnswerInputs();
            displayMasterInInput(); // 입력창에 마스터 메시지 표시
            return;
        }

        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion(); 
        }, 1000);
    } else {
        // showAnswer()가 클릭되었으면 오답 처리 및 "다시 도전!!!!" 메시지 표시
        const feedbackMessage = showAnswerClicked ? '다시 도전!!!!' : `${nickname}, 까비..`;
        document.getElementById("feedback").innerText = feedbackMessage;
        document.getElementById("feedback").className = "incorrect";

        resetStreak();  // 틀린 경우 streak 초기화
        
        resetQuestions();  // 질문 리스트를 초기화합니다.

        updateHighestScoreDisplay(); 

        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion();  // 초기화된 리스트에서 새로운 질문을 가져옵니다.
        }, 1000);
    }

    answerInput.value = ''; 
    answerInput.focus(); 
}


// Master 메시지를 표시하는 함수
function displayMasterMessage() {
    document.getElementById("question").innerText = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
}

// 버튼 비활성화 및 스타일 변경 함수
function disableAnswerButton() {
    const answerButton = document.getElementById("submit-answer-button"); // checkAnswer()가 연결된 버튼
    answerButton.disabled = true; // 버튼 비활성화
    answerButton.classList.add("disabled-button"); // 비활성화 스타일 추가
}

// 답변 입력창 및 버튼을 비활성화하는 함수
function disableAnswerInputs() {
    const answerButton = document.getElementById("submit-answer-button"); // checkAnswer()가 연결된 버튼
    const answerInput = document.getElementById("answer-input"); // 답변 입력창

    answerButton.disabled = true; // 버튼 비활성화
    answerButton.classList.add("disabled-button"); // 비활성화 스타일 추가

    answerInput.disabled = true; // 입력창 비활성화
    answerInput.classList.add("disabled-input"); // 비활성화 스타일 추가
}


function getRandomQuestion() {
    if (questions.length === 0) {
        resetQuestions();  // 질문이 모두 소모되었을 경우, 다시 초기화합니다.
    }
    
    currentQuestion = questions.pop(); 
    
    document.getElementById("question").innerText = currentQuestion.question;
    document.getElementById("hint").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';
    document.getElementById("answer-input").value = '';
    document.getElementById("feedback").innerText = '';
    document.getElementById("answer-input").focus(); 
    showAnswerClicked = false; // 새로운 질문으로 넘어갈 때 Show Answer 상태를 초기화
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
    showAnswerClicked = true; // Show Answer 버튼이 클릭되었음을 표시
    resetStreak(); 
}

function selectCategory() {
    selectedCategory = document.getElementById('category').value;
    updateHighestScoreDisplay(); 
    resetQuestions(); 
    checkAllTimeHighestStreak(); // 카테고리 변경 시 상태 확인
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

function resetAllData() {
    localStorage.clear(); // 로컬 스토리지 전체 초기화
    location.reload(); // 페이지 새로고침
}

function confirmReset() {
    const confirmation = confirm("정말 초기화 하겠습니까?");
    if (confirmation) {
        resetAllData(); // '네' 선택 시 초기화
    }
}
