(function() {
    // Function to detect user's preferred color scheme
    function detectColorScheme() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
    }

    // Function to apply the selected theme
    function applyTheme(theme) {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }

    // Function to show a message when the theme changes
    function showThemeMessage(theme) {
        console.log(`Theme applied: ${theme}`);
    }

    // Apply the theme based on user's preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || detectColorScheme();
    applyTheme(theme);
    showThemeMessage(theme);

    // Show the body content after applying the theme
    document.body.classList.remove('hide-content');

    // Event listener to detect changes in user's preferred color scheme
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        showThemeMessage(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Event listener to handle theme changes initiated by the user
    document.body.addEventListener('click', (event) => {
        if (event.target.id === 'toggleThemeButton') {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
            showThemeMessage(currentTheme);
            localStorage.setItem('theme', currentTheme); // Save theme preference in local storage

            setTimeout(() => {
                location.reload(); // Reload the page to apply the theme changes
            }, 5000); // Refresh after 5 seconds to allow user to see the message
        }
    });
})();
