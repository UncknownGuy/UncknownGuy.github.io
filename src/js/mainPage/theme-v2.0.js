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

  // Block the page rendering by initially hiding all content
  document.body.style.visibility = 'hidden';
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  // Set the initial theme based on system preference (without transition)
  setThemeBasedOnSystemPreference();

  // After theme is applied, reveal the content
  window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';  // Reveal the body
    document.body.style.opacity = '1';  // Fade the body in smoothly
  });

  // Add transition class only when system theme preference changes
  mediaQuery.addEventListener('change', (e) => {
    // First, fetch all elements inside the body except for modal and backend elements
    const elements = document.body.querySelectorAll('*');

    // List of selectors for elements we want to exclude from being transitioned
    const excludedSelectors = [
      '#navbarNav', '#countdown-modal', '.modal', '.overlay', '.modal-content', 'caution', '.video-placeholder', '#videoPlayer', 
      '.video-player', '.seek-overlay', '#playPauseBtn', '#playPauseIcon', '.seek-bar', 'loading-dots', '#blackO', '#seek', 
      '.seek-progress', '.seek-point', 'caution-wrapper', '.seek-bar-overlay', '.video-overlay'
    ];

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

    // Total duration of the animation (in ms)
    const totalAnimationTime = 2500; // Adjust this value for total animation time

    // Number of elements to reveal
    const revealableElements = Array.from(elements).filter(el => 
      !excludedSelectors.some(selector => el.matches(selector))
    );
    
    // Calculate delay per element based on total animation time
    const delayIncrement = totalAnimationTime / revealableElements.length;

    // Staggered reveal for elements after theme change
    let delay = 0;

    // Loop through each element and reveal it one by one, excluding modal and backend-related content
    revealableElements.forEach((el) => {
      setTimeout(() => {
        // Reveal the element without shifting the layout
        el.style.visibility = 'visible';  // Make the element visible
        el.style.opacity = '1';  // Fade the element in smoothly
      }, delay);

      delay += delayIncrement; // Increment delay for each element
    });
  });
});
