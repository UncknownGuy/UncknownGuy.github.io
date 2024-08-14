// Theme Menager
document.addEventListener('DOMContentLoaded', () => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedPreference = localStorage.getItem('theme');

    if (storedPreference === 'dark' || (!storedPreference && userPrefersDark)) {
        document.body.classList.add('dark-mode');
    }
});
