function menuButton(x) {
    x.classList.toggle("change");
}

function toggleNav() {
    var x = document.getElementById("myNav");
    if (x.style.height === "100%") {
    x.style.height = "0%";
    } 
    else {
    x.style.height = "100%";
    }
}