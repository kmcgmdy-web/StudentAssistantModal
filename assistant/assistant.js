// -------------------------
// Inject CSS (CIMA blocks <link>)
// -------------------------
(function loadStudentAssistantCSS() {
  const cssUrl = "https://miladystudentassistantmodal.netlify.app/assistant/assistant.css";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
})();

// -------------------------
// Wait for widget button
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sa-launch-btn");
  if (!btn) return;

  btn.classList.add("sa-button-ready");

  btn.addEventListener("click", () => {
    openStudentAssistantModal();
  });
});

// -------------------------
// Build modal on demand
// -------------------------
function openStudentAssistantModal() {
  // If modal already exists → show again
  let modal = document.getElementById("sa-modal-root");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "sa-modal-root";
    modal.innerHTML = buildStudentAssistantModalHTML();
    document.body.appendChild(modal);
  }

  modal.classList.add("sa-modal-open");
}

// -------------------------
// Modal HTML
// -------------------------
function buildStudentAssistantModalHTML() {
  return `
    <div class="sa-modal-backdrop"></div>
    <div class="sa-modal">
      <div class="sa-header">
        <span class="sa-title">✨ Student Assistant</span>
        <button class="sa-close-btn" onclick="document.getElementById('sa-modal-root').classList.remove('sa-modal-open')">✖</button>
      </div>

      <div class="sa-body">
        <div class="sa-message assistant">How can I help you?</div>

        <div class="sa-suggestions">
          <button class="sa-suggestion">Can you give me a hint?</button>
          <button class="sa-suggestion">I'm stuck, can you help me think through this?</button>
          <button class="sa-suggestion">What should I focus on in this question?</button>
        </div>
      </div>

      <div class="sa-footer">
        <input class="sa-input" placeholder="Type your question…" />
        <button class="sa-send">➤</button>
      </div>
    </div>
  `;
}
