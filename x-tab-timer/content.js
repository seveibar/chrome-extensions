function createTimer() {
  const timerContainer = document.createElement('div');
  timerContainer.id = 'x-timer-container';
  document.body.appendChild(timerContainer);

  let timeLeft = 15;
  
  const updateTimer = () => {
    timerContainer.textContent = `Click to add 10s | Closing in: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      document.body.innerHTML = '';
      window.location.href = 'https://github.com/orgs/tscircuit/repositories';
    }
    
    timeLeft--;
  };

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  // Add time when clicked
  timerContainer.addEventListener('click', () => {
    timeLeft += 10;
    updateTimer();
  });
  
  // Cleanup if user navigates away
  window.addEventListener('beforeunload', () => {
    clearInterval(timerInterval);
  });
}

// Start timer when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createTimer);
} else {
  createTimer();
}
