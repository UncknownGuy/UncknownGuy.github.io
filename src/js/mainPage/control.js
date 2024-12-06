// General Video-Related Functionality
const video = document.getElementById('videoPlayer');
const SeekOY = document.getElementById('blackO');
const videoWrap = document.getElementById('video-container');
const seek = document.getElementById('seek');
const seekPoint = document.querySelector('.seek-point');
const seekProgress = document.querySelector('.seek-progress');
const seekOverlay = document.querySelector('.seek-overlay');
const seekBarOverlay = document.querySelector('.seek-bar-overlay');
const videoOverlay = document.querySelector('.video-overlay');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const videoPlaceholder = document.querySelector('.video-placeholder');
const resolutionSelect = document.getElementById('resolutionSelect');
const originalLog = console.log;

// Override console.log to hide caution when stream is found
console.log = function (message) {
  if (message === 'No available streams found.' || message.includes('is online!')) {
    document.querySelector('.caution').style.display = 'none';
    document.querySelector('.caution-wrapper').style.display = 'none';
  }
  originalLog.apply(console, arguments);
};

// Update the seek bar progress
video.addEventListener('timeupdate', () => {
  seek.value = video.currentTime;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`;
});

// Handle seeking
seek.addEventListener('input', () => {
  video.currentTime = seek.value;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`;
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
    seekOverlay.style.opacity = 0;
  } else {
    video.pause();
    playPauseIcon.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
    seekOverlay.style.opacity = 1;
  }
});

// Video events
video.addEventListener('pause', () => {
  seekOverlay.style.opacity = 1;
  seekBarOverlay.style.opacity = 0;
});

video.addEventListener('play', () => {
  seekOverlay.style.opacity = 0;
  seekBarOverlay.style.opacity = 0;
});

// Listen for changes to resolution dropdown
resolutionSelect.addEventListener('change', () => {
  const selectedLevel = parseInt(resolutionSelect.value, 10);
  if (!isNaN(selectedLevel) && hls) {
    hls.currentLevel = selectedLevel; // Switch to the selected resolution
  }
});

// Start loading streams on page load
window.addEventListener('load', () => {
  loadStream(); // Begin stream loading process
});

// Function to update the resolution dropdown and display the current resolution
function updateResolutionDropdown() {
  if (hls && hls.levels) {
    const currentResolution = hls.currentLevel;
    const currentLevel = hls.levels[currentResolution];
    if (currentLevel) {
      resolutionSelect.value = currentResolution; // Update dropdown with current resolution
    }
  }
}

// Updated to run with HLS.js initialization
function populateResolutions(levels) {
  const resolutionSelect = document.getElementById('resolutionSelect');
  resolutionSelect.innerHTML = ''; // Clear existing options

  levels.forEach((level, index) => {
    const option = document.createElement('option');
    option.value = index;

    // Convert height to p format (e.g., 720p)
    const resolutionText = `${level.height}ㅤ-ㅤ${level.bitrate / 1000} kbps`;
    option.text = resolutionText;

    resolutionSelect.appendChild(option);
  });

  // Set the initial selected resolution based on current level
  updateResolutionDropdown(); // Ensure it displays the current resolution when loaded
}

// Function to reveal the player after the stream is loaded
function revealPlayer(streamName) {
  console.log(`${streamName} is now playing.`);
  video.addEventListener('loadeddata', () => {
    seek.max = video.duration;
    if (videoPlaceholder) {
      setTimeout(() => {
        videoPlaceholder.style.opacity = '0';
      }, 200);
    }
    videoWrap.style.display = 'block';
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
      videoWrapper.classList.add('visible');
      videoWrapper.style.display = 'block';
    }
  });
}
