const video = document.getElementById('videoPlayer');
const SeekOY = document.getElementById('blackO');
const videoWrap = document.getElementById('video-container');
const seek = document.getElementById('seek');
const seekPoint = document.querySelector('.seek-point');
const seekProgress = document.querySelector('.seek-progress');
const seekOverlay = document.querySelector('.seek-overlay'); // Original overlay
const seekBarOverlay = document.querySelector('.seek-bar-overlay'); // New overlay for seeking
const videoOverlay = document.querySelector('.video-overlay'); // Video hover overlay
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
// Select the .video-placeholder element
const videoPlaceholder = document.querySelector('.video-placeholder');

let seekTimeout;
let isSeeking = false; // Track if seeking is in progress

// Initialize the seek bar's max value and hide the placeholder after a delay of 500ms and fade out once the video is loaded
video.addEventListener('loadeddata', () => { // Use 'loadeddata' to ensure the video content is fully loaded
  seek.max = video.duration;

  // Hide the video placeholder after 500ms delay with a fade-out effect
  if (videoPlaceholder) {
    setTimeout(() => {
      videoPlaceholder.style.opacity = '0'; // Trigger the fade-out effect
    }, 200); // 500ms delay before starting the fade-out
  }
});

// Initialize the seek bar's max value once the video metadata is loaded
video.addEventListener('loadedmetadata', () => {
  seek.max = video.duration;
});

// Update the seek bar progress and position the seek point as the video plays
video.addEventListener('timeupdate', () => {
  seek.value = video.currentTime;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`; // Center the seek point
});

// Handle seeking by updating the video time when the user interacts with the seek bar
seek.addEventListener('input', () => {
  isSeeking = true; // Set seeking to true
  video.currentTime = seek.value;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`;

  // Show the seek-bar overlay while seeking
  seekBarOverlay.style.opacity = 1;
  seekOverlay.style.opacity = 0; // Hide the original overlay during seeking
  
  clearTimeout(seekTimeout); // Clear the previous timeout for hiding overlay
  seekTimeout = setTimeout(() => {
    // After seeking finishes, check if the video is paused
    if (video.paused) {
      seekOverlay.style.opacity = 1; // Show the original overlay if paused
      seekBarOverlay.style.opacity = 0; // Hide the seek-bar overlay
    }
  }, 1000); // Hide the seek-bar overlay after 1 second of inactivity
});

// Play/Pause functionality with the playPauseBtn
playPauseBtn.addEventListener('click', () => {
  // Add the Pop animation class
  playPauseBtn.classList.add('pop-animation');
  
  // Remove the animation class after it completes (0.3s here, matching the animation duration)
  setTimeout(() => {
    playPauseBtn.classList.remove('pop-animation');
  }, 300);
});


// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill'); // Change to pause icon
    seekOverlay.style.opacity = 0; // Hide overlay when playing
  } else {
    video.pause();
    playPauseIcon.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill'); // Change to play icon
    seekOverlay.style.opacity = 1; // Show overlay when paused
  }
});

// Show overlay when the video is paused
video.addEventListener('pause', () => {
  seekOverlay.style.opacity = 1; // Show the original overlay when video is paused
  seekBarOverlay.style.opacity = 0; // Hide the seek-bar overlay when paused
});

// Hide overlay when the video is playing
video.addEventListener('play', () => {
  seekOverlay.style.opacity = 0; // Hide the original overlay when video is playing
  seekBarOverlay.style.opacity = 0; // Hide the seek-bar overlay when playing
});

// Ensure overlay and play button are visible when the page first loads
window.addEventListener('load', () => {
  if (video.paused) {
    seekOverlay.style.opacity = 1; // Ensure the original overlay is visible on page load if video is paused
    playPauseIcon.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill'); // Set play icon initially
  }
});
// Trigger overlay every time the mouse hovers over the video
SeekOY.addEventListener('touchstart', () => {
  // Change opacity to 1 immediately
  seekOverlay.style.opacity = 1;

  // Reset opacity to 0 after 1 second (1000 milliseconds)
  setTimeout(() => {
    seekOverlay.style.opacity = 0; // Reset to default opacity
  }, 1000); // 1 second delay
});

// Hide overlay every time the mouse goes out the video
videoWrap.addEventListener('touchend', () => {
  // Toggle opacity between 1 and 0 on each touch
  if (seekOverlay.style.opacity === '1') {
    seekOverlay.style.opacity = 0; // Reset to 0
  } else {
    seekOverlay.style.opacity = 1; // Change to 1
  }
});

// Select the video wrapper element
const videoWrapper = document.querySelector('.video-wrapper');

// Initialize the Intersection Observer to trigger when 10% of the element is visible in the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add the 'visible' class when the element enters the viewport
      entry.target.classList.add('visible');
    } else {
      // Remove the 'visible' class when the element leaves the viewport
      entry.target.classList.remove('visible');
    }
  });
}, {
  root: null,           // Observe relative to the viewport
  rootMargin: '-25% 0px', // No margin around the root (viewport)
  threshold: 0        // Trigger when 10% of the element is visible
});

// Observe the .video-wrapper
if (videoWrapper) {
  observer.observe(videoWrapper);
}