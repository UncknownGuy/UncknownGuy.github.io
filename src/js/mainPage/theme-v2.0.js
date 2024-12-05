// Theme Changing Script v2.0

// Change Log
// V2.0 > 
      // Reveal elements one by one
      // opcaity use for reveal to keep it's smoothness
      
document.addEventListener('DOMContentLoaded', function () {
  // Function to apply dark theme
  function applyDarkTheme() {
    document.body.classList.add('dark');  // Add the 'dark' class to body
    document.body.setAttribute('data-bs-theme', 'dark');  // Set the 'data-bs-theme' attribute
    // Set navbar background class for dark theme
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.remove('bg-light');
      navbar.classList.add('bg-dark');
    }
  }

  // Function to apply light theme
  function applyLightTheme() {
    document.body.classList.remove('dark');  // Remove the 'dark' class from body
    document.body.setAttribute('data-bs-theme', 'light');  // Set the 'data-bs-theme' attribute
    // Set navbar background class for light theme
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.remove('bg-dark');
      navbar.classList.add('bg-light');
    }
  }

  // Listen for changes in the system theme preference
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Function to apply the correct theme based on the system preference
  function setThemeBasedOnSystemPreference() {
    // Set the theme without transition (on page load)
    if (mediaQuery.matches) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  }

  // Set the initial theme based on system preference (without transition)
  setThemeBasedOnSystemPreference();

  // Add transition class only when system theme preference changes
  mediaQuery.addEventListener('change', (e) => {
    // First, fetch all elements inside the body except for modal and backend elements
    const elements = document.body.querySelectorAll('*');

    // List of selectors for elements we want to exclude from being transitioned
    const excludedSelectors = ['#countdown-modal', '.modal', '.overlay', '.modal-content'];

    // Initially hide all elements except excluded ones
    elements.forEach((el) => {
      if (!excludedSelectors.some(selector => el.matches(selector))) {
        el.style.visibility = 'hidden';  // Hide the element but keep its space in layout
        el.style.opacity = '0';  // Make it invisible but still take up space
        el.style.transition = 'opacity 0.8s ease-in-out'; // Apply smooth opacity transition
      }
    });

    // Apply the appropriate theme based on the new system preference
    if (e.matches) {
      applyDarkTheme(); // Switch to dark theme
    } else {
      applyLightTheme(); // Switch to light theme
    }

    // Staggered reveal for elements after theme change
    let delay = 0;

    // Loop through each element and reveal it one by one, excluding modal and backend-related content
    elements.forEach((el) => {
      if (!excludedSelectors.some(selector => el.matches(selector))) {
        setTimeout(() => {
          // Reveal the element without shifting the layout
          el.style.visibility = 'visible';  // Make the element visible
          el.style.opacity = '1';  // Fade the element in smoothly
        }, delay);
        delay += 50; // Staggered delay for each element (100ms)
      }
    });
  });
});
