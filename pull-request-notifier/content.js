let lastCheckStatus = null;

// Create and inject the status indicator
function createStatusIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'gh-checks-indicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    z-index: 9999;
  `;
  document.body.appendChild(indicator);
  return indicator;
}

function updateStatusIndicator(status) {
  let indicator = document.getElementById('gh-checks-indicator');
  if (!indicator) {
    indicator = createStatusIndicator();
  }

  if (!status) {
    indicator.textContent = 'Monitoring checks...';
    indicator.style.color = '#6a737d';
    return;
  }

  if (status === 'success') {
    indicator.textContent = 'Passing';
    indicator.style.color = '#28a745';
  } else if (status === 'failed') {
    indicator.textContent = 'Failing';
    indicator.style.color = '#cb2431';
  }
}

function getChecksStatus() {
  const checksContainer = document.querySelector('.merge-status-list');
  if (!checksContainer) return null;

  const allChecks = Array.from(checksContainer.querySelectorAll('.merge-status-item'));
  if (allChecks.length === 0) return null;

  // Check if all items have completed (no pending states)
  const isPending = allChecks.some(check => 
    check.classList.contains('pending') || 
    check.classList.contains('expected')
  );
  
  if (isPending) return null;

  // Check if any checks failed
  const hasFailed = allChecks.some(check => 
    check.classList.contains('failed') || 
    check.classList.contains('error')
  );

  return hasFailed ? 'failed' : 'success';
}

function playSound(type) {
  const audio = new Audio(chrome.runtime.getURL(`${type}.mp3`));
  audio.play();
}

function checkAndNotify() {
  const currentStatus = getChecksStatus();
  updateStatusIndicator(currentStatus);
  
  if (currentStatus && currentStatus !== lastCheckStatus) {
    playSound(currentStatus);
    lastCheckStatus = currentStatus;
  }
}

// Initialize status indicator
createStatusIndicator();

// Check status every 5 seconds
setInterval(checkAndNotify, 5000);

// Handle page navigation and content changes
const observer = new MutationObserver(() => {
  if (window.location.pathname.includes('/pull/')) {
    checkAndNotify();
  } else {
    // Hide indicator if not on a PR page
    const indicator = document.getElementById('gh-checks-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Show/hide indicator based on URL when first loading
if (!window.location.pathname.includes('/pull/')) {
  const indicator = document.getElementById('gh-checks-indicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
}
