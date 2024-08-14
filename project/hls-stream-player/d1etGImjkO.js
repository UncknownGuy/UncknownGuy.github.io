// Auto Play , Load Stream //
document.addEventListener('DOMContentLoaded', function() {
    const player = new Plyr('#hls-video', {
        controls: ['play-large', 'play', 'mute', 'volume', 'captions', 'settings', 'fullscreen'],
    });

    const qualitySelect = document.getElementById('quality-select');
    const autoMuteToggle = document.getElementById('auto-mute-toggle');
    const featureToggle = document.getElementById('toggle-feature');
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    const playButton = document.getElementById('play-button');
    const qualityBadge = document.getElementById('quality-badge');
    const qualityIcon = document.getElementById('quality-icon');

    const featureEnabled = localStorage.getItem('featureEnabled') === 'true';
    const previousStreamUrl = localStorage.getItem('lastStreamUrl');
    const autoMuteEnabled = localStorage.getItem('autoMuteEnabled') === 'true';
    const autoRefreshEnabled = localStorage.getItem('autoRefreshEnabled') === 'true';

    featureToggle.checked = featureEnabled;
    autoMuteToggle.checked = autoMuteEnabled;
    autoRefreshToggle.checked = autoRefreshEnabled;

    if (featureEnabled && previousStreamUrl) {
        const userWantsToPlay = confirm(`Would you like to play the previously saved stream? (${previousStreamUrl})`);
        if (userWantsToPlay) {
            document.getElementById('stream-url').value = previousStreamUrl;
            player.muted = autoMuteEnabled; 
            loadStream(previousStreamUrl, true); 
        } else {
            localStorage.removeItem('lastStreamUrl');
            alert('Previous link cleared.');
        }
    }

    document.getElementById('load-stream').addEventListener('click', function() {
        const streamUrl = document.getElementById('stream-url').value;
        if (streamUrl) {
            loadStream(streamUrl, false);
            if (featureToggle.checked) {
                localStorage.setItem('lastStreamUrl', streamUrl);
            }
            playButton.style.display = 'none'; // Hide play button on load
        } else {
            alert('Please enter a valid HLS stream URL.');
        }
    });

    function loadStream(streamUrl, isPreviousLink) {
        if (window.hls) {
            window.hls.destroy();
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(player.media);
            hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                player.play().then(() => {
                    playButton.style.display = 'none';
                    if (isPreviousLink) {
                        showNotification('Successfully Loaded');
                    } else {
                        showNotification('New Stream Successfully Loaded');
                    }
                }).catch(() => {
                    if (isPreviousLink) {
                        showNotification('Autoplay failed, but stream loaded successfully');
                    } else {
                        showNotification('Autoplay failed, but new stream loaded successfully');
                    }
                    playButton.style.display = 'block';
                });
                populateQualityOptions(hls, data.levels);
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
                updateQualityBadge(hls, data.level);
            });

            window.hls = hls;
        } else if (player.media.canPlayType('application/vnd.apple.mpegurl')) {
            player.media.src = streamUrl;
            player.media.addEventListener('loadedmetadata', function() {
                player.play().then(() => {
                    playButton.style.display = 'none';
                }).catch(() => {
                    playButton.style.display = 'block';
                });
            });
        } else {
            alert('HLS is not supported in this browser.');
        }
    }

    playButton.addEventListener('click', function() {
        player.play().then(() => {
            playButton.style.display = 'none';
        });
    });

    function populateQualityOptions(hls, levels) {
        qualitySelect.innerHTML = '';

        const autoOption = document.createElement('option');
        autoOption.value = -1;
        autoOption.textContent = 'Auto';
        qualitySelect.appendChild(autoOption);

        levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${level.height}p`;
            qualitySelect.appendChild(option);
        });

        qualitySelect.style.display = levels.length > 0 ? 'block' : 'none';

        // Set default to show current quality
        const currentLevel = hls.currentLevel;
        if (currentLevel === -1) {
            autoOption.textContent = `Auto (${levels[0].height}p)`;
        } else if (currentLevel >= 0 && currentLevel < levels.length) {
            autoOption.textContent = `Auto (${levels[currentLevel].height}p)`;
        }
    }

    function updateQualityBadge(hls, currentLevel) {
        const currentHeight = hls.levels[currentLevel]?.height;
        if (currentHeight) {
            qualityIcon.style.display = 'block';
            if (currentHeight >= 3840) {
                qualityBadge.className = 'bi bi-badge-4k-fill';
            } else if (currentHeight >= 720) {
                qualityBadge.className = 'bi bi-badge-hd-fill';
            } else {
                qualityBadge.className = 'bi bi-badge-sd-fill';
            }
            const autoOption = qualitySelect.querySelector('option[value="-1"]');
            if (autoOption) {
                autoOption.textContent = `Auto (${currentHeight}p)`;
            }
        } else {
            qualityIcon.style.display = 'none';
        }
    }

    qualitySelect.addEventListener('change', function() {
        const selectedLevel = parseInt(qualitySelect.value, 10);
        if (!isNaN(selectedLevel) && selectedLevel >= -1) {
            window.hls.currentLevel = selectedLevel;
        }
    });

    autoMuteToggle.addEventListener('change', function() {
        const isEnabled = autoMuteToggle.checked;
        localStorage.setItem('autoMuteEnabled', isEnabled);
        player.muted = isEnabled;
    });

    featureToggle.addEventListener('change', function() {
        const isEnabled = featureToggle.checked;
        localStorage.setItem('featureEnabled', isEnabled);

        if (isEnabled) {
            alert('Previous stream URL feature enabled.');
        } else {
            alert('Previous stream URL feature disabled.');
            localStorage.removeItem('lastStreamUrl');
        }
    });
});

// Function to open the modal
function openModal() {
    document.getElementById('settings-modal').style.display = 'block';
    document.querySelector('.settings-icon').classList.add('rotated');
}

// Function to close the modal
function closeModal() {
    document.getElementById('settings-modal').style.display = 'none';
    document.querySelector('.settings-icon').classList.remove('rotated');
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById('settings-modal')) {
        closeModal();
    }
};
