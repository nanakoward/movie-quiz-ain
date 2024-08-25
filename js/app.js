let originalQuestions = []; // 초기 질문 데이터를 저장하는 배열
let questions = []; // JSON 데이터를 로드하여 저장할 변수
let currentQuestion = null;
let highestScores = {}; // 카테고리별 현재 최고 점수 저장 객체
let allTimeHighestScores = {}; // 카테고리별 가장 높았던 최고 점수 저장 객체
let currentStreak = {}; // 카테고리별 현재 연속 정답 수를 저장하는 객체
let showAnswerUsed = false; // Show Answer 버튼 사용 여부
let selectedCategory = 'all_categories'; // 기본 선택 카테고리
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
    // questions.json을 가장 먼저 불러옵니다.
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            originalQuestions = [];

            // 각 질문의 category에 "All Categories"를 추가
            data.forEach(item => {
                if (!Array.isArray(item.category)) {
                    // category가 문자열이면 배열로 변환하고 "All Categories" 추가
                    item.category = [item.category, "all_categories"];
                } else {
                    // category가 이미 배열이면 "All Categories"를 추가
                    if (!item.category.includes("all_categories")) {
                        item.category.push("all_categories");
                    }
                }

                originalQuestions.push(item);
            });

                       // 기존에 저장된 최고 점수 데이터 로드
           highestScores = getHighestScores();
           allTimeHighestScores = getAllTimeHighestScores();

            // 기본 카테고리를 'all_categories'로 설정
            selectedCategory = 'all_categories'; 



            // 관련된 초기 작업들 실행
            updateHighestScoreDisplay(); // 최고 점수 표시
            resetQuestions(); // 카테고리에 맞는 질문들로 초기화
            
            // 최고 연속 정답 수와 전체 질문 개수를 비교하여 처리
            const totalQuestionsInCategory = originalQuestions.filter(q => q.category.includes(selectedCategory)).length;
            const currentAllTimeHighestStreak = allTimeHighestScores[selectedCategory] || 0;

            if (currentAllTimeHighestStreak < totalQuestionsInCategory) {
                enableAnswerInputs(); // 최고 연속 정답 수가 질문 개수보다 작을 때만 입력창과 제출 버튼 활성화
            } else {
                checkAllTimeHighestStreak(); // 최고 연속 정답 수가 질문 개수와 같을 때만 실행
            }

            getRandomQuestion(); // 질문을 하나 선택하여 표시

            // 닉네임이 저장되지 않은 경우 닉네임 팝업 표시
            nickname = getNickname();
            if (!nickname) {
                document.getElementById('nickname-popup').style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error loading questions:", error);
        });

    // 닉네임 입력 및 설정 관련 이벤트 핸들러 설정
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




// function updateAllCategoriesCount() {
//     const totalQuestions = originalQuestions.length; // 모든 카테고리의 질문 개수를 합산
//     const allCategoriesOption = document.querySelector('option[value="all"]'); // 'All Categories' 옵션 선택
//     allCategoriesOption.textContent = `All Categories (${totalQuestions} questions)`; // 텍스트 업데이트
// }

function checkAllTimeHighestStreak() {
    const totalQuestionsInCategory = originalQuestions.filter(q => q.category.includes(selectedCategory)).length;
    const currentAllTimeHighestStreak = allTimeHighestScores[selectedCategory] || 0;

    if (currentAllTimeHighestStreak >= totalQuestionsInCategory) {
        disableAnswerInputs(); // 질문 개수와 동일하거나 큰 경우 비활성화
    } else {
        enableAnswerInputs(); // 질문 개수보다 작은 경우 활성화
    }
}


