const questions = [
    "What is the first film in the Marvel Cinematic Universe?",
    "Who directed 'Inception'?",
    "What year was the first Academy Awards ceremony held?",
    "Name a famous silent film actor.",
    "What is film noir?"
];

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    document.getElementById("question").innerText = questions[randomIndex];
}
