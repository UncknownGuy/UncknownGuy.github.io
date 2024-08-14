// Feed Back //
document.addEventListener('DOMContentLoaded', function() {
    const feedbackBox = document.getElementById('feedback-box');
    const notificationMessage = document.getElementById('notification-message');

    window.showNotification = function(message) {
        notificationMessage.textContent = message;
        feedbackBox.classList.add('visible');
        setTimeout(() => {
            feedbackBox.classList.remove('visible');
        }, 3000);
    };
});
