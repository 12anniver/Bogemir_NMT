// Load and prepare sound
const typingSound = new Audio('typing.mp3');
typingSound.volume = 0.3;
typingSound.loop = true; // Loop continuously

async function typeText(element, text, speed = 12, playSound = true) {
  element.innerHTML = '';

  if (playSound) {
    try {
      await typingSound.play();
    } catch (e) {
      console.warn("Typing sound blocked by browser autoplay policy.");
    }
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '\n') {
      element.innerHTML += '<br>';
    } else {
      element.innerHTML += char;
    }

    await new Promise(resolve => setTimeout(resolve, speed));
  }

  if (playSound) {
    typingSound.pause();
    typingSound.currentTime = 0;
  }
}




document.getElementById("send").addEventListener("click", async () => {
  const inputEl = document.getElementById("question");
  const chatEl = document.getElementById("chat");
  const input = inputEl.value.trim();

  if (!input) return;

  // Create and animate user's message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  chatEl.appendChild(userMsg);
  await typeText(userMsg, input, 10);

  inputEl.value = "";

  try {
    const response = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 4Lp14fe-WQqICDmPNKU6V_bzeXQfldHOMjf9rKwfTZ0"
      },
      body: JSON.stringify({
        model: "BOGEMIR_NMT", // Replace with actual model
        messages: [{ role: "user", content: input }]
      })
    });

    const data = await response.json();

    let fullText = data.choices?.[0]?.message?.content || "";

    // Filter out unwanted lines
    let filtered = fullText
      .split('\n')
      .filter(line => {
        return !(
          line.trim().startsWith("<") ||
          line.trim().startsWith(">") ||
          line.includes("Related searches") ||
          /https?:\/\/[^\s]+/.test(line)
        );
      })
      .join('\n');

    // Create bot message element and animate it
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    chatEl.appendChild(botMsg);
    await typeText(botMsg, filtered, 25); // Slower typing for bot

    chatEl.scrollTop = chatEl.scrollHeight;

  } catch (err) {
    console.error("Fetch error:", err);

    const errorMsg = document.createElement("div");
    errorMsg.className = "message bot";
    errorMsg.style.color = "red";
    errorMsg.textContent = "Error: " + err.message;
    chatEl.appendChild(errorMsg);
  }
});
