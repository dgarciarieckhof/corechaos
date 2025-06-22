function toggleCredits(show) {
  const modal = document.getElementById('modal');
  modal.classList.toggle('hidden', !show);
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
  const image = document.getElementById('meme-image');
  const description = document.getElementById('class-description').textContent;
  let rawLabel = document.querySelector('#result-modal h2').textContent;
  let label = rawLabel.replace("YOU ARE...", "").trim();

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height + 100;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = "#FF00FF";
  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.fillText(label.toUpperCase(), 10, image.height + 25);
  ctx.fillText(description.slice(0, 40) + "...", 10, image.height + 50);
  ctx.fillText("corechaos.io", 10, image.height + 75);

  canvas.toBlob(blob => {
    const file = new File([blob], 'meme.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: label,
        text: "Check your chaos class at corechaos.io"
      });
    } else {
      alert("Sharing not supported. We'll download the image instead.");
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'meme.png';
      a.click();
    }
  });
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

document.getElementById('shareButton').addEventListener('click', shareResult);