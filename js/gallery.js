/* ============================================
   Miss Chooloub — DYNAMIC GALLERY & LIGHTBOX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.gallery-grid');
  const tabs = document.querySelectorAll('.filter-tab');
  
  if (!grid || !window.GALLERY_VIDEOS || !window.GALLERY_IMAGES) return;

  let currentFilter = 'all';
  let displayedCount = 0;
  const ITEMS_PER_PAGE = 27;
  let allMediaItems = [];
  let filteredItems = [];

  // Build combined dataset
  const videos = window.GALLERY_VIDEOS || [];
  const images = window.GALLERY_IMAGES || [];

  // Pure photo dataset
  allMediaItems = [...images];

  // Fisher-Yates Random Shuffle so media appears in random order each load!
  for (let i = allMediaItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allMediaItems[i], allMediaItems[j]] = [allMediaItems[j], allMediaItems[i]];
  }

  // Create Lightbox Modal element
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'media-modal-overlay';
  modalOverlay.innerHTML = `
    <button class="media-modal-close" aria-label="Close modal">&times;</button>
    <button class="media-modal-nav media-modal-prev" aria-label="Previous">&larr;</button>
    <button class="media-modal-nav media-modal-next" aria-label="Next">&rarr;</button>
    <div class="media-modal-container">
      <div class="media-modal-body"></div>
      <div class="media-modal-meta">
        <a href="https://www.patreon.com/chooloub" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 0.5rem 1.2rem; font-size: 11px;">GET FULL CONTENT ON PATREON &rarr;</a>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalBody = modalOverlay.querySelector('.media-modal-body');
  const closeBtn = modalOverlay.querySelector('.media-modal-close');
  const prevBtn = modalOverlay.querySelector('.media-modal-prev');
  const nextBtn = modalOverlay.querySelector('.media-modal-next');

  let currentModalIndex = -1;

  function openModal(index) {
    if (index < 0 || index >= filteredItems.length) return;
    currentModalIndex = index;
    const item = filteredItems[index];

    modalBody.innerHTML = '';
    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      modalBody.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = "Miss Chooloub Media";
      modalBody.appendChild(img);
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  prevBtn.addEventListener('click', () => {
    if (currentModalIndex > 0) openModal(currentModalIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentModalIndex < filteredItems.length - 1) openModal(currentModalIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentModalIndex > 0) openModal(currentModalIndex - 1);
    if (e.key === 'ArrowRight' && currentModalIndex < filteredItems.length - 1) openModal(currentModalIndex + 1);
  });

  // Create Load More container
  let loadMoreContainer = document.querySelector('.gallery-load-more-container');
  if (!loadMoreContainer) {
    loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'gallery-load-more-container';
    grid.after(loadMoreContainer);
  }

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className = 'btn-load-more';
  loadMoreBtn.textContent = 'LOAD MORE CONTENT';
  loadMoreContainer.appendChild(loadMoreBtn);

  function renderBatch() {
    const nextItems = filteredItems.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);
    
    nextItems.forEach((item, batchIdx) => {
      const globalIdx = displayedCount + batchIdx;
      const tile = document.createElement('div');
      tile.className = `gallery-tile ${item.type === 'video' ? 'gallery-tile--video' : ''}`;
      tile.dataset.category = item.category;

      if (item.type === 'video') {
        tile.innerHTML = `
          <video src="${item.src}" poster="${item.poster || \'\'}" preload="metadata" muted loop playsinline></video>
          <div class="gallery-play-icon">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="gallery-tile-overlay">
            <span class="gallery-tile-caption">Play Video →</span>
          </div>
        `;
        const vid = tile.querySelector('video');
        tile.addEventListener('mouseenter', () => vid.play().catch(() => {}));
        tile.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
      } else {
        tile.innerHTML = `
          <img src="${item.src}" alt="Miss Chooloub Media" loading="eager">
          <div class="gallery-tile-overlay">
            <span class="gallery-tile-caption">View →</span>
          </div>
        `;
      }

      tile.addEventListener('click', () => openModal(globalIdx));
      grid.appendChild(tile);
    });

    displayedCount += nextItems.length;

    if (displayedCount >= filteredItems.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }

  function applyFilter(filter) {
    currentFilter = filter;
    grid.innerHTML = '';
    displayedCount = 0;

    if (filter === 'all') {
      filteredItems = [...allMediaItems];
    } else {
      filteredItems = allMediaItems.filter(item => item.category === filter || item.type === filter);
    }

    renderBatch();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.filter);
    });
  });

  loadMoreBtn.addEventListener('click', renderBatch);

  // Initial render with random shuffle
  applyFilter('all');
});
