// Function to get stream list from an online JSON file
async function getStreams() {
  const url = 'https://raw.githubusercontent.com/UncknownGuy/UncknownGuy.github.io/refs/heads/main/cloud/hosted/shows.json';  // Replace with your actual GitHub URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const streams = await response.json();
    return streams;
  } catch (error) {
    console.error('Failed to fetch the stream list:', error);
    return []; // Return an empty array in case of an error
  }
}

// Expose the getStreams function to be accessible in play.js
window.m3u8 = {
  getStreams
};
