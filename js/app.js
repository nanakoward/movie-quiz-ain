const questions = [
    "What is the first film in the Marvel Cinematic Universe?",
    "Who directed 'Inception'?",
    "What year was the first Academy Awards ceremony held?",
    "Name a famous silent film actor.",
    "What is film noir?"
];

// function getRandomQuestion() {
//     const randomIndex = Math.floor(Math.random() * questions.length);
//     document.getElementById("question").innerText = questions[randomIndex];
// }

function getRandomQuestion() {
    const category = document.getElementById('category').value;
    let filteredQuestions = questions;

    if (category !== 'all') {
        filteredQuestions = questions.filter(q => q.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const newQuestion = filteredQuestions[randomIndex].question;
    document.getElementById("question").innerText = newQuestion;
}


function saveResult(isCorrect) {
    let score = localStorage.getItem('score') || 0;
    let totalQuestions = localStorage.getItem('totalQuestions') || 0;

    totalQuestions++;
    if (isCorrect) {
        score++;
    }

    localStorage.setItem('score', score);
    localStorage.setItem('totalQuestions', totalQuestions);
    updateStats();
}

function updateStats() {
    const score = localStorage.getItem('score') || 0;
    const totalQuestions = localStorage.getItem('totalQuestions') || 0;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    document.getElementById('stats').innerText = `Correct: ${score}, Total: ${totalQuestions}, Accuracy: ${percentage.toFixed(2)}%`;
}
