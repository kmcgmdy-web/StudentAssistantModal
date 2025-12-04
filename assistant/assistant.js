(function () {
  function injectModal() {
    const parentDoc = window.parent.document;

    // If already exists → show it
    if (parentDoc.getElementById("sa-modal-overlay")) {
      parentDoc.getElementById("sa-modal-overlay").style.display = "flex";
      return;
    }

    // Create overlay
    const overlay = parentDoc.createElement("div");
    overlay.id = "sa-modal-overlay";

    // Modal HTML
    overlay.innerHTML = `
      <div id="sa-modal">
        <div id="sa-header">
          <span class="sa-title">Student Assistant</span>
          <div>
            <button id="sa-minimize">—</button>
            <button id="sa-close">×</button>
          </div>
        </div>

        <div id="sa-body">
          <div class="sa-message assistant">
            <span class="sa-badge">Student Assistant</span>
            <div class="sa-bubble">How can I help you?</div>
          </div>

          <div class="sa-cta-container">
            <p class="sa-try-title">Try asking:</p>
            <button class="sa-cta">Can you give me a hint?</button>
            <button class="sa-cta">I'm stuck, can you help me think through this?</button>
            <button class="sa-cta">What should I focus on in this question?</button>
          </div>
        </div>

        <div id="sa-input-bar">
          <input id="sa-input" type="text" placeholder="Type your question…" />
          <button id="sa-send">➤</button>
        </div>
      </div>
    `;

    parentDoc.body.appendChild(overlay);

    // Close modal
    parentDoc.getElementById("sa-close").onclick = () => {
      overlay.style.display = "none";
    };

    // Minimize modal
    parentDoc.getElementById("sa-minimize").onclick = () => {
      parentDoc.getElementById("sa-modal").style.display = "none";
      setTimeout(() => {
        parentDoc.getElementById("sa-modal").style.display = "flex";
      }, 300);
    };
  }

  // Attach click handler to button (inside iframe)
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("sa-launch-btn");
    if (!btn) return;

    btn.addEventListener("click", injectModal);
  });
})();