// 답변 입력창 및 버튼을 활성화하는 함수
function enableAnswerInputs() {
    const answerButton = document.getElementById("submit-answer-button"); // checkAnswer()가 연결된 버튼
    const answerInput = document.getElementById("answer-input"); // 답변 입력창

    answerButton.disabled = false; // 버튼 활성화
    answerButton.classList.remove("disabled-button"); // 비활성화 스타일 제거

    answerInput.disabled = false; // 입력창 활성화
    answerInput.classList.remove("disabled-input"); // 비활성화 스타일 제거

    answerInput.value = ''; // 기존에 표시된 마스터 메시지를 초기화
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


    function resetQuestions() {
        // selectedCategory에 포함된 질문들만 걸러냅니다.
        questions = originalQuestions.filter(q => q.category.includes(selectedCategory));
        shuffleQuestions(); 
    }
    

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// function getRandomQuestion() {
//     if (questions.length === 0) {
//     document.getElementById("question").innerText = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
//        return;
//     }
    
//     currentQuestion = questions.pop(); 
    
//     document.getElementById("question").innerText = currentQuestion.question;
//     document.getElementById("hint").style.display = 'none';
//     document.getElementById("correct-answer").style.display = 'none';
//     document.getElementById("answer-input").value = '';
//     document.getElementById("feedback").innerText = '';

//         const imageElement = document.getElementById("question-image");
// if (currentQuestion.image_url) {
//     console.log("Image URL:", currentQuestion.image_url); // URL 확인을 위해 콘솔에 출력
//     imageElement.src = currentQuestion.image_url;
//     imageElement.style.display = 'block';
// } else {
//     imageElement.style.display = 'none';
// }
//     document.getElementById("answer-input").focus(); 
//     showAnswerUsed = false; 
// }

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
    
    const imageElement = document.getElementById("question-image");
    if (currentQuestion.image_url) {
        console.log("Image URL:", currentQuestion.image_url); // URL 확인을 위해 콘솔에 출력
        imageElement.src = currentQuestion.image_url;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
    
    document.getElementById("answer-input").focus(); 
    showAnswerUsed = false; 
}


// 정답을 제출하는 함수
function checkAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    document.getElementById("show-answer-btn").style.display = 'none';
    document.getElementById("correct-answer").style.display = 'none';

    if (userAnswer === correctAnswer && !showAnswerClicked) {
        // 카테고리별로 currentStreak 관리
        if (!currentStreak[selectedCategory]) {
            currentStreak[selectedCategory] = 0;
        }

        currentStreak[selectedCategory]++;
        document.getElementById("feedback").innerText = `${nickname}, 정답!`;
        document.getElementById("feedback").className = "correct";

        highestScores[selectedCategory] = currentStreak[selectedCategory];
// highestScores와 allTimeHighestScores 업데이트
if (currentStreak[selectedCategory] > (allTimeHighestScores[selectedCategory] || 0)) {
    allTimeHighestScores[selectedCategory] = currentStreak[selectedCategory];
    saveAllTimeHighestScores(allTimeHighestScores); // 업데이트된 allTimeHighestScores 저장
}

saveHighestScores(highestScores); // 업데이트된 highestScores 저장
updateHighestScoreDisplay();

checkAllTimeHighestStreak(); // 정답 제출 후 checkAllTimeHighestStreak 실행

// 모든 질문에 대해 정답을 맞춘 경우 입력창을 비활성화
if (allTimeHighestScores[selectedCategory] >= originalQuestions.filter(q => q.category.includes(selectedCategory)).length) {
    disableAnswerInputs(); // 질문 개수와 동일하거나 큰 경우 비활성화
    return;
}

// 정답 피드백 후 새로운 질문으로 이동
setTimeout(() => {
    document.getElementById("feedback").innerText = "";
    document.getElementById("feedback").className = "";
    getRandomQuestion();
}, 1000);
} else {
//오답 처리

document.getElementById("feedback").innerText = `${nickname}, 까비..`;
document.getElementById("feedback").className = "incorrect";

resetStreak(); // 연속 정답 수 초기화
resetQuestions();
updateHighestScoreDisplay();

setTimeout(() => {
    document.getElementById("feedback").innerText = "";
    document.getElementById("feedback").className = "";
    getRandomQuestion();
}, 1000);
}

answerInput.value = ''; // 입력창 초기화
answerInput.focus(); // 입력창에 포커스
}
       

// 버튼 비활성화 및 스타일 변경 함수
function disableAnswerInputs() {
    const answerButton = document.getElementById("submit-answer-button"); // checkAnswer()가 연결된 버튼
    const answerInput = document.getElementById("answer-input"); // 답변 입력창

    answerButton.disabled = true; // 버튼 비활성화
    answerButton.classList.add("disabled-button"); // 비활성화 스타일 추가

    answerInput.disabled = true; // 입력창 비활성화
    answerInput.classList.add("disabled-input"); // 비활성화 스타일 추가

    answerInput.value = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
}

// 연속 정답 수를 초기화하는 함수
function resetStreak() {
    currentStreak[selectedCategory] = 0; // 현재 선택된 카테고리의 연속 정답 수 초기화
    highestScores[selectedCategory] = 0;
    saveHighestScores(highestScores); // 초기화된 값 저장
    updateHighestScoreDisplay();
}

