// Initialize HLS.js when the page loads
let hls;
let currentStreamIndex = 0; // Start with the first stream in the array
const year = '2024©'; // Store the year as a string

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
    hls.attachMedia(video);

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
      video.play();
      revealPlayer(streamName);
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.error('HLS.js error:', data);
        currentStreamIndex++;
        loadStream();
      }
    });

    // Listen for changes in resolution
    hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
      updateResolutionDropdown(); // Update the resolution dropdown when the level changes
    });

  } else {
    video.src = url;
    video.play();
    revealPlayer(streamName);
  }
}
