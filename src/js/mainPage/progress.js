document.addEventListener('DOMContentLoaded', function () {
  let totalResources = 0;
  let loadedResources = 0;

  // Select the Bootstrap progress bar and container
  const progressBar = document.querySelector('.progress-bar');
  const progressContainer = document.querySelector('#progress-container');

  // Function to update the progress bar
  const updateProgress = function () {
    const progress = (loadedResources / totalResources) * 100;
    progressBar.style.width = `${progress}%`; // Update progress bar width
    progressBar.setAttribute('aria-valuenow', progress.toFixed(2)); // Update ARIA value
  };

  // Monitor resources using the Performance API
  function monitorResources() {
    const resources = performance.getEntriesByType('resource');
    totalResources = resources.length;

    // If no resources are present, immediately complete progress
    if (totalResources === 0) {
      progressBar.style.width = '100%';
      progressBar.setAttribute('aria-valuenow', '100');
      setTimeout(() => {
        progressContainer.style.display = 'none';
      }, 500); // Hide progress bar after delay
      return;
    }

    // Fetch and monitor each resource
    resources.forEach(function (resource) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', resource.name, true);

      // On progress event for each resource
      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          const percentLoaded = (event.loaded / event.total) * 100;
          const overallProgress = (loadedResources / totalResources) * 100 + (percentLoaded / totalResources);
          progressBar.style.width = `${overallProgress}%`;
          progressBar.setAttribute('aria-valuenow', overallProgress.toFixed(2));
        }
      };

      // On successful load of the resource
      xhr.onload = function () {
        loadedResources++;
        updateProgress(); // Update progress bar
        if (loadedResources === totalResources) {
          setTimeout(() => {
            progressContainer.style.display = 'none'; // Hide progress bar on complete
          }, 500);
        }
      };

      // Handle failed resource loading
      xhr.onerror = function () {
        console.error(`Failed to load resource: ${resource.name}`);
        loadedResources++; // Treat it as loaded to avoid stalling
        updateProgress();
      };

      xhr.send();
    });
  }

  // Start monitoring once the window has loaded
  window.addEventListener('load', monitorResources);
});