function updateHighestScoreDisplay() {
    document.getElementById("all-time-highest-score").innerText = `All-Time ${selectedCategory} Highest Streak: ${allTimeHighestScores[selectedCategory] || 0}`;
    document.getElementById("highest-score").innerText = `${selectedCategory} Highest Streak: ${highestScores[selectedCategory] || 0}`;
}

// 카테고리를 변경하는 함수
function selectCategory() {
    selectedCategory = document.getElementById('category').value;
    updateHighestScoreDisplay();
    resetQuestions();

    // 선택된 카테고리의 All-Time Highest Streak가 해당 카테고리의 질문 개수 이상인지 확인
    const totalQuestionsInCategory = originalQuestions.filter(q => q.category.includes(selectedCategory)).length;
    const currentAllTimeHighestStreak = allTimeHighestScores[selectedCategory] || 0;

    if (currentAllTimeHighestStreak >= totalQuestionsInCategory) {
        disableAnswerInputs(); // 질문 개수와 동일하거나 큰 경우 비활성화
    } else {
        enableAnswerInputs(); // 질문 개수보다 작은 경우 활성화
        getRandomQuestion();
    }
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

    answerInput.value = `당신은 ${selectedCategory}의 마스터 짱짱맨 짱짱걸 당신은 미쳤어!`;
}



function updateAllTimeHighestScores(category, score) {
    if (score > (allTimeHighestScores[category] || 0)) {
        allTimeHighestScores[category] = score;
        saveAllTimeHighestScores(allTimeHighestScores);
    }
}

// 최고 점수 표시를 업데이트하는 함수
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
    document.getElementById("show-answer-btn").style.display = 'none'; // Show Answer 버튼을 숨김
}

// 선택한 카테고리를 변경하는 함수
function selectCategory() {
    selectedCategory = document.getElementById('category').value; // 선택된 카테고리로 설정
    updateHighestScoreDisplay(); // 새로운 카테고리의 최고 점수 표시
    resetQuestions(); // 새로운 카테고리에 맞는 질문들로 초기화

    // 선택된 카테고리의 All-Time Highest Streak가 해당 카테고리의 질문 개수 이상인지 확인
    const totalQuestionsInCategory = originalQuestions.filter(q => q.category.includes(selectedCategory)).length;
    const currentAllTimeHighestStreak = allTimeHighestScores[selectedCategory] || 0;

    if (currentAllTimeHighestStreak >= totalQuestionsInCategory) {
        disableAnswerInputs(); // 질문 개수와 동일하거나 큰 경우 비활성화
    } else {
        enableAnswerInputs(); // 질문 개수보다 작은 경우 활성화
        getRandomQuestion(); // 새 카테고리에서 질문을 하나 선택하여 표시
    }
}


let isRefreshing = false;

function handleTouchStart(event) {
    isRefreshing = window.scrollY === 0; // 스크롤 위치가 맨 위에 있을 때만 새로고침 가능
}

function handleTouchMove(event) {
    if (isRefreshing) {
        const refreshIndicator = document.getElementById('refresh-indicator');
        if (window.scrollY > 5) { // 더 짧은 거리에서 새로고침을 트리거
            refreshIndicator.style.display = 'block';
        }
    }
}


function handleTouchEnd(event) {
    const refreshIndicator = document.getElementById('refresh-indicator');
    if (isRefreshing && window.scrollY > 5) { // 더 짧은 거리에서 새로고침을 트리거
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

// 연속 정답 수를 초기화하는 함수
function resetStreak() {
    currentStreak[selectedCategory] = 0; // 현재 선택된 카테고리의 연속 정답 수 초기화
    highestScores[selectedCategory] = 0;
    saveHighestScores(highestScores); // 초기화된 값 저장
    updateHighestScoreDisplay();
}


function updateHighestScoreDisplay() {
    document.getElementById("all-time-highest-score").innerText = `All-Time ${selectedCategory} 최고기록 : ${allTimeHighestScores[selectedCategory] || 0}`;
    document.getElementById("highest-score").innerText = `${selectedCategory} Highest Streak: ${highestScores[selectedCategory] || 0}`;
}

function closeApp() {
    alert("나가는 기능 안됨ㅠㅠ 그냥 홈버튼 눌러서 앱 끄면 됩니다");
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