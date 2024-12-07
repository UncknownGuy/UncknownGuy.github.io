// Initialize HLS.js when the page loads
let hls;
let currentStreamIndex = 0; // Start with the first stream in the array
const year = '2024©'; // Store the year as a string
let videoElement = document.getElementById('videoPlayer'); // Use ID videoPlayer for the video element
let bodyElement = document.body; // Target the full body for user interaction
const autoplayToggle = document.getElementById('autoplayToggle'); // Autoplay toggle element

// Function to load and try playing the stream
async function loadStream() {
  const streams = await window.m3u8.getStreams(); // Get stream data from m3u8.js

  if (currentStreamIndex >= streams.length) {
    console.log('No available streams found.');
    alert('No available streams found.');
    return;
  }

  const stream = streams[currentStreamIndex];
  const from = stream.from || '';
  let artwork = stream.artwork || 'https://uncknownguy.github.io/cloud/hosted/mainPage/anonymity512x.png';

  artwork = updateArtworkUrls(artwork);

  fetch(stream.url, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        console.log(`${stream.name} is online!`);
        playStream(stream.url, stream.name, from, artwork);
      } else {
        console.log(`${stream.name} is offline. Skipping to next stream...`);
        currentStreamIndex++;
        loadStream();
      }
    })
    .catch(error => {
      console.log(`${stream.name} is offline or unreachable. Skipping to next stream...`);
      currentStreamIndex++;
      loadStream();
    });
}

// Function to update artwork URL(s) based on current timestamp
function updateArtworkUrls(artworkUrl) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const regex = /(\d{10})(?=\/\d+_webp)/;
  return artworkUrl.replace(regex, currentTimestamp);
}

// Function to play the stream
function playStream(url, streamName, from, artwork) {
  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(videoElement);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${streamName}`,
        artist: `${from} ${year} camshow`,
        artwork: [{ src: artwork, sizes: '150x150', type: 'image/jpg' }]
      });
    }

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      // Populate the resolution selector once the manifest is parsed
      populateResolutions(data.levels);

      // Attempt to autoplay with sound or muted based on toggle state
      if (autoplayToggle.checked) {
        attemptAutoplayWithSound(); // Autoplay with sound if toggle is on
      } else {
        videoElement.pause(); // Pause if autoplay is off
        console.log("Autoplay is off. Video is paused.");
      }

      // Reveal the player after attempting autoplay
      revealPlayer(streamName);
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.error('HLS.js error:', data);
        currentStreamIndex++;
        loadStream();
      }
    });
  } else {
    videoElement.src = url;

    // Attempt to autoplay with sound if toggle is on
    if (autoplayToggle.checked) {
      attemptAutoplayWithSound();
    } else {
      videoElement.pause(); // Pause if autoplay is off
      console.log("Autoplay is off. Video is paused.");
    }

    revealPlayer(streamName);
  }
}

// Function to attempt autoplay with sound
function attemptAutoplayWithSound() {
  videoElement.play().then(() => {
    console.log("Autoplay with sound started.");
  }).catch((error) => {
    console.log("Autoplay with sound failed. Playing muted.");
    videoElement.muted = true;  // Ensure it is muted initially
    videoElement.play().then(() => {
      console.log("Autoplay started muted.");
    }).catch(err => {
      console.error("Failed to autoplay muted:", err);
    });

    // After autoplay attempt, set up the click event for unmuting
    setUserInteractionListener();
  });
}

// Function to set the listener for user interaction (click anywhere on the body)
function setUserInteractionListener() {
  bodyElement.addEventListener('click', function () {
    if (videoElement.paused) {
      videoElement.play().then(() => {
        console.log("Video resumed with sound.");
      }).catch((error) => {
        console.error('Failed to play video:', error);
      });
    }

    // Unmute the video after user interaction
    videoElement.muted = false;
    console.log("Unmuting video after user interaction.");
  }, { once: true });  // Ensure it only triggers once for the first click
}

// Function to reveal the video player (your reveal logic here)
function revealPlayer(streamName) {
  const videoWrapper = document.querySelector('.video-wrapper'); // Use your class to target the wrapper
  if (videoWrapper) {
    videoWrapper.style.display = 'block';
    console.log("Player revealed.");
  }
}

// Add event listener for the autoplay toggle to handle the state change
autoplayToggle.addEventListener('change', function () {
  if (!autoplayToggle.checked) {
    videoElement.pause(); // Pause the video if autoplay is off
    console.log("Autoplay is off. Video is paused.");
  }
});
