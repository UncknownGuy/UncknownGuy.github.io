document.addEventListener('DOMContentLoaded', function() {
  const logoWrapper = document.querySelector('.logo-wrapper');
  const logos = Array.from(logoWrapper.children); // Get the list of logos

  // Clone the logos to make the scrolling seamless
  function cloneLogos() {
    logos.forEach(logo => {
      const clonedLogo = logo.cloneNode(true); // Clone each logo
      logoWrapper.appendChild(clonedLogo); // Append the cloned logo
    });
  }

  // Call the function to clone logos once the page is loaded
  cloneLogos();
});
