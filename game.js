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
  const { type, dominant, label, description, image } = getResultType();

  // Lower background music
  const bgm = document.getElementById("bgm");
  if (bgm) bgm.volume = 0.;

  // Play trait sound (still based on dominant for simplicity)
  const traitSound = document.getElementById(`sound-${dominant}`);
  if (traitSound) {
    traitSound.currentTime = 0;
    traitSound.play();
  }

  // Update modal
  document.querySelector('#result-modal h2').textContent = `YOU ARE... ${label.toUpperCase()}`;
  document.getElementById('meme-image').src = image;
  document.getElementById('class-description').textContent = description;

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

function getResultType() {
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [first, second, third] = sorted;
  const diff1 = first[1] - second[1];

  const images = {
    flame: 'assets/memes/flame.png',
    mirror: 'assets/memes/mirror.png',
    grinder: 'assets/memes/grinder.png',
    'flame+mirror': 'assets/memes/flame-mirror.png',
    'flame+grinder': 'assets/memes/flame-grinder.png',
    'mirror+grinder': 'assets/memes/mirror-grinder.png',
    'flame+grinder+mirror': 'assets/memes/triad.png'
  };

  const comboDescriptions = {
    'flame+mirror': {
      label: 'Flame x Mirror',
      description: 'Chaotic introspection. You light fires and analyze the sparks.'
    },
    'flame+grinder': {
      label: 'Flame x Grinder',
      description: 'Hustle with heat. You burn bright and never stop.'
    },
    'mirror+grinder': {
      label: 'Mirror x Grinder',
      description: 'Intense introspection with a to-do list. Self-aware overachiever.'
    },
    'flame+grinder+mirror': {
      label: 'The Triad',
      description: 'You defy classification. A little bit of everything. Chaos incarnate.'
    }
  };

  const pureDescriptions = {
    flame: 'Too hot to hold. Born to go viral. Burnout is a feature, not a bug.',
    mirror: 'Self-aware, main-character-coded. Doesn’t blink. Loves introspection.',
    grinder: 'Can’t stop won’t stop. Eats chaos for breakfast. Glory is the grind.'
  };

  // Detect triad case
  if (first[1] === second[1] && second[1] === third[1]) {
    return {
      type: 'combo',
      dominant: first[0],
      ...comboDescriptions['flame+grinder+mirror'],
      image: images['flame+grinder+mirror']
    };
  }

  if (diff1 >= 3) {
    return {
      type: 'pure',
      dominant: first[0],
      label: first[0],
      description: pureDescriptions[first[0]],
      image: images[first[0]]
    };
  } else {
    const comboKey = [first[0], second[0]].sort().join('+');
    const combo = comboDescriptions[comboKey] || comboDescriptions['flame+grinder+mirror'];
    return {
      type: 'combo',
      dominant: first[0],
      ...combo,
      image: images[comboKey] || images['flame+grinder+mirror']
    };
  }
}

function playClickSound() {
  const click = document.getElementById("sound-click");
  if (click) {
    click.currentTime = 0;
    click.play();
  }
}
