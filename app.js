const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const whatsNumber = "5531982363217";

const detailModal = document.getElementById("detailModal");
const detailImg = document.getElementById("detailImg");
const detailTitle = document.getElementById("detailTitle");
const detailDesc = document.getElementById("detailDesc");
const detailPrice = document.getElementById("detailPrice");
const detailBuyBtn = document.getElementById("detailBuyBtn");
const detailBadge = document.getElementById("detailBadge");
const detailImageWrapper = document.getElementById("detailImageWrapper");
const detailContent = document.getElementById("detailContent");
const btnPrev = document.querySelector(".detail-modal__nav.prev");
const btnNext = document.querySelector(".detail-modal__nav.next");

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

document.getElementById("year").textContent = new Date().getFullYear();

let currentList = [...products];
let currentIndex = 0;

document.getElementById("nav-catalogo").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (history.replaceState) history.replaceState(null, "", window.location.pathname);
});

/* ─────────────────────────────────────────────
   Render Grid
───────────────────────────────────────────── */
function render(list) {
  currentList = list;
  grid.innerHTML = "";

  list.forEach((p, index) => {
    const card = document.createElement("article");
    card.className = "card";
    const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
    const msg = encodeURIComponent(`Olá! Tenho interesse na "${p.name}" (${p.price}).`);

    card.innerHTML = `
      <div class="card__image">
        ${badge}
        <img src="${p.file}" alt="${p.name}" loading="lazy" draggable="false" />
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__footer">
          <div class="price">${p.price}<small>à vista</small></div>
          <a class="btn-whats" href="https://wa.me/${whatsNumber}?text=${msg}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Comprar
          </a>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-whats")) return;
      openDetailModal(index);
    });

    grid.appendChild(card);
  });
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  filters.querySelectorAll("button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  render(f === "all" ? products : products.filter(p => p.tag === f));
});

/* ─────────────────────────────────────────────
   Detail Modal Logic
───────────────────────────────────────────── */
function updateDetailContent() {
  const p = currentList[currentIndex];
  if (!p) return;

  detailImg.src = p.file;
  detailImg.alt = p.name;
  detailTitle.textContent = p.name;
  detailDesc.textContent = p.desc;
  detailPrice.innerHTML = `${p.price}<small>à vista</small>`;

  if (p.badge) {
    detailBadge.textContent = p.badge;
    detailBadge.style.display = "inline-block";
  } else {
    detailBadge.style.display = "none";
  }

  const msg = encodeURIComponent(`Olá! Tenho interesse na "${p.name}" (${p.price}).`);
  detailBuyBtn.href = `https://wa.me/${whatsNumber}?text=${msg}`;

  detailContent.scrollTop = 0;
}

function openDetailModal(index) {
  currentIndex = index;
  updateDetailContent();
  detailModal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeDetailModal() {
  detailModal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

function navigateDetail(dir) {
  if (currentList.length === 0) return;
  currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
  updateDetailContent();
}

document.querySelector(".detail-modal__close").addEventListener("click", closeDetailModal);
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) closeDetailModal();
});

btnPrev.addEventListener("click", (e) => { e.stopPropagation(); navigateDetail(-1); });
btnNext.addEventListener("click", (e) => { e.stopPropagation(); navigateDetail(1); });

detailImageWrapper.addEventListener("click", () => {
  const p = currentList[currentIndex];
  if (p) openLightbox(p.file, p.name);
});

let swipeStartX = 0;
let swipeStartY = 0;
let isSwiping = false;

detailContent.addEventListener("touchstart", (e) => {
  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
  isSwiping = false;
}, { passive: true });

detailContent.addEventListener("touchmove", (e) => {
  if (e.touches.length > 1) return;
  const dx = e.touches[0].clientX - swipeStartX;
  const dy = e.touches[0].clientY - swipeStartY;

  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    isSwiping = true;
  }
}, { passive: true });

detailContent.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  const dx = e.changedTouches[0].clientX - swipeStartX;

  if (dx > 50) {
    navigateDetail(-1);
  } else if (dx < -50) {
    navigateDetail(1);
  }
  isSwiping = false;
}, { passive: true });

