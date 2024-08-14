// Auto Seek to Latest Fregment //
// Function to skip to the live edge of the HLS stream using Plyr
function skipToLive() {
    const player = Plyr.setup('video')[0]; // Get the Plyr instance for the video element
    if (player && player.media) {
        const duration = player.media.duration;
        // Seek to the live edge if the currentTime is not close to the end of the stream
        if (player.media.currentTime < duration - 10) { // Allow a buffer to ensure it is close to live edge
            player.media.currentTime = duration; // Seek to the live edge
        }
    }
}

// Function to handle auto-refresh toggle
function handleAutoRefresh() {
    const toggleSwitch = document.getElementById('auto-refresh-toggle');

    // Load the saved state from localStorage
    const savedState = localStorage.getItem('auto-refresh');
    if (savedState === 'true') {
        toggleSwitch.checked = true;
        // Attach the event listener to check when playback resumes
        document.querySelector('video').addEventListener('play', skipToLive);
    } else {
        toggleSwitch.checked = false;
        // Remove the event listener if auto-refresh is turned off
        document.querySelector('video').removeEventListener('play', skipToLive);
    }

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            // Attach the event listener to check when playback resumes
            document.querySelector('video').addEventListener('play', skipToLive);
            // Save the state to localStorage
            localStorage.setItem('auto-refresh', 'true');
        } else {
            // Remove the event listener when auto-refresh is turned off
            document.querySelector('video').removeEventListener('play', skipToLive);
            // Save the state to localStorage
            localStorage.setItem('auto-refresh', 'false');
        }
    });

    // Clear the event listener when the page is unloaded
    window.addEventListener('beforeunload', () => {
        document.querySelector('video').removeEventListener('play', skipToLive);
    });
}

// Initialize the script
document.addEventListener('DOMContentLoaded', () => {
    handleAutoRefresh();
});













