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
   OPEN MODAL
--------------------------------------------------------- */
function openAssistantModal() {
  // Always remove any broken leftover modal
  const old = document.getElementById("sa-modal");
  if (old) old.remove();

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

      <div id="sa-cta-initial" class="sa-cta-container">
        <button class="sa-cta">Can you help me understand this?</button>
        <button class="sa-cta">What is this concept really about?</button>
        <button class="sa-cta">Can we break this down step by step?</button>
      </div>

      <div id="sa-cta-followup" class="sa-cta-container hidden">
        <button class="sa-cta">What should I focus on here?</button>
        <button class="sa-cta">Can you give me an example?</button>
        <button class="sa-cta">I'm still stuck — try another way.</button>
      </div>

      <div class="sa-input-area">
        <input id="sa-input" type="text" placeholder="Type your question…" />
        <button id="sa-send" class="sa-send-btn">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Bind modal close
  document.getElementById("sa-close").onclick = () => modal.remove();

  // Bind CTAs
  document.querySelectorAll(".sa-cta").forEach(btn =>
    btn.addEventListener("click", () => handleUserMessage(btn.innerText))
  );

  // Bind send button
  document.getElementById("sa-send").onclick = sendTypedMessage;

  // Bind Enter key
  document
    .getElementById("sa-input")
    .addEventListener("keypress", e => e.key === "Enter" && sendTypedMessage());
}

/* ---------------------------------------------------------
   MESSAGE HELPERS
--------------------------------------------------------- */
function addUserMessage(text) {
  const box = document.getElementById("sa-messages");
  box.innerHTML += `
    <div class="sa-msg-row user">
      <div class="sa-msg user-msg">${text}</div>
    </div>`;
  box.scrollTop = box.scrollHeight;
}

function addAssistantMessage(text) {
  const box = document.getElementById("sa-messages");
  box.innerHTML += `
    <div class="sa-msg-row bot">
      <div class="sa-msg bot-msg">${text}</div>
    </div>`;
  box.scrollTop = box.scrollHeight;
}

/* ---------------------------------------------------------
   USER INPUT HANDLING
--------------------------------------------------------- */
function sendTypedMessage() {
  const input = document.getElementById("sa-input");
  const text = input.value.trim();
  if (!text) return;

  handleUserMessage(text);
  input.value = "";
}

function handleUserMessage(text) {
  addUserMessage(text);
  showFollowups();

  const reply = generateGenericTutorResponse(text);
  setTimeout(() => addAssistantMessage(reply), 450);
}

/* ---------------------------------------------------------
   SHOW FOLLOW-UP CTAs
--------------------------------------------------------- */
function showFollowups() {
  document.getElementById("sa-cta-initial").classList.add("hidden");
  document.getElementById("sa-cta-followup").classList.remove("hidden");
}

/* ---------------------------------------------------------
   GENERIC GUIDE-ON-THE-SIDE TUTORING ENGINE
--------------------------------------------------------- */
function generateGenericTutorResponse(msg) {
  const q = msg.toLowerCase();

  if (q.includes("what")) {
    return "Let’s get clear on the core idea. What is this concept trying to help you do as a learner or future professional?";
  }

  if (q.includes("how") || q.includes("step")) {
    return "Let's walk through this step by step. What do you think the *first step* might be?";
  }

  if (q.includes("example")) {
    return "Here’s one way to think about it: imagine you’re explaining it to a classmate in simple terms. What would you say first?";
  }

  if (q.includes("focus")) {
    return "Look for the important keywords. They usually point directly to the learning objective. Which words stand out to you?";
  }

  if (q.includes("stuck") || q.includes("confused")) {
    return "No worries — totally normal. Tell me which part feels unclear, and we can tackle it together.";
  }

  const defaults = [
    "Let’s break it down together. What part feels tricky?",
    "Here’s a simpler way to think about it. What does this concept help you do in real practice?",
    "Try explaining what you *think* it means — I can help refine it.",
    "Let’s zoom out. What is the purpose of this topic in the bigger picture?"
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
