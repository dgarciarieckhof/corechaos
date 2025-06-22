function startGame() {
  alert("Game starting soon!");
}

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
  bgm.muted = false;
  bgm.volume = 0.5;
}, { once: true });