/* -------------------------------------------------------
   LOAD CSS DYNAMICALLY (CIMA strips <link>)
------------------------------------------------------- */
(function loadCSS() {
  const cssUrl = "https://miladystudentassistantmodal.netlify.app/assistant/assistant.css";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
})();

/* -------------------------------------------------------
   ATTACH LAUNCH BUTTON
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sa-launch-btn");
  if (!btn) return;
  btn.addEventListener("click", openStudentAssistantModal);
});

/* -------------------------------------------------------
   BUILD & OPEN MODAL
------------------------------------------------------- */
function openStudentAssistantModal() {
  let existing = document.getElementById("sa-modal-root");

  if (existing) {
    existing.classList.add("sa-modal-open");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "sa-modal-root";
  wrapper.innerHTML = buildSAModalHTML();
  document.body.appendChild(wrapper);
}

/* -------------------------------------------------------
   CLOSE MODAL
------------------------------------------------------- */
function closeSAModal() {
  const modal = document.getElementById("sa-modal-root");
  if (!modal) return;
  modal.classList.remove("sa-modal-open");
}

/* -------------------------------------------------------
   MODAL HTML (UI ONLY — LOGIC BELOW)
------------------------------------------------------- */
function buildSAModalHTML() {
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

/* -------------------------------------------------------
   HELPERS — ADD MESSAGE BUBBLES
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
   CTA LOGIC — USER MESSAGE FIRST, THEN TUTOR REPLY
------------------------------------------------------- */

function saHandleCTA(type) {
  let userText = "";
  let tutorReply = "";

  if (type === "hint") {
    userText = "Can you give me a hint?";
    tutorReply =
      "Here’s a hint: Life skills are abilities that help people succeed personally and professionally. Think about habits that support good decisions, communication, or long-term goals. Which of those fits your question?";
  }

  if (type === "stuck") {
    userText = "I'm stuck, can you help me think through this?";
    tutorReply =
      "Totally fine to feel stuck! Try breaking the question into pieces. Is it asking about communication, professionalism, responsibility, or self-management? Once you identify the core skill, the rest becomes clearer.";
  }

  if (type === "focus") {
    userText = "What should I focus on in this question?";
    tutorReply =
      "Look for keywords related to responsibility, attitude, professionalism, or habits. These are strong clues that you're dealing with a Life Skills question. Which key words jump out at you?";
  }

  // Add user message bubble
  saAddUserMessage(userText);

  // Add tutor response after a short delay
  setTimeout(() => {
    saAddAssistantMessage(tutorReply);
  }, 450);
}

/* -------------------------------------------------------
   SEND USER TEXT + GENERATE AI-LIKE RESPONSE
------------------------------------------------------- */

function saSendUserMessage() {
  const input = document.getElementById("sa-input");
  const text = input.value.trim();
  if (!text) return;

  saAddUserMessage(text);
  input.value = "";

  setTimeout(() => {
    const reply = saGenerateLifeSkillsReply(text);
    saAddAssistantMessage(reply);
  }, 450);
}

/* -------------------------------------------------------
   “FAKE AI” LIFE SKILLS TUTORING ENGINE
------------------------------------------------------- */

function saGenerateLifeSkillsReply(msg) {
  const q = msg.toLowerCase();

  // Topic Matchers
  if (q.includes("goal")) {
    return "Strong goals are specific, realistic, and tied to a clear purpose. Is the question asking about long-term planning, short-term focus, or personal motivation?";
  }

  if (q.includes("time") || q.includes("manage")) {
    return "Time management helps reduce stress and improve performance. Does the question relate to prioritizing, scheduling, or avoiding procrastination?";
  }

  if (q.includes("communication")) {
    return "Communication involves clarity, listening, empathy, and tone. What aspect of communication is relevant here—expressing yourself, resolving conflict, or understanding others?";
  }

  if (q.includes("professional")) {
    return "Professionalism is about reliability, respect, integrity, and consistent behavior. Which behaviors in your question support or weaken professionalism?";
  }

  if (q.includes("stress") || q.includes("cope")) {
    return "Stress management is a key Life Skill. Strategies include organization, breaks, positive mindset, and seeking support. What part of the situation seems most challenging?";
  }

  if (q.includes("study") || q.includes("learn")) {
    return "Effective study habits include active note-taking, reviewing regularly, and breaking content into smaller pieces. What learning challenge is the question hinting at?";
  }

  // Default fallback responses
  const defaults = [
    "Try identifying which Life Skill the question is testing—communication, decision-making, responsibility, or professionalism. Which one seems most relevant?",
    "Eliminate answers that don’t relate to long-term success or personal growth. What remains is usually closer to the correct concept.",
    "Think about whether the option helps someone develop habits that support school, work, or personal life. Does that help you narrow it down?",
    "Look at the keywords. Life Skills questions often reference responsibility, awareness, or interpersonal behavior. Which keywords stand out to you?",
    "Consider the core skill behind the question—self-management, communication, or critical thinking. Which direction is it pointing you?"
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
