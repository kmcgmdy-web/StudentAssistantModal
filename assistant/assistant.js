/* ---------------------------------------------------------
   STUDENT ASSISTANT MODAL — UNIVERSAL GUIDE ON THE SIDE
   Fully client-side prototype with generic tutoring logic
   --------------------------------------------------------- */

/* ========== Modal Launch ========== */
document.addEventListener("DOMContentLoaded", function () {
  const launchBtn = document.getElementById("sa-launch-btn");
  if (launchBtn) {
    launchBtn.addEventListener("click", openAssistantModal);
  }
});

/* Create Modal Container */
function openAssistantModal() {
  if (document.getElementById("sa-modal")) return;

  const modal = document.createElement("div");
  modal.id = "sa-modal";
  modal.innerHTML = `
    <div class="sa-backdrop"></div>

    <div class="sa-window">
      <!-- Header -->
      <div class="sa-header">
        <div class="sa-title">✨ Student Assistant</div>
        <button class="sa-close-btn" id="sa-close">✕</button>
      </div>

      <!-- Messages -->
      <div class="sa-messages" id="sa-messages"></div>

      <!-- CTA Buttons -->
      <div class="sa-cta-container" id="sa-cta-initial">
        <button class="sa-cta">Can you help me understand this?</button>
        <button class="sa-cta">What is this concept really about?</button>
        <button class="sa-cta">Can we break this down step by step?</button>
      </div>

      <div class="sa-cta-container hidden" id="sa-cta-followup">
        <button class="sa-cta">What should I focus on here?</button>
        <button class="sa-cta">Can you give me an example?</button>
        <button class="sa-cta">I'm still stuck — try another way.</button>
      </div>

      <!-- Input -->
      <div class="sa-input-area">
        <input id="sa-input" type="text" placeholder="Type your question…" />
        <button id="sa-send" class="sa-send-btn">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  document.getElementById("sa-close").onclick = () => modal.remove();
  document.querySelectorAll(".sa-cta").forEach(btn => {
    btn.addEventListener("click", () => handleUserMessage(btn.innerText));
  });

  document.getElementById("sa-send").onclick = sendTypedMessage;
  document.getElementById("sa-input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendTypedMessage();
  });

  addAssistantMessage("How can I help you?");
}

/* ========== Messaging UI ========== */
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

/* ========== User Input Handling ========== */
function sendTypedMessage() {
  const input = document.getElementById("sa-input");
  let text = input.value.trim();
  if (!text) return;

  handleUserMessage(text);
  input.value = "";
}

function handleUserMessage(text) {
  addUserMessage(text);
  showFollowupCTAs();

  const response = generateTutorResponse(text);
  setTimeout(() => addAssistantMessage(response), 500);
}

/* ========== CTA Visibility ========== */
function showFollowupCTAs() {
  document.getElementById("sa-cta-initial").classList.add("hidden");
  document.getElementById("sa-cta-followup").classList.remove("hidden");
}

/* ========== Tutoring Logic (Universal Guide-on-the-Side) ========== */
function generateTutorResponse(input) {
  const msg = input.toLowerCase();

  /* Clarification questions */
  if (msg.includes("what")) {
    return "Great question. Let's start with the core idea. Think about what the concept is *trying to help you do* as a future professional. What part of it feels unclear?";
  }

  /* Process / How */
  if (msg.includes("how") || msg.includes("steps")) {
    return "Let's break it down step by step. Imagine you're performing this skill in real life. What’s the very first thing you'd need to understand or prepare?";
  }

  /* Stuck / Confused */
  if (msg.includes("confused") || msg.includes("stuck") || msg.includes("don't")) {
    return "Totally normal. Let's simplify it. What part do you already understand, even a little? We can build from there.";
  }

  /* Focus */
  if (msg.includes("focus")) {
    return "Try pulling out the keywords. They usually point to the real learning objective. Which terms or ideas feel most important here?";
  }

  /* Example request */
  if (msg.includes("example")) {
    return "Sure. Here’s a general way to think about it: imagine explaining this idea to a client or classmate in one sentence. What would you say?";
  }

  /* Default generic tutoring scaffold */
  const defaults = [
    "Let’s figure this out together. What part feels tricky?",
    "Here’s a simpler way to think about it. Imagine you're teaching this to a beginner.",
    "Try saying in your own words what you *think* it means — I’ll help refine it.",
    "Let’s zoom out: what is the purpose of this concept in real salon or clinic work?",
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