let isMouseDown = false;
detailContent.addEventListener("mousedown", (e) => {
  if (e.target.closest("a, button")) return;
  isMouseDown = true;
  swipeStartX = e.clientX;
  swipeStartY = e.clientY;
  isSwiping = false;
});

window.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  const dx = e.clientX - swipeStartX;
  const dy = e.clientY - swipeStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    isSwiping = true;
  }
});

window.addEventListener("mouseup", (e) => {
  if (!isMouseDown) return;
  isMouseDown = false;
  if (!isSwiping) return;
  const dx = e.clientX - swipeStartX;

  if (dx > 80) {
    navigateDetail(-1);
  } else if (dx < -80) {
    navigateDetail(1);
  }
  isSwiping = false;
});

/* ─────────────────────────────────────────────
   Zoom / Pan state (Lightbox)
───────────────────────────────────────────── */
const MIN_SCALE = 1;
const MAX_SCALE = 5;

let scale = 1;
let tx = 0;
let ty = 0;
let baseW = 0;
let baseH = 0;

let isDragging = false;
let panActive = false;
let lastDragEndTime = 0;
let lastTapTime = 0;

let pinchStartDist = 0;
let pinchStartScale = 1;
let pinchStartTx = 0;
let pinchStartTy = 0;

let panStartX = 0, panStartY = 0, panStartTx = 0, panStartTy = 0;
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
let mouseDown = false, mouseStartX = 0, mouseStartY = 0, mouseStartTx = 0, mouseStartTy = 0;

function vpCenter() {
  return [window.innerWidth / 2, window.innerHeight / 2];
}

function getDist(t1, t2) {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function getMid(touches) {
  let x = 0, y = 0;
  for (const t of touches) { x += t.clientX; y += t.clientY; }
  return { x: x / touches.length, y: y / touches.length };
}

function applyTransform(animate) {
  lightboxImg.style.transition = animate ? "transform 0.22s ease-out" : "none";
  lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  if (scale > 1.001) {
    lightboxImg.classList.add("is-zoomed");
  } else {
    lightboxImg.classList.remove("is-zoomed");
  }
}

function clampTranslation() {
  if (scale <= 1.001) { tx = 0; ty = 0; return; }
  const maxX = Math.max(0, (baseW * scale - window.innerWidth) / 2);
  const maxY = Math.max(0, (baseH * scale - window.innerHeight) / 2);
  tx = Math.max(-maxX, Math.min(maxX, tx));
  ty = Math.max(-maxY, Math.min(maxY, ty));
}

function zoomAtPoint(newScale, px, py, animate) {
  newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
  const k = newScale / scale;
  if (Math.abs(k - 1) < 1e-4) return;
  const [cx, cy] = vpCenter();
  const vx = px - cx, vy = py - cy;
  tx = (1 - k) * vx + k * tx;
  ty = (1 - k) * vy + k * ty;
  scale = newScale;
  clampTranslation();
  applyTransform(animate);
}

function resetZoom(animate) {
  scale = 1;
  tx = 0;
  ty = 0;
  applyTransform(animate);
}

function measureBase() {
  const r = lightboxImg.getBoundingClientRect();
  if (r.width > 0 && r.height > 0) {
    baseW = r.width;
    baseH = r.height;
  }
}

function openLightbox(src, alt) {
  scale = 1;
  tx = 0;
  ty = 0;
  isDragging = false;
  panActive = false;
  mouseDown = false;
  lastTapTime = 0;
  lastDragEndTime = 0;
  lightboxImg.style.transition = "none";
  lightboxImg.style.transform = "translate(0px, 0px) scale(1)";
  lightboxImg.classList.remove("is-zoomed", "is-grabbing");

  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("open");

  if (lightboxImg.complete && lightboxImg.naturalWidth) {
    requestAnimationFrame(() => requestAnimationFrame(measureBase));
  }
}

function closeLightbox() {
  lightbox.classList.remove("open");
  scale = 1;
  tx = 0;
  ty = 0;
  isDragging = false;
  panActive = false;
  mouseDown = false;
  lightboxImg.style.transition = "none";
  lightboxImg.style.transform = "translate(0px, 0px) scale(1)";
  lightboxImg.classList.remove("is-zoomed", "is-grabbing");
  lightboxImg.src = "";
}

lightboxImg.addEventListener("load", () => {
  if (lightbox.classList.contains("open")) {
    requestAnimationFrame(measureBase);
  }
});

lightboxImg.addEventListener("touchstart", (e) => {
  e.stopPropagation();
  if (e.touches.length === 2) {
    e.preventDefault();
    isDragging = false;
    panActive = false;
    lastTapTime = 0;
    pinchStartDist = getDist(e.touches[0], e.touches[1]);
    pinchStartScale = scale;
    pinchStartTx = tx;
    pinchStartTy = ty;
  } else if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isDragging = false;
    if (scale > 1.001) {
      panActive = true;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      panStartTx = tx;
      panStartTy = ty;
    } else {
      panActive = false;
    }
  }
}, { passive: false });

