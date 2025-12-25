const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapHistory = document.getElementById('lapHistory');

let startTime = 0;
let elapsed = 0; // ms
let timerId = null;
let laps = [];

function formatTime(ms) {
  const total = Math.floor(ms);
  const centiseconds = Math.floor((total % 1000) / 10);
  const seconds = Math.floor(total / 1000) % 60;
  const minutes = Math.floor(total / 60000) % 60;
  const hours = Math.floor(total / 3600000);
  return [
    String(hours).padStart(2,'0'),
    String(minutes).padStart(2,'0'),
    String(seconds).padStart(2,'0')
  ].join(':') + '.' + String(centiseconds).padStart(2,'0');
}

function updateDisplay() {
  display.textContent = formatTime(elapsed);
}

function updateLapHistory() {
  if (laps.length === 0) {
    lapHistory.innerHTML = '<div class="empty-laps">No laps recorded</div>';
    return;
  }
  
  let html = '';
  for (let i = 0; i < laps.length; i++) {
    const lapTime = laps[i];
    const prevTime = i === 0 ? 0 : laps[i - 1];
    const lapDuration = lapTime - prevTime;
    
    html += `
      <div class="lap-item">
        <span class="lap-number">Lap ${i + 1}</span>
        <span class="lap-diff">${formatTime(lapDuration)}</span>
        <span class="lap-time">${formatTime(lapTime)}</span>
      </div>
    `;
  }
  lapHistory.innerHTML = html;
  // Auto scroll to bottom
  lapHistory.scrollTop = lapHistory.scrollHeight;
}

function start() {
  if (timerId) return;
  startTime = performance.now() - elapsed;
  timerId = setInterval(() => {
    elapsed = performance.now() - startTime;
    updateDisplay();
  }, 10);
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function stop() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  elapsed = performance.now() - startTime;
  updateDisplay();
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function reset() {
  stop();
  elapsed = 0;
  laps = [];
  updateDisplay();
  updateLapHistory();
  resetBtn.disabled = true;
  lapBtn.disabled = true;
}

function recordLap() {
  if (!timerId) return;
  laps.push(elapsed);
  updateLapHistory();
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (timerId) stop(); else start();
  } else if (e.key.toLowerCase() === 'r') {
    reset();
  } else if (e.key.toLowerCase() === 'l') {
    recordLap();
  }
});

updateDisplay();
updateLapHistory();
