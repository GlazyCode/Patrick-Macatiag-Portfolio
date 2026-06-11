const chatBox = document.getElementById("chatbox");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatToggle = document.getElementById("chat-toggle");
const chatOpenBtn = document.getElementById("chat-open-btn");

// Open Chat
chatOpenBtn.addEventListener("click", () => {
  chatBox.classList.add("active");
  // Add welcome message when chat opens (only once)
  if (!chatMessages.dataset.welcomed) {
    addMessage("Hi there! 👋🏻 Thanks for visiting my website. Feel free to ask me anything about programming, web development, or my experiences in tech. Let me know how I can help!", "bot");
    chatMessages.dataset.welcomed = "true";
  }
});
// Close Chat
chatToggle.addEventListener("click", () => {
  chatBox.classList.remove("active");
});

// Add message
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  if (sender === "bot") {
    message.innerHTML = `<img class="avatar" src="images/developer_portrait.png" alt="AI"><div class="text">${text}</div>`;
  } else {
    message.textContent = text;
  }
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Prevent sending while a request is in flight (avoids spam breaking the chat)
let isSending = false;

// Send message
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message || isSending) return;

  isSending = true;
  addMessage(message, "user");
  chatInput.value = "";
  chatSend.disabled = true;

  // Typing indicator - must be appended so user sees it and we can remove it
  const typingMsg = document.createElement("div");
  typingMsg.classList.add("message", "bot");
  typingMsg.innerHTML = `
    <img class="avatar" src="images/developer_portrait.png" alt="AI">
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatMessages.appendChild(typingMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json().catch(() => ({}));
    typingMsg.remove();

    if (response.ok && data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage(data.reply || "Something went wrong. Try again in a moment.", "bot");
    }
  } catch (error) {
    typingMsg.remove();
    addMessage("Server offline or busy. Please try again in a moment. 😢", "bot");
  } finally {
    isSending = false;
    chatSend.disabled = false;
  }
}

chatSend.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
