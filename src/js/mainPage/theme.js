document.addEventListener('DOMContentLoaded', function () {
  // Check if the user prefers dark mode using matchMedia
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Function to apply dark theme
  function applyDarkTheme() {
    document.body.classList.add('dark');  // Add the 'dark' class to body
  }

  // Function to remove dark theme (for light mode)
  function applyLightTheme() {
    document.body.classList.remove('dark');  // Remove the 'dark' class from body
  }

  // Initially apply the correct theme based on system preference
  if (prefersDarkMode) {
    applyDarkTheme();
  } else {
    applyLightTheme();
  }

  // Listen for changes in the system theme preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
      applyDarkTheme(); // Switch to dark theme
    } else {
      applyLightTheme(); // Switch to light theme
    }
  });
});
