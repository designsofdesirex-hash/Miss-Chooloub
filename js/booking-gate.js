/**
 * booking-gate.js
 * ─────────────────────────────────────────────────────────────
 * Controls the rules check popup and the booking form rendering.
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

  const rulesModal = document.getElementById('rulesModal');
  const btnRulesYes = document.getElementById('btnRulesYes');
  const btnRulesNo = document.getElementById('btnRulesNo');
  const standardFormContainer = document.getElementById('standardFormContainer');
  const standardTally = document.getElementById('standardTally');

  if (!rulesModal) return;

  if (btnRulesYes) {
    btnRulesYes.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide modal
      rulesModal.style.display = 'none';
      
      // Show form container
      if (standardFormContainer) {
        standardFormContainer.style.display = 'block';
      }
      
      // Load tally form
      if (standardTally && (!standardTally.src || standardTally.src === 'about:blank' || standardTally.src.endsWith('about:blank'))) {
        if (standardTally.dataset && standardTally.dataset.src) {
          standardTally.src = standardTally.dataset.src;
        }
      }
    });
  }

  if (btnRulesNo) {
    btnRulesNo.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'rules.html';
    });
  }

});
