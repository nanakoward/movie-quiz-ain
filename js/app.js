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
    document.getElementById("reset-button").addEventListener("click", confirmReset); // 초기화 버튼 리스너 추가
});

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

function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (showAnswerUsed) {
        resetStreak();
    }

    // 정답이 맞든 틀리든 show-answer-btn과 correct-answer의 스타일을 display:none으로 설정
    document.getElementById("show-answer-btn").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';

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

        if (questions.length === 0) {
            // 모든 질문을 맞춘 경우 마스터 메시지 출력
            document.getElementById("question").innerText = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
            return;
        }

        setTimeout(() => {
            document.getElementById("feedback").innerText = "";
            document.getElementById("feedback").className = "";
            getRandomQuestion(); 
        }, 1000);
    } else {
        document.getElementById("feedback").innerText = `${nickname}, 까비..`;
        document.getElementById("feedback").className = "incorrect";
        resetStreak(); 
        
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
    showAnswerUsed = false; 
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
