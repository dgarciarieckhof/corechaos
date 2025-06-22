let currentQuestionIndex = 0;
let score = { flame: 0, mirror: 0, grinder: 0 };
let questions = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('assets/questions.json')
    .then(response => response.json())
    .then(data => {
      questions = shuffle(data).slice(0, 10);
      document.getElementById('startButton').addEventListener('click', startGame);
    })
    .catch(err => console.error("Failed to load questions:", err));
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('question-box').classList.remove('hidden');
  showQuestion();
  updateScores(); // init HUD
}

function showQuestion() {
  const qText = document.getElementById('question-text');
  const aContainer = document.getElementById('answer-container');
  const q = questions[currentQuestionIndex];

  qText.textContent = q.text;
  aContainer.innerHTML = '';

  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer-button';
    btn.textContent = answer.text;
    btn.onclick = () => handleAnswer(answer.type);
    aContainer.appendChild(btn);
  });
}

function handleAnswer(type) {
  score[type]++;
  currentQuestionIndex++;

  updateScores(); // Update visual scores in triangle HUD

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    finishGame();
  }
}

function updateScores() {
  const total = currentQuestionIndex || 1; // Avoid divide by 0

  const flamePct = Math.round((score.flame / total) * 100);
  const mirrorPct = Math.round((score.mirror / total) * 100);
  const grinderPct = Math.round((score.grinder / total) * 100);

  document.querySelector('.flame-score').textContent = `${flamePct}%`;
  document.querySelector('.mirror-score').textContent = `${mirrorPct}%`;
  document.querySelector('.grinder-score').textContent = `${grinderPct}%`;
}

function finishGame() {
  const qBox = document.getElementById('question-box');
  qBox.innerHTML = `
    <h2>RESULT</h2>
    <p>🔥 FLAME: ${score.flame * 10}%</p>
    <p>🪞 MIRROR: ${score.mirror * 10}%</p>
    <p>💪 GRINDER: ${score.grinder * 10}%</p>
  `;
}
