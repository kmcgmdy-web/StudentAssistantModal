/* ---------------------------------------------------------
   LOAD CSS SAFELY
--------------------------------------------------------- */
(function loadCSS() {
  const cssUrl = "https://miladystudentassistantmodal.netlify.app/assistant/assistant.css";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
})();

/* ---------------------------------------------------------
   ENSURE BUTTON ALWAYS GETS BOUND
--------------------------------------------------------- */
function bindLaunchButton() {
  const btn = document.getElementById("sa-launch-btn");
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = "true";
    btn.addEventListener("click", openAssistantModal);
  }
}
setInterval(bindLaunchButton, 300);

/* ---------------------------------------------------------
   CREATE + OPEN MODAL
--------------------------------------------------------- */
function openAssistantModal() {

  // Remove any leftover modal before creating new one
  const existing = document.getElementById("sa-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "sa-modal";

  modal.innerHTML = `
    <div class="sa-backdrop"></div>

    <div class="sa-window">

      <div class="sa-header">
        <div class="sa-title">✨ Student Assistant</div>
        <button class="sa-close-btn" id="sa-close">✕</button>
      </div>

      <div id="sa-messages" class="sa-messages">
        <div class="sa-msg-row bot">
          <div class="sa-msg bot-msg">How can I help you?</div>
        </div>
      </div>

      <div class="sa-input-area">
        <input id="sa-input" type="text" placeholder="Type your question…" />
        <button id="sa-send" class="sa-send-btn">➤</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // Close modal
  document.getElementById("sa-close").onclick = () => modal.remove();

  // Send button
  document.getElementById("sa-send").onclick = sendTypedMessage;

  // Enter key
  document.getElementById("sa-input")
    .addEventListener("keypress", e => {
      if (e.key === "Enter") sendTypedMessage();
    });
}

/* ---------------------------------------------------------
   APPEND MESSAGES
--------------------------------------------------------- */
function addUserMessage(text) {
  const box = document.getElementById("sa-messages");
  box.innerHTML += `
    <div class="sa-msg-row user">
      <div class="sa-msg user-msg">${text}</div>
    </div>
  `;
  box.scrollTop = box.scrollHeight;
}

function addAssistantMessage(text) {
  const box = document.getElementById("sa-messages");
  box.innerHTML += `
    <div class="sa-msg-row bot">
      <div class="sa-msg bot-msg">${text}</div>
    </div>
  `;
  box.scrollTop = box.scrollHeight;
}

/* ---------------------------------------------------------
   USER INPUT HANDLING
--------------------------------------------------------- */
function sendTypedMessage() {
  const input = document.getElementById("sa-input");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  const reply = generateGenericTutorResponse(text);

  setTimeout(() => addAssistantMessage(reply), 450);
}

/* ---------------------------------------------------------
   GENERIC GUIDE-ON-THE-SIDE LOGIC
--------------------------------------------------------- */
function generateGenericTutorResponse(msg) {

  const q = msg.toLowerCase();

  if (q.includes("what")) {
    return "Let’s get clear on the core idea. What is this concept trying to help you do in practice?";
  }

  if (q.includes("how")) {
    return "Let’s try one step at a time. What do you think the first step might be?";
  }

  if (q.includes("example")) {
    return "Imagine explaining it to a classmate. What part would you start with?";
  }

  if (q.includes("focus")) {
    return "Look for the keywords—those usually point directly to the objective. Which ones stand out?";
  }

  if (q.includes("stuck") || q.includes("confused")) {
    return "Totally fine—tell me which piece feels unclear and we’ll work through it together.";
  }

  const defaults = [
    "Let’s break it down—what part feels tricky?",
    "Here’s a way to think about it: what does this help you do as a learner or a professional?",
    "Try saying what you *think* it means—I’ll help refine it.",
    "Let’s zoom out. What’s the purpose of this topic in the bigger picture?"
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
