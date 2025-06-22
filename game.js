let currentQuestionIndex = 0;
let score = { flame: 0, mirror: 0, grinder: 0 };
let questions = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('startButton').addEventListener('click', startGame);
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  const lang = navigator.language.slice(0, 2).toLowerCase();
  const supported = ['en', 'es', 'fr', 'de', 'pt'];
  const file = supported.includes(lang) ? lang : 'en';

  const path = `assets/questions/questions-${file}.json`;
  const fallbackPath = `assets/questions/questions-en.json`;

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Language file not found");
      return response.json();
    })
    .catch(() => {
      console.warn(`Falling back to English version`);
      return fetch(fallbackPath).then(res => res.json());
    })
    .then(data => {
      questions = shuffle(data).slice(0, 10); // Randomized full list
      currentQuestionIndex = 0;
      score = { flame: 0, mirror: 0, grinder: 0 };

      document.getElementById('main-menu').style.display = 'none';
      document.getElementById('question-box').classList.remove('hidden');
      showQuestion();
      updateScores();
    })
    .catch(err => console.error("Failed to load ANY question file:", err));
}

function showQuestion() {
  const qText = document.getElementById('question-text');
  const aContainer = document.getElementById('answer-container');
  const q = questions[currentQuestionIndex];

  qText.textContent = q.text;
  aContainer.innerHTML = '';

  const shuffledAnswers = shuffle([...q.answers]);

  shuffledAnswers.forEach(answer => {
    const btn = document.createElement('button');
    btn.className = 'answer-button';
    btn.textContent = answer.text;
    btn.onclick = () => handleAnswer(answer.type);
    aContainer.appendChild(btn);
  });
}

function handleAnswer(type) {
  playClickSound();
  score[type]++;
  currentQuestionIndex++;

  updateScores();

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    finishGame();
  }
}

function updateScores() {
  const total = currentQuestionIndex || 1;
  const flamePct = Math.round((score.flame / total) * 100);
  const mirrorPct = Math.round((score.mirror / total) * 100);
  const grinderPct = Math.round((score.grinder / total) * 100);

  document.querySelector('.flame-score').textContent = `${flamePct}%`;
  document.querySelector('.mirror-score').textContent = `${mirrorPct}%`;
  document.querySelector('.grinder-score').textContent = `${grinderPct}%`;
}

function finishGame() {
  const dominant = getDominantTrait();

  const bgm = document.getElementById("bgm");
  if (bgm) bgm.volume = 0.1;

  const traitSound = document.getElementById(`sound-${dominant}`);
  if (traitSound) {
    traitSound.currentTime = 0;
    traitSound.play();
  }

  const memeMap = {
    flame: 'assets/memes/flame.jpg',
    mirror: 'assets/memes/mirror.jpg',
    grinder: 'assets/memes/grinder.jpg'
  };

  const memeImg = document.getElementById('meme-image');
  memeImg.src = memeMap[dominant];

  toggleResult(true);
}

function getDominantTrait() {
  let max = -Infinity;
  let dominant = '';
  for (const type in score) {
    if (score[type] > max) {
      max = score[type];
      dominant = type;
    }
  }
  return dominant;
}

function playClickSound() {
  const click = document.getElementById("sound-click");
  if (click) {
    click.currentTime = 0;
    click.play();
  }
}
