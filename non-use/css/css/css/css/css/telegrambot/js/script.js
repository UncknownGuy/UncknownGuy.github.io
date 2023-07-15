// Function to refresh the web page
function refreshPage() {
  console.log('Refreshing page...');
  location.reload();
}

// Set the timeout to refresh after 1 hour
setTimeout(refreshPage, 60 * 60 * 1000);
