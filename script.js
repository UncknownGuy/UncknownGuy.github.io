const toggle = document.getElementById("toggle");
const refresh = document.getElementById("refresh");
const theme = window.localStorage.getItem("theme");

/* checks if the theme stored in localStorage is dark
if yes apply the dark theme to the body */
if (theme === "dark") document.body.classList.add("dark");

// event listener stops when the change theme button is clicked
toggle.addEventListener("click", () => {
   document.body.classList.toggle("dark");
   if (theme === "dark") {
     window.localStorage.setItem("theme", "light");
   } else window.localStorage.setItem("theme", "dark");
});

refresh.addEventListener("click", () => {
   window.location.reload();
});

// storing the theme on the user's machine
localStorage.setItem('theme', 'dark');

//accessed the user's machine theme
localStorage.getItem('theme');
// dark