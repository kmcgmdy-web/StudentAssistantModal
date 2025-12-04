/* -------------------------------------------------------
   LOAD CSS (CIMA blocks <link>, so inject dynamically)
------------------------------------------------------- */
(function loadCSS() {
  const cssUrl = "https://miladystudentassistantmodal.netlify.app/assistant/assistant.css";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
})();

/* -------------------------------------------------------
   BUTTON HOOKUP
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sa-launch-btn");
  if (!btn) return;

  btn.addEventListener("click", () => openStudentAssistantModal());
});

/* -------------------------------------------------------
   CREATE MODAL
------------------------------------------------------- */
function openStudentAssistantModal() {
  let existing = document.getElementById("sa-modal-root");
  if (existing) {
    existing.classList.add("sa-modal-open");
    return;
  }

  const modal = document.createElement("div");
  modal.id = "sa-modal-root";
  modal.innerHTML = buildModalHTML();
  document.body.appendChild(modal);
}

/* -------------------------------------------------------
   MODAL HTML
------------------------------------------------------- */
function buildModalHTML() {
  return `
    <div class="sa-modal-backdrop"></div>
    <div class="sa-modal">
      <div class="sa-header">
        <span class="sa-title">✨ Student Assistant</span>
        <button class="sa-close-btn" onclick="closeSAModal()">✖</button>
      </div>

      <div id="sa-body" class="sa-body">
        <div class="sa-message assistant">How can I help you?</div>

        <div class="sa-suggestions">
          <button class="sa-suggestion" onclick="saHandleCTA('hint')">
            Can you give me a hint?
          </button>
          <button class="sa-suggestion" onclick="saHandleCTA('stuck')">
            I'm stuck, can you help me think through this?
          </button>
          <button class="sa-suggestion" onclick="saHandleCTA('focus')">
            What should I focus on in this question?
          </button>
        </div>
      </div>

      <div class="sa-footer">
        <input id="sa-input" class="sa-input" placeholder="Type your question…" />
        <button class="sa-send" onclick="saSendUserMessage()">➤</button>
      </div>
    </div>
  `;
}

function closeSAModal() {
  document.getElementById("sa-modal-root").classList.remove("sa-modal-open");
}

/* -------------------------------------------------------
   CTA ROUTING (FAKE AI)
------------------------------------------------------- */
function saHandleCTA(type) {
  let response = "";

  if (type === "hint") {
    response = "Here’s a hint: Life skills are abilities that help people succeed personally and professionally. Think about skills that support daily decision-making, communication, or long-term goals. Which of those ideas connect to your question?";
  }

  if (type === "stuck") {
    response = "Totally fine to feel stuck! Try breaking the question into pieces. What is it *really* asking about—decision making, self-management, professionalism, communication, or goals? Starting there often makes the rest clearer.";
  }

  if (type === "focus") {
    response = "Look for keywords related to responsibility, attitude, professionalism, or habits. These usually signal Life Skills concepts. Which words in your question stand out the most?";
  }

  saAddAssistantMessage(response);
}

/* -------------------------------------------------------
   SEND USER MESSAGE
------------------------------------------------------- */
function saSendUserMessage() {
  const input = document.getElementById("sa-input");
  const text = input.value.trim();
  if (!text) return;

  saAddUserMessage(text);
  input.value = "";

  // Fake AI delay for realism
  setTimeout(() => {
    const reply = saGenerateLifeSkillsResponse(text);
    saAddAssistantMessage(reply);
  }, 550);
}

/* -------------------------------------------------------
   ADDING MESSAGES
------------------------------------------------------- */
function saAddUserMessage(text) {
  const body = document.getElementById("sa-body");
  const bubble = document.createElement("div");
  bubble.className = "sa-message user";
  bubble.textContent = text;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

function saAddAssistantMessage(text) {
  const body = document.getElementById("sa-body");
  const bubble = document.createElement("div");
  bubble.className = "sa-message assistant";
  bubble.textContent = text;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

/* -------------------------------------------------------
   FAKE AI (Life Skills Logic)
------------------------------------------------------- */

function saGenerateLifeSkillsResponse(message) {
  const lower = message.toLowerCase();

  // ——— Topic Routing ———

  if (lower.includes("goal") || lower.includes("goals")) {
    return "Goal setting is a core Life Skill. A strong goal is specific, realistic, and supported by a plan. What is the real purpose of the goal in your question—short-term focus, long-term planning, or personal motivation?";
  }

  if (lower.includes("time") || lower.includes("manage")) {
    return "Time management helps students stay organized and reduce stress. Try asking yourself: does the question relate to prioritizing tasks, scheduling, or avoiding procrastination?";
  }

  if (lower.includes("communication") || lower.includes("communicate")) {
    return "Communication is more than talking—it's listening, empathy, clarity, and tone. Think: is your question about expressing yourself, resolving conflict, or building professional relationships?";
  }

  if (lower.includes("professional") || lower.includes("attitude") || lower.includes("behavior")) {
    return "Professionalism in Life Skills refers to reliability, respect, integrity, and consistency. Which behaviors in your question align—or don’t—with professional expectations?";
  }

  if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("cope")) {
    return "Stress management is a key Life Skill. Strategies include organization, breaks, positive self-talk, and asking for support. What part of the situation in your question is causing the pressure?";
  }

  if (lower.includes("study") || lower.includes("learning")) {
    return "Effective study habits include note-taking, reviewing frequently, and learning in small sections. What about the question relates to learning challenges or techniques?";
  }

  if (lower.includes("ph") || lower.includes("chemistry")) {
    return "Even though pH is chemistry, Life Skills thinking still applies. Try breaking the concept down into smaller steps. What part of pH balance feels unclear—acid vs alkali, scale, or how it affects hair?";
  }

  if (lower.includes("help") || lower.includes("confused") || lower.includes("explain")) {
    return "No problem! Start by identifying the key concept the question is testing—decision making, communication, professionalism, responsibility, or self-management. Which of those fits best?";
  }

  // Default tutoring
  const defaults = [
    "Think about the underlying Life Skill the question is targeting—communication, problem-solving, professionalism, or emotional awareness. Which one seems most relevant here?",
    "Try eliminating options that are clearly not related to long-term personal or professional success. What remains?",
    "Ask yourself: does this option build a habit or mindset that would help someone succeed in school or a career?",
    "Look at the keywords. Life Skills questions often highlight responsibility, awareness, planning, or behavior. Which keywords stand out to you?",
    "Great question! What’s the core Life Skill being tested—self-management, communication, or critical thinking?"
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
