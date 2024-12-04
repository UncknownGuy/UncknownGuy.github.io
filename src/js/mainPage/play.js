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
const videoPlaceholder = document.querySelector('.video-placeholder');

let hls;
let currentStreamIndex = 0; // Start with the first stream in the array

// Function to load and try playing the stream
async function loadStream() {
  const streams = await window.m3u8.getStreams(); // Get stream data from m3u8.js

  // Check if we have streams left to try
  if (currentStreamIndex >= streams.length) {
    alert('Currently No Available Camshows.');
    return;
  }

  const stream = streams[currentStreamIndex];

  // Try loading the stream URL with a HEAD request to check availability
  fetch(stream.url, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // Stream is available, proceed to play
        console.log(`${stream.name} is online!`);
        playStream(stream.url, stream.name);
      } else {
        // If the stream is not available, move to the next one
        console.log(`${stream.name} is offline. Skipping to next stream...`);
        currentStreamIndex++;
        loadStream();
      }
    })
    .catch(error => {
      // If fetch fails (network error, etc.), skip to the next stream
      console.log(`${stream.name} is offline or unreachable. Skipping to next stream...`);
      currentStreamIndex++;
      loadStream();
    });
}

// Function to play the stream
function playStream(url, streamName) {
  if (Hls.isSupported()) {
    // Initialize HLS.js
    hls = new Hls();
    
    // Load the HLS stream URL
    hls.loadSource(url);
    hls.attachMedia(video);

    // Play the video once the stream is loaded
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
      revealPlayer(streamName); // Call the function to reveal the player
    });

    // Error handling for HLS.js
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.error('HLS.js error:', data);

        if (data.fatal === Hls.ErrorTypes.NETWORK_ERROR || data.fatal === Hls.ErrorTypes.MEDIA_ERROR) {
          console.error('Stream error, attempting next stream...');
        }

        // Move to the next stream if error occurs
        currentStreamIndex++;
        loadStream();
      }
    });
  } else {
    // Fallback if the browser supports HLS natively (Safari)
    video.src = url;
    video.play();
    revealPlayer(streamName); // Call the function to reveal the player
  }
}

// Function to reveal the player after the stream is loaded
function revealPlayer(streamName) {
  console.log(`${streamName} is now playing.`);

  // Use the 'loadeddata' event to ensure video data is loaded
  video.addEventListener('loadeddata', () => {
    // Initialize the seek bar's max value
    seek.max = video.duration;

    // Hide the video placeholder after a delay with a fade-out effect
    if (videoPlaceholder) {
      setTimeout(() => {
        videoPlaceholder.style.opacity = '0'; // Trigger the fade-out effect
      }, 200); // 200ms delay before starting the fade-out
    }

    // Reveal the video player container
    videoWrap.style.display = 'block';  // Ensure the video container is visible

    // If the videoWrapper exists, add the 'visible' class to it
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
      videoWrapper.classList.add('visible');
      videoWrapper.style.display = 'block'; // Ensure it's visible
    }
  });
}

// Update the seek bar progress and position the seek point as the video plays
video.addEventListener('timeupdate', () => {
  seek.value = video.currentTime;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`; // Center the seek point
});

// Handle seeking by updating the video time when the user interacts with the seek bar
seek.addEventListener('input', () => {
  video.currentTime = seek.value;
  seekProgress.style.width = `${(video.currentTime / video.duration) * 100}%`;
  seekPoint.style.left = `calc(${(video.currentTime / video.duration) * 100}% - 5px)`;
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

// Start loading streams when the page is loaded
window.addEventListener('load', () => {
  loadStream(); // Begin stream loading process
});
