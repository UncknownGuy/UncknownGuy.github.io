// Function to redirect console.log messages to a div element
function redirectConsoleLog() {
  const consoleLog = console.log;
  const consoleDiv = document.getElementById('console');

  console.log = function(message) {
    consoleLog.apply(console, arguments);
    consoleDiv.innerHTML += `${message}<br>`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  };
}

// Redirect console.log messages to the console div
redirectConsoleLog();

// Example console.log messages
console.log('This is a console log message.');
console.log('Another console log message.');
setInterval(updateUptime, 1000);
