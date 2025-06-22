function toggleCredits(show) {
  const modal = document.getElementById('modal');
  if (show) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

// Unmute audio on first user interaction (required by most browsers)
document.body.addEventListener("click", () => {
  const bgm = document.getElementById("bgm");
  if (bgm) {
    bgm.muted = false;
    bgm.volume = 0.5;
    bgm.play().catch(console.error);
  }
}, { once: true });

function shareResult() {
  const dominant = getDominantTrait();
  const shareText = `I'm a ${dominant.toUpperCase()} in CORE CHAOS! 🔥🪞💪 Try it now!`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: 'CORE CHAOS',
      text: shareText,
      url
    }).catch(console.error);
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + " " + url)}`, '_blank');
  }
}

function toggleResult(show) {
  const modal = document.getElementById('result-modal');
  modal.classList.toggle('hidden', !show);

  if (!show) {
    // Stop trait sounds
    ['sound-flame', 'sound-mirror', 'sound-grinder'].forEach(id => {
      const audio = document.getElementById(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Restart BGM
    const bgm = document.getElementById('bgm');
    if (bgm) {
      bgm.volume = 0.5;
      bgm.currentTime = 0;
      bgm.play().catch(console.error);
    }

    // Reset game state
    currentQuestionIndex = 0;
    score = { flame: 0, mirror: 0, grinder: 0 };
    questions = [];

    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('main-menu').style.display = 'block';
  }
}

