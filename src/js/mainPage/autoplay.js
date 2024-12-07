// Function to load the autoplay state when the page loads
function loadAutoplayState() {
  const autoplay = JSON.parse(localStorage.getItem('autoplay')) || false; // Get state from localStorage or default to false
  const autoplayToggle = document.getElementById('autoplayToggle');
  const label = document.getElementById('autoplayStatusLabel');

  // Set the checkbox based on the saved state
  autoplayToggle.checked = autoplay;

  // Update the label text based on the autoplay state
  label.textContent = autoplay ? 'Autoplay: On' : 'Autoplay: Off';
}

// Function to save the autoplay state to localStorage when the toggle changes
function saveAutoplayState(event) {
  const autoplay = event.target.checked; // Get the new state from the toggle
  localStorage.setItem('autoplay', JSON.stringify(autoplay)); // Save the state to localStorage

  // Update the label dynamically based on the new state
  const label = document.getElementById('autoplayStatusLabel');
  label.textContent = autoplay ? 'Autoplay: On' : 'Autoplay: Off';

// Attach event listener to save the state when the toggle changes
document.getElementById('autoplayToggle').addEventListener('change', saveAutoplayState);

// Load the autoplay state when the page loads
window.addEventListener('DOMContentLoaded', loadAutoplayState);
