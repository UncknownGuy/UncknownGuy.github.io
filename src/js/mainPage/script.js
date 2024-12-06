// Function to initialize a slideshow for a specific gallery
function initializeGallery(gallery) {
  // Select images for the specific gallery
  const images = gallery.querySelectorAll('.gallery-image');
  
  // Select or create indicators for this gallery
  let indicators = gallery.querySelectorAll('.indicator');
  
  // If there are no indicators, create them dynamically based on the number of images
  if (indicators.length === 0) {
    const indicatorContainer = gallery.querySelector('.image-indicators');
    // Clear the container to avoid duplicates if the gallery is re-initialized
    indicatorContainer.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
      const indicator = document.createElement('span');
      indicator.classList.add('indicator');
      indicator.id = `indicator-${i + 1}`;
      indicatorContainer.appendChild(indicator);
    }
    indicators = gallery.querySelectorAll('.indicator'); // Re-fetch indicators
  }

  let currentImageIndex = 0;
  let intervalId;

  // Function to update the current image and indicator
  function updateImage() {
    images.forEach((img, index) => {
      img.style.display = index === currentImageIndex ? 'block' : 'none';
    });

    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    if (indicators[currentImageIndex]) {
      indicators[currentImageIndex].classList.add('active');
    }
  }

  // Function to check if an image is loaded
  function isImageLoaded(image) {
    return image.complete && image.naturalWidth !== 0;
  }

  // Function to load an image and wait until it's fully loaded
  function loadImage(image) {
    return new Promise(resolve => {
      if (isImageLoaded(image)) {
        resolve();
      } else {
        image.onload = resolve;
      }
    });
  }

  // Function to start the slideshow
  async function startSlideShow() {
    await loadImage(images[currentImageIndex]);
    updateImage();

    intervalId = setInterval(async () => {
      const nextImageIndex = (currentImageIndex + 1) % images.length;
      await loadImage(images[nextImageIndex]);
      currentImageIndex = nextImageIndex;
      updateImage();
    }, 5000);  // Change image every 5 seconds
  }

  // Function to preload all images before starting the slideshow
  async function preloadImages() {
    const loadPromises = Array.from(images).map(image => loadImage(image));
    await Promise.all(loadPromises);

    startSlideShow();
  }

  // Start the process when the page loads
  preloadImages();
}

// Initialize all galleries on page load
window.onload = function() {
  const galleries = document.querySelectorAll('.gallery-wrapper');
  galleries.forEach(gallery => initializeGallery(gallery));
};

document.addEventListener('DOMContentLoaded', () => {
  const clickableTexts = document.querySelectorAll('.clickable-text');
  const modal = document.getElementById('countdown-modal');
  const countdownTimer = document.getElementById('countdown-timer');
  const overlay = modal.querySelector('.overlay');
  const modalContent = modal.querySelector('.modal-content');

  // Function to disable scrolling
  function disableScroll() {
    document.body.style.overflow = 'hidden'; // Disable scrolling
  }

  // Function to enable scrolling
  function enableScroll() {
    document.body.style.overflow = ''; // Enable scrolling
  }

  clickableTexts.forEach(span => {
    span.addEventListener('click', () => {
      const url = span.getAttribute('data-url');
      if (url) {
        let countdown = 5; // Set countdown time
        countdownTimer.textContent = countdown;

        // Show modal and trigger fade-in and slide-down animations
        modal.style.visibility = 'visible'; // Make the modal visible
        modal.style.opacity = '1'; // Fade in the modal (overlay)
        overlay.style.opacity = '1'; // Fade in the overlay
        modalContent.style.opacity = '1'; // Fade in the content

        // Disable scrolling when modal is active
        disableScroll();

        const interval = setInterval(() => {
          countdown--;
          countdownTimer.textContent = countdown;

          if (countdown === 0) {
            clearInterval(interval);
            // Hide modal and overlay with fade-out effect
            modal.style.opacity = '0'; // Fade out the modal (overlay)
            overlay.style.opacity = '0'; // Fade out the overlay
            modalContent.style.opacity = '0'; // Fade out the content
            // After fading out, hide visibility to allow interaction again
            setTimeout(() => {
              modal.style.visibility = 'hidden'; // Hide modal
              // Enable scrolling after modal is hidden
              enableScroll();
            }, 300); // Wait for fade-out transition to complete

            window.location.href = url; // Redirect in the same tab
          }
        }, 1000);
      }
    });
  });
});
