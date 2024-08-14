
// Auto Mute 

function initializeAutoMute(player, autoMuteToggle) {
    // Load auto-mute setting from localStorage
    const autoMuteEnabled = localStorage.getItem('autoMuteEnabled') === 'true';
    autoMuteToggle.checked = autoMuteEnabled;
    player.muted = autoMuteEnabled;

    // Update localStorage and player mute state on toggle change
    autoMuteToggle.addEventListener('change', function() {
        const isMuted = autoMuteToggle.checked;
        localStorage.setItem('autoMuteEnabled', isMuted);
        player.muted = isMuted;
    });
}


