// Elscaped time tracking

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hls-video');
    const timeDisplay = document.getElementById('usage-time');
    const resetButton = document.getElementById('reset-time');
    let startTime;
    let elapsed = 0;
    let intervalId;

    // Load saved time from localStorage
    function loadElapsedTime() {
        const savedTime = localStorage.getItem('elapsedTime');
        if (savedTime) {
            elapsed = parseInt(savedTime, 10);
            updateTimeDisplay();
        }
    }

    // Save elapsed time to localStorage
    function saveElapsedTime() {
        localStorage.setItem('elapsedTime', elapsed);
    }

    // Reset elapsed time
    function resetElapsedTime() {
        elapsed = 0;
        updateTimeDisplay();
        saveElapsedTime();
    }

    // Update time display
    function updateTimeDisplay() {
        const seconds = Math.floor(elapsed % 60);
        const minutes = Math.floor((elapsed / 60) % 60);
        const hours = Math.floor(elapsed / 3600);
        timeDisplay.textContent = `Time Elapsed: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Update elapsed time
    function updateElapsedTime() {
        const currentTime = Date.now();
        elapsed += Math.floor((currentTime - startTime) / 1000);
        startTime = currentTime;
        updateTimeDisplay();
        saveElapsedTime();
    }

    // Start or resume counting time
    function startCounting() {
        startTime = Date.now();
        intervalId = setInterval(updateElapsedTime, 1000);
    }

    // Stop counting time
    function stopCounting() {
        clearInterval(intervalId);
        saveElapsedTime();
    }

    // Reset button event listener
    resetButton.addEventListener('click', () => {
        // Add rotation animation class
        resetButton.classList.add('rotate-animation');

        // Remove the class after animation ends to allow re-animation on next click
        setTimeout(() => {
            resetButton.classList.remove('rotate-animation');
        }, 600); // Duration of the animation in milliseconds

        // Reset the elapsed time
        resetElapsedTime();
        if (video.paused) {
            updateTimeDisplay();
        } else {
            stopCounting();
            resetElapsedTime();
            startCounting();
        }
    });

    // Event listeners for video playback
    video.addEventListener('play', () => {
        startCounting();
    });

    video.addEventListener('pause', () => {
        stopCounting();
    });

    video.addEventListener('ended', () => {
        stopCounting();
    });

    // Load time on page load
    loadElapsedTime();
});
