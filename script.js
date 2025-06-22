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
  const imgTag = document.getElementById('meme-image');
  const description = document.getElementById('class-description').textContent;
  const rawLabel = document.querySelector('#result-modal h2').textContent;
  const label = rawLabel.replace('YOU ARE...', '').trim();
  const gameURL = 'thedatachronicles.com';

  const sprite = new Image();
  sprite.crossOrigin = 'anonymous';
  sprite.onload = () => {
    const canvasWidth = sprite.naturalWidth;
    const topBannerHeight = 140;
    const bottomPadding = 60;
    const lineHeight = 26;

    // Create canvas with extra height for text
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = canvasWidth;

    // Estimate wrapped lines
    ctx.font = "20px 'Press Start 2P', monospace";
    const descriptionLines = wrapTextLines(ctx, description, canvasWidth - 48);
    const textBlockHeight = descriptionLines.length * lineHeight;
    const totalHeight = topBannerHeight + sprite.naturalHeight + textBlockHeight + bottomPadding;
    ctx.canvas.height = totalHeight;

    // Draw top banner
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, topBannerHeight);

    // Label
    ctx.fillStyle = '#FF37F8';
    ctx.font = "28px 'Press Start 2P', monospace";
    ctx.fillText(label.toUpperCase(), 24, 20);

    // Description
    ctx.fillStyle = '#00F9FF';
    ctx.font = "20px 'Press Start 2P', monospace";
    descriptionLines.forEach((line, i) => {
      ctx.fillText(line, 24, 70 + i * lineHeight);
    });

    // Draw sprite
    ctx.drawImage(sprite, 0, topBannerHeight);

    // Draw footer URL
    ctx.fillStyle = '#FF37F8';
    ctx.font = "18px 'Press Start 2P', monospace";
    ctx.fillText(gameURL, 24, totalHeight - 30);

    // Convert to blob and share
    ctx.canvas.toBlob(blob => {
      const file = new File([blob], 'core-chaos-result.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: label,
          text: `${label} · ${description} · ${gameURL}`
        });
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'core-chaos-result.png';
        a.click();
      }
    });
  };
  sprite.src = imgTag.src;
}

// ⬇️ Helper: returns an array of lines that fit width
function wrapTextLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

function downloadImage() {
  getImageBlobWithText(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'core-chaos-result.png';
    a.click();
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

function getImageBlobWithText(callback) {
  const rawLabel = document.querySelector('#result-modal h2').textContent;
  const label = rawLabel.replace('YOU ARE...', '').trim();
  const description = document.getElementById('class-description').textContent;
  const imageSrc = document.getElementById('meme-image').src;

  const sprite = new Image();
  sprite.crossOrigin = 'anonymous';
  sprite.onload = () => {
    const canvasW = Math.max(sprite.naturalWidth, 600);
    const canvasH = sprite.naturalHeight;

    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = canvasW;
    ctx.canvas.height = canvasH;

    // Draw the base image
    ctx.drawImage(sprite, (canvasW - sprite.naturalWidth) / 2, 0);

    // Text styling
    const margin = 32;
    const lineHeight = 28;

    // Class name (top)
    ctx.fillStyle = '#FF37F8';
    ctx.font = "32px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(label.toUpperCase(), canvasW / 2, margin + 10);

    // Description (wrapped, top)
    ctx.font = "22px 'Press Start 2P', monospace";
    ctx.fillStyle = '#00F9FF';
    const descLines = wrapTextLines(ctx, description, canvasW - margin * 2);
    descLines.forEach((line, i) => {
      ctx.fillText(line, canvasW / 2, margin + 60 + i * lineHeight);
    });

    // Web link (bottom, on top of image)
    ctx.fillStyle = '#FF37F8';
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.fillText('thedatachronicles.com', canvasW / 2, canvasH - 20);

    // Export
    ctx.canvas.toBlob(callback);
  };

  sprite.src = imageSrc;
}

function shareToX() {
  getImageBlobWithText(blob => {
    const file = new File([blob], 'core-chaos-result.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'My Core Chaos Result',
        text: "I just found my CORE CHAOS class! 💥🔥 Try it now at https://dgarciarieckhof.github.io/corechaos/"
      }).catch(console.error);
    } else {
      // Fallback: open X share link
      const text = "I just found my CORE CHAOS class! 💥🔥 Try it now:";
      const url = "https://dgarciarieckhof.github.io/corechaos/";
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(tweetUrl, '_blank');
    }
  });
}

function shareToWhatsApp() {
  getImageBlobWithText(blob => {
    const file = new File([blob], 'core-chaos-result.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'My Core Chaos Result',
        text: "Check out my CORE CHAOS class! 💥🔥 https://dgarciarieckhof.github.io/corechaos/"
      }).catch(console.error);
    } else {
      // Fallback: open WhatsApp web with link
      const text = "Check out my CORE CHAOS class! 💥🔥 https://dgarciarieckhof.github.io/corechaos/";
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }
  });
}