lightboxImg.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    isDragging = true;
    const dist = getDist(e.touches[0], e.touches[1]);
    const mid = getMid(e.touches);
    let ns = pinchStartScale * (dist / pinchStartDist);
    ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, ns));
    const k = ns / pinchStartScale;
    const [cx, cy] = vpCenter();
    tx = (1 - k) * (mid.x - cx) + k * pinchStartTx;
    ty = (1 - k) * (mid.y - cy) + k * pinchStartTy;
    scale = ns;
    clampTranslation();
    applyTransform(false);
  } else if (e.touches.length === 1 && panActive) {
    const dx = e.touches[0].clientX - panStartX;
    const dy = e.touches[0].clientY - panStartY;
    if (!isDragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      isDragging = true;
      lightboxImg.classList.add("is-grabbing");
    }
    if (isDragging) {
      e.preventDefault();
      tx = panStartTx + dx;
      ty = panStartTy + dy;
      clampTranslation();
      applyTransform(false);
    }
  }
}, { passive: false });

lightboxImg.addEventListener("touchend", (e) => {
  if (e.touches.length > 0) return;
  lightboxImg.classList.remove("is-grabbing");
  const duration = Date.now() - touchStartTime;
  if (!isDragging && duration < 300) {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      if (scale > 1.001) { resetZoom(true); } else { zoomAtPoint(2.5, touchStartX, touchStartY, true); }
      lastTapTime = 0;
    } else { lastTapTime = now; }
  }
  if (isDragging) lastDragEndTime = Date.now();
  isDragging = false;
  panActive = false;
  if (scale < 1) resetZoom(true);
}, { passive: false });

lightboxImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
  zoomAtPoint(scale * factor, e.clientX, e.clientY, false);
}, { passive: false });

lightboxImg.addEventListener("mousedown", (e) => {
  if (scale <= 1.001) return;
  e.preventDefault();
  mouseDown = true;
  isDragging = false;
  mouseStartX = e.clientX;
  mouseStartY = e.clientY;
  mouseStartTx = tx;
  mouseStartTy = ty;
});

window.addEventListener("mousemove", (e) => {
  if (!mouseDown) return;
  const dx = e.clientX - mouseStartX;
  const dy = e.clientY - mouseStartY;
  if (!isDragging && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
    isDragging = true;
    lightboxImg.classList.add("is-grabbing");
  }
  if (isDragging) {
    tx = mouseStartTx + dx;
    ty = mouseStartTy + dy;
    clampTranslation();
    applyTransform(false);
  }
});

window.addEventListener("mouseup", () => {
  if (!mouseDown) return;
  mouseDown = false;
  lightboxImg.classList.remove("is-grabbing");
  if (isDragging) lastDragEndTime = Date.now();
  isDragging = false;
});

lightboxImg.addEventListener("dblclick", (e) => {
  e.preventDefault();
  if (scale > 1.001) { resetZoom(true); } else { zoomAtPoint(2.5, e.clientX, e.clientY, true); }
});

lightbox.addEventListener("click", (e) => {
  const isCloseBtn = e.target.classList.contains("lightbox__close");
  const isBackground = e.target === lightbox;
  if (!isCloseBtn && !isBackground) return;
  if (!isCloseBtn && Date.now() - lastDragEndTime < 100) return;
  closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (lightbox.classList.contains("open")) closeLightbox();
    else if (detailModal.classList.contains("open")) closeDetailModal();
  }
});

render(products);