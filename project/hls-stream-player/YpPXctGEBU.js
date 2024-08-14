// Roate to fullscreen without auto-rotate //
document.addEventListener('DOMContentLoaded', () => {
        const videoContainer = document.querySelector('.video-container');
        const videoElement = document.querySelector('#hls-video');

        function onFullscreenChange() {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                if (screen.orientation && screen.orientation.lock) {
                    // Check if the video is in landscape mode
                    if (videoElement.videoWidth > videoElement.videoHeight) {
                        screen.orientation.lock('landscape').catch(err => {
                            console.warn('Failed to lock screen orientation:', err);
                        });
                    }
                }
            } else {
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock().catch(err => {
                        console.warn('Failed to unlock screen orientation:', err);
                    });
                }
            }
        }

        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('MSFullscreenChange', onFullscreenChange);

        videoContainer.addEventListener('click', () => {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            }
        });
    });