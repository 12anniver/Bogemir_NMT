const splashText = "БОЖЕМИР_НМТ";
const splashTitleEl = document.getElementById("splash-title");
const splashSubtext = document.getElementById("splash-subtext");
const startBtn = document.getElementById("start-button");
const splashScreen = document.getElementById("splash");
const container = document.getElementById("container");
const appWrapper = document.getElementById("app-wrapper");

// Typing animation + shrink + show subtext + show button
async function animateSplashTitle() {
  // Typing animation
  for (let i = 0; i < splashText.length; i++) {
    splashTitleEl.textContent += splashText[i];
    splashTitleEl.style.opacity = 1;
    await new Promise(r => setTimeout(r, 150));
  }

  // Short pause after typing
  await new Promise(r => setTimeout(r, 500));

  // Shrink and move the title
  splashTitleEl.classList.add("shrink-title");

  // Wait for the shrink animation to finish
  await new Promise(r => setTimeout(r, 1000));

  // Show subtitle and button
  splashSubtext.style.opacity = 1;
  startBtn.style.opacity = 1;
}

// Start animation when page loads
animateSplashTitle();

// Handle Start button click
startBtn.addEventListener("click", () => {
  // Fade out splash
  splashScreen.style.transition = "opacity 1s ease";
  splashScreen.style.opacity = 0;

  // Fade body background to white
  document.body.style.backgroundColor = "#f0f2f5";

  // After fade completes
  setTimeout(() => {
    splashScreen.style.display = "none";

    // Show app wrapper smoothly
    appWrapper.classList.add("visible");

    // Show container (chat + header)
    container.style.display = "flex";
    setTimeout(() => {
      container.style.opacity = 1;
      document.getElementById("question").focus();
    }, 50);
  }, 1000);
});
