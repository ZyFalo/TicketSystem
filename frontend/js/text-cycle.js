// ═══════════════════════════════════════════════════════
// Animated Text Cycle — blur + slide + fade
// ═══════════════════════════════════════════════════════

export function initTextCycle(el, words, interval = 3000) {
  if (!el || !words || words.length === 0) return;

  let currentIndex = 0;

  // Create measurement container
  const measure = document.createElement('div');
  measure.className = 'text-cycle-measure';
  measure.setAttribute('aria-hidden', 'true');
  words.forEach(w => {
    const span = document.createElement('span');
    span.className = 'text-cycle-word';
    span.textContent = w;
    measure.appendChild(span);
  });
  el.parentElement.appendChild(measure);

  // Set initial word
  const wordEl = document.createElement('span');
  wordEl.className = 'text-cycle-word text-cycle-enter';
  wordEl.textContent = words[0];
  el.appendChild(wordEl);

  // Set initial width
  const firstMeasure = measure.children[0];
  if (firstMeasure) {
    el.style.width = firstMeasure.getBoundingClientRect().width + 'px';
  }

  setInterval(() => {
    const current = el.querySelector('.text-cycle-word');
    if (!current) return;

    // Exit current
    current.classList.remove('text-cycle-enter');
    current.classList.add('text-cycle-exit');

    current.addEventListener('animationend', function handler() {
      current.removeEventListener('animationend', handler);
      current.remove();
    });

    // Enter next
    currentIndex = (currentIndex + 1) % words.length;

    const next = document.createElement('span');
    next.className = 'text-cycle-word text-cycle-enter';
    next.textContent = words[currentIndex];
    el.appendChild(next);

    // Animate width
    const measured = measure.children[currentIndex];
    if (measured) {
      el.style.width = measured.getBoundingClientRect().width + 'px';
    }
  }, interval);
}
