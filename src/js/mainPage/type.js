document.addEventListener('DOMContentLoaded', function() {
  const fadeUpElements = document.querySelectorAll('.fade-up-text'); // Select only elements with the fade-up-text class
  const fadeOutElements = document.querySelectorAll('.fade-out-text'); // Select only elements with the fade-out-text class

  // Function to check if an element is in the viewport
  function checkVisibility() {
    fadeUpElements.forEach((element, index) => {
      const position = element.getBoundingClientRect();

      // Check if the element is in the viewport (fully or slightly above)
      if (position.top < window.innerHeight && position.bottom >= 0) {
        // Fade-up: If it's not already visible, trigger fade-up animation
        if (!element.classList.contains('visible')) {
          setTimeout(() => {
            element.classList.add('visible');  // Trigger fade-up
            element.classList.remove('hidden'); // Remove hidden class if present
          }, index * 200); // Adds a delay between each element, 200ms for each one
        }
      }
    });

    fadeOutElements.forEach(element => {
      const position = element.getBoundingClientRect();

      // Check if the element is in the viewport (fully or slightly above)
      if (position.top < window.innerHeight && position.bottom >= 0) {
        // Fade-up: If it's not already visible, trigger fade-up animation
        if (!element.classList.contains('visible')) {
          element.classList.add('visible');  // Trigger fade-up
          element.classList.remove('hidden'); // Remove hidden class if present
        }
      } else {
        // Fade-out: If it's not already hidden, trigger fade-out animation when leaving the viewport
        if (!element.classList.contains('hidden')) {
          element.classList.add('hidden');  // Trigger fade-out
          element.classList.remove('visible'); // Remove visible class if present
        }
      }
    });
  }

  // Initial check for elements that might already be in the viewport on page load
  checkVisibility();

  // Check visibility when scrolling
  window.addEventListener('scroll', checkVisibility);
});
