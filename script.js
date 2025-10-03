// Load and prepare sound
const typingSound = new Audio('typing.mp3');
typingSound.volume = 0.3;
typingSound.loop = true; // Loop continuously

let isMuted = localStorage.getItem('typingSoundMuted') === 'true';
typingSound.volume = isMuted ? 0 : 0.3;

const messageHistory = [];
let allChats = JSON.parse(localStorage.getItem("savedChats") || "[]");
let currentChatId = null;

// Typing animation
async function typeText(element, text, speed = 12, playSound = true) {
  element.innerHTML = '';

  if (playSound && !isMuted) {
    try {
      await typingSound.play();
    } catch (e) {
      console.warn("Typing sound blocked by browser autoplay policy.");
    }
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    element.innerHTML += char === '\n' ? '<br>' : char;
    await new Promise(resolve => setTimeout(resolve, speed));
  }

  if (playSound && !isMuted) {
    typingSound.pause();
    typingSound.currentTime = 0;
  }
}

// Save current chat
function saveCurrentChatToStorage() {
  if (!currentChatId) {
    currentChatId = "chat_" + Date.now();
    allChats.push({ id: currentChatId, name: "Розмова " + new Date().toLocaleTimeString() });
  }
  localStorage.setItem("savedChats", JSON.stringify(allChats));
  localStorage.setItem(currentChatId, JSON.stringify(messageHistory));
  renderChatHistorySidebar();
}

// Delete chat from localStorage
function deleteChat(chatId) {
  allChats = allChats.filter(chat => chat.id !== chatId);
  localStorage.removeItem(chatId);

  if (currentChatId === chatId) {
    currentChatId = null;
    messageHistory.length = 0;
    document.getElementById("chat").innerHTML = "";
  }

  localStorage.setItem("savedChats", JSON.stringify(allChats));
  renderChatHistorySidebar();
}

// Render chat history sidebar
function renderChatHistorySidebar() {
  const chatList = document.getElementById("chat-history-list");
  chatList.innerHTML = "";

  allChats.forEach(chat => {
    const li = document.createElement("li");
    li.className = "chat-item";
    li.dataset.id = chat.id;

    const text = document.createElement("span");
    text.textContent = chat.name;
    text.title = "Double-click to rename";
    text.addEventListener("click", () => loadChat(chat.id));

    // ✏️ Rename
    text.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = chat.name;
      input.className = "rename-input";
      li.replaceChild(input, text);
      input.focus();

      input.addEventListener("blur", () => {
        chat.name = input.value.trim() || "Без назви";
        localStorage.setItem("savedChats", JSON.stringify(allChats));
        renderChatHistorySidebar();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    });


    // 🗑 Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "🗑";
    delBtn.title = "Видалити чат";
    delBtn.style.display = "none";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Ви впевнені, що хочете видалити цей чат?")) {
        deleteChat(chat.id);
      }
    });

    // Show delete on hover after 0.5s
    let hoverTimer;
    li.addEventListener("mouseenter", () => {
      hoverTimer = setTimeout(() => {
        delBtn.style.display = "inline-block";
      }, 500);
    });

    li.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      delBtn.style.display = "none";
    });

    li.appendChild(text);
    li.appendChild(delBtn);
    chatList.appendChild(li);
  });
}

// Load chat by ID
function loadChat(chatId) {
  const chatEl = document.getElementById("chat");
  chatEl.innerHTML = "";
  const messages = JSON.parse(localStorage.getItem(chatId) || "[]");
  messageHistory.length = 0;

  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + (msg.role === "user" ? "user" : "bot");
    msgDiv.innerHTML = msg.content.replace(/\n/g, "<br>");
    chatEl.appendChild(msgDiv);
    messageHistory.push(msg);
  });

  chatEl.scrollTop = chatEl.scrollHeight;
  currentChatId = chatId;
}

// Handle message send
document.getElementById("send").addEventListener("click", async () => {
  const inputEl = document.getElementById("question");
  const chatEl = document.getElementById("chat");
  const input = inputEl.value.trim();

  if (!input) return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  chatEl.appendChild(userMsg);
  await typeText(userMsg, input, 10);
  inputEl.value = "";
  messageHistory.push({ role: "user", content: input });

  try {
    const response = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 3SmrMlTFY3VwGpj9V0AXKjUseAja1TE67rDhPq_pyNM"
      },
      body: JSON.stringify({
        model: "BOGEMIR_NMT",
        messages: messageHistory
      })
    });

    const data = await response.json();
    let fullText = data.choices?.[0]?.message?.content || "";

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

    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    chatEl.appendChild(botMsg);
    await typeText(botMsg, filtered, 25);

    chatEl.scrollTop = chatEl.scrollHeight;
    messageHistory.push({ role: "assistant", content: filtered });
    saveCurrentChatToStorage();
  } catch (err) {
    console.error("Fetch error:", err);
    const errorMsg = document.createElement("div");
    errorMsg.className = "message bot";
    errorMsg.style.color = "red";
    errorMsg.textContent = "Error: " + err.message;
    chatEl.appendChild(errorMsg);
  }
});

// Typing sound toggle checkbox
const soundToggleCheckbox = document.getElementById('typing-sound-toggle');
soundToggleCheckbox.checked = isMuted;

soundToggleCheckbox.addEventListener('change', (e) => {
  isMuted = e.target.checked;
  localStorage.setItem('typingSoundMuted', isMuted);
  typingSound.volume = isMuted ? 0 : 0.3;
});

// New Chat Button
const newChatBtn = document.getElementById("new-chat-btn");
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    currentChatId = null;
    messageHistory.length = 0;
    document.getElementById("chat").innerHTML = "";
  });
}

// Show saved chats on load
renderChatHistorySidebar();
