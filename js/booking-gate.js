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

  btnRulesYes.addEventListener('click', () => {
    // Hide modal
    rulesModal.style.display = 'none';
    
    // Show form container
    standardFormContainer.style.display = 'block';
    
    // Load tally form
    if (!standardTally.src || standardTally.src === 'about:blank' || standardTally.src.endsWith('about:blank')) {
      standardTally.src = standardTally.dataset.src;
    }
  });

  btnRulesNo.addEventListener('click', () => {
    window.location.href = 'rules.html';
  });

});
