const themeCheckbox = document.getElementById("theme-toggle-checkbox");
const body = document.body;
const iconSpan = document.querySelector(".theme-switch .icon");

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.remove("light");
  body.classList.add("dark");
  themeCheckbox.checked = true;
  iconSpan.textContent = "🌙";
} else {
  body.classList.add("light");
  themeCheckbox.checked = false;
  iconSpan.textContent = "☀️";
}

// Toggle on checkbox change
themeCheckbox.addEventListener("change", () => {
  if (themeCheckbox.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    iconSpan.textContent = "🌙";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    localStorage.setItem("theme", "light");
    iconSpan.textContent = "☀️";
  }
});

