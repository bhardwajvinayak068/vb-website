/* =============================================================================
   VB — Growth, Engineered.

   Every effect below is opt-out-first: reduced-motion and touch devices are
   checked before anything is wired up, and each module is independent so a
   failure in one cannot take the page down with it.
   ========================================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)');

const motionOK  = () => !reduceMotion.matches;
const pointerOK = () => finePointer.matches && motionOK();

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* Runs fn, but never lets one broken effect break the rest of the page. */
function safely(name, fn) {
  try { fn(); } catch (err) { console.warn(`[vb] ${name} skipped:`, err); }
}

/* =============================================================================
   LOADER
   Covers the flash of unstyled content only — it never gates real page load,
   and a hard ceiling guarantees it always leaves.
   ========================================================================== */
safely('loader', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const MIN_VISIBLE = 550;   // long enough to read as intentional, not a flicker
  const HARD_CEILING = 2600; // failsafe: the loader always goes away
  const started = performance.now();
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - started));
    setTimeout(() => {
      loader.setAttribute('data-done', '');
      setTimeout(() => loader.remove(), 600);
      document.body.setAttribute('data-ready', '');
    }, wait);
  };

  if (document.readyState === 'complete') dismiss();
  else window.addEventListener('load', dismiss, { once: true });
  setTimeout(dismiss, HARD_CEILING);
});

/* =============================================================================
   NAV
   ========================================================================== */
safely('nav', () => {
  const wrap   = document.querySelector('.nav-wrap');
  const toggle = document.querySelector('.nav__toggle');
  const menu   = document.getElementById('nav-menu');

  // Solidify the bar once the hero starts scrolling away.
  const onScroll = () => {
    if (window.scrollY > 24) wrap.setAttribute('data-scrolled', '');
    else wrap.removeAttribute('data-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close on navigation, on Escape, and on any click outside the panel.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) setOpen(false);
  });
});

/* =============================================================================
   HERO CURSOR REVEAL
   The portrait layer carries a radial mask with a transparent centre; moving
   that centre punches a hole through to the cyborg image underneath. The hole
   eases toward the pointer rather than tracking it exactly, which gives the
   reveal a little weight instead of feeling glued to the cursor.
   ========================================================================== */
safely('hero-reveal', () => {
  const media = document.querySelector('.hero__media');
  if (!media) return;

  const RADIUS = 250;
  let target = { x: 0.5, y: 0.42 };
  let current = { ...target };
  let raf = null;
  let active = false;

  const setRadius = (px) => media.style.setProperty('--reveal-r', `${px}px`);
  const applyPosition = () => {
    media.style.setProperty('--reveal-x', `${current.x * 100}%`);
    media.style.setProperty('--reveal-y', `${current.y * 100}%`);
  };
  applyPosition();

  const tick = () => {
    // ease toward the pointer; 0.14 gives noticeable lag without feeling laggy
    current.x += (target.x - current.x) * 0.14;
    current.y += (target.y - current.y) * 0.14;
    applyPosition();

    const settled = Math.abs(target.x - current.x) < 0.0005 &&
                    Math.abs(target.y - current.y) < 0.0005;
    if (!active && settled) { raf = null; return; }
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (raf === null) raf = requestAnimationFrame(tick); };

  const pointTo = (clientX, clientY) => {
    const r = media.getBoundingClientRect();
    target.x = clamp((clientX - r.left) / r.width, -0.2, 1.2);
    target.y = clamp((clientY - r.top) / r.height, -0.2, 1.2);
  };

  /* --- desktop: hover to reveal --- */
  if (pointerOK()) {
    media.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      active = true;
      // jump the hole to the entry point so it does not sweep across the face
      const r = media.getBoundingClientRect();
      current.x = target.x = clamp((e.clientX - r.left) / r.width, 0, 1);
      current.y = target.y = clamp((e.clientY - r.top) / r.height, 0, 1);
      applyPosition();
      setRadius(RADIUS);
      media.setAttribute('data-revealed', '');
      start();
    });

    media.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !active) return;
      pointTo(e.clientX, e.clientY);
      start();
    }, { passive: true });

    media.addEventListener('pointerleave', () => {
      active = false;
      setRadius(0);
      media.removeAttribute('data-revealed');
    });
  }

  /* --- touch: tap to reveal, plus a one-time drifting hint so the interaction
         is discoverable without a cursor --- */
  if (!finePointer.matches) {
    let hideTimer = null;

    media.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      pointTo(e.clientX, e.clientY);
      current.x = target.x; current.y = target.y;
      applyPosition();
      setRadius(RADIUS);
      media.setAttribute('data-revealed', '');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setRadius(0);
        media.removeAttribute('data-revealed');
      }, 2200);
    }, { passive: true });

    // Auto-hint: one slow drift across the portrait the first time it is seen.
    if (motionOK()) {
      const hint = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        hint.disconnect();
        setTimeout(() => {
          if (media.hasAttribute('data-revealed')) return; // user got there first
          active = true;
          setRadius(RADIUS * 0.8);
          current = { x: 0.28, y: 0.34 };
          target  = { x: 0.72, y: 0.42 };
          applyPosition();
          start();
          setTimeout(() => {
            active = false;
            setRadius(0);
          }, 1900);
        }, 900);
      }, { threshold: 0.5 });
      hint.observe(media);
    }
  }
});

/* =============================================================================
   ABOUT — WORD SCATTER
   Word centres are measured once and cached relative to the paragraph, so a
   pointermove costs one rect read instead of one per word.
   ========================================================================== */
safely('word-scatter', () => {
  const host = document.querySelector('[data-scatter] .about__lead');
  if (!host) return;

  // Split into words, preserving the original text exactly.
  const words = host.textContent.split(/(\s+)/);
  host.textContent = '';
  const frag = document.createDocumentFragment();
  for (const chunk of words) {
    if (/^\s+$/.test(chunk)) { frag.append(chunk); continue; }
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = chunk;
    frag.append(span);
  }
  host.append(frag);

  if (!pointerOK()) return;

  const spans = [...host.querySelectorAll('.w')];
  let hostRect = null;
  let centres = [];

  const measure = () => {
    hostRect = host.getBoundingClientRect();
    centres = spans.map((s) => {
      const r = s.getBoundingClientRect();
      return { x: r.left - hostRect.left + r.width / 2,
               y: r.top - hostRect.top + r.height / 2 };
    });
  };

  const RADIUS = 105;
  const PUSH = 17;
  let pending = null;

  const apply = (px, py) => {
    for (let i = 0; i < spans.length; i++) {
      const c = centres[i];
      const dx = c.x - px;
      const dy = c.y - py;
      const dist = Math.hypot(dx, dy) || 1;
      const span = spans[i];
      if (dist < RADIUS) {
        const force = ((RADIUS - dist) / RADIUS) * PUSH;
        span.style.transform = `translate(${(dx / dist) * force}px, ${(dy / dist) * force}px)`;
        if (!span.hasAttribute('data-near')) span.setAttribute('data-near', '');
      } else if (span.style.transform) {
        span.style.transform = '';
        span.removeAttribute('data-near');
      }
    }
  };

  const reset = () => {
    for (const s of spans) { s.style.transform = ''; s.removeAttribute('data-near'); }
  };

  host.addEventListener('pointerenter', measure);
  host.addEventListener('pointermove', (e) => {
    if (!hostRect) measure();
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = null;
      const r = host.getBoundingClientRect(); // cheap: one read per frame
      apply(e.clientX - r.left, e.clientY - r.top);
    });
  }, { passive: true });
  host.addEventListener('pointerleave', reset);

  window.addEventListener('resize', () => { hostRect = null; reset(); }, { passive: true });
});

/* =============================================================================
   CURSOR COMET TRAIL
   A chain of dots, each easing toward the one ahead of it, so the tail whips
   rather than sliding as a rigid unit. Hidden over the hero.
   ========================================================================== */
safely('cursor-trail', () => {
  const host = document.getElementById('cursor-trail');
  const hero = document.querySelector('.hero');
  if (!host || !pointerOK()) return;

  const COUNT = 10;
  const dots = [];

  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const el = document.createElement('div');
    el.className = 'trail-dot';
    el.style.opacity = String(0.55 * (1 - t) ** 1.4);
    dots.push({ el, x: -100, y: -100, scale: 1 - t * 0.8 });
    host.append(el);
  }

  let mx = -100, my = -100;
  let seen = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!seen) { // avoid a whip-in from offscreen on the very first move
      seen = true;
      for (const d of dots) { d.x = mx; d.y = my; }
    }
    if (hero) {
      const r = hero.getBoundingClientRect();
      const over = e.clientY >= r.top && e.clientY <= r.bottom &&
                   e.clientX >= r.left && e.clientX <= r.right;
      host.toggleAttribute('data-hidden', over);
    }
  }, { passive: true });

  const frame = () => {
    let tx = mx, ty = my;
    for (const d of dots) {
      d.x += (tx - d.x) * 0.32;
      d.y += (ty - d.y) * 0.32;
      d.el.style.transform =
        `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%) scale(${d.scale})`;
      tx = d.x; ty = d.y;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});

/* =============================================================================
   SERVICE CARDS — TILT
   anime.js's layout FLIP takes full ownership of `transform` on the cards, so
   a transform-based tilt gets wiped mid-expand. The tilt therefore uses the
   independent `rotate` property, which composes with anime's transform instead
   of competing for it. Perspective comes from the slot.

   rotateX(a) . rotateY(b) is, for the small angles used here, indistinguishable
   from a single rotation about the axis (a, b, 0) — so it maps cleanly onto the
   axis-angle form `rotate` expects.
   ========================================================================== */
safely('card-tilt', () => {
  if (!pointerOK()) return;

  const MAX = 5; // degrees — restrained on purpose; the grid already reflows

  for (const card of document.querySelectorAll('.card')) {
    let pending = null;

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || pending) return;
      pending = requestAnimationFrame(() => {
        pending = null;
        const r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;

        const ax = -py, ay = px;              // rotation axis
        const mag = Math.hypot(ax, ay);
        if (mag < 0.004) { card.style.rotate = ''; return; }
        card.style.rotate =
          `${(ax / mag).toFixed(4)} ${(ay / mag).toFixed(4)} 0 ` +
          `${(mag * MAX).toFixed(2)}deg`;
      });
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      if (pending) { cancelAnimationFrame(pending); pending = null; }
      card.style.rotate = '';
    });
  }
});

/* =============================================================================
   SERVICE CARDS — EXPAND ON HOVER (anime.js layout diffing)
   Hovering widens a card by one grid column and shrinks its row-mates to match,
   so the row total stays constant and nothing ever wraps mid-hover. anime.js
   records the before/after boxes and animates the difference.
   ========================================================================== */
safely('card-layout', async () => {
  const grid = document.getElementById('services-grid');
  if (!grid || !pointerOK()) return;
  if (!window.matchMedia('(min-width: 1001px)').matches) return;

  // anime.js is ~116 KB for one hover flourish, so it stays off the critical
  // path until the services grid is actually approached.
  await new Promise((resolve) => {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      resolve();
    }, { rootMargin: '400px 0px' });
    io.observe(grid);
  });

  const { createLayout } = await import('./vendor/anime.esm.min.js');
  const layout = createLayout(grid);

  const slots = [...grid.querySelectorAll('.card-slot')];
  const rowOf = (slot) => slot.dataset.row;

  // base spans match the CSS: row 1 = 8/8/8, row 2 = 6/6/6/6 (24 columns)
  const BASE = { 1: 8, 2: 6 };

  let currentHover = null;
  let debounce = null;

  /* Each row-mate gives up exactly one column and the hovered card absorbs all
     of them, so the row always totals 24 with whole columns and never wraps.
     Row 1: 8/8/8 -> 10/7/7.  Row 2: 6/6/6/6 -> 9/5/5/5. */
  const spansFor = (hovered) => {
    const map = new Map();
    for (const row of ['1', '2']) {
      const inRow = slots.filter((s) => rowOf(s) === row);
      const base = BASE[row];
      const hot = hovered && rowOf(hovered) === row;
      for (const s of inRow) {
        if (!hot) map.set(s, base);
        else if (s === hovered) map.set(s, base + (inRow.length - 1));
        else map.set(s, base - 1);
      }
    }
    return map;
  };

  const applyHover = (hovered) => {
    if (hovered === currentHover) return;
    currentHover = hovered;
    const spans = spansFor(hovered);
    layout.update(() => {
      for (const [slot, span] of spans) {
        slot.style.gridColumn = `span ${span}`;
      }
    }, { duration: 360, ease: 'out(3)' });
  };

  for (const slot of slots) {
    slot.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(debounce);
      // small delay so sweeping the cursor across the grid does not thrash it
      debounce = setTimeout(() => applyHover(slot), 60);
    });
  }
  grid.addEventListener('pointerleave', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => applyHover(null), 60);
  });
});

/* =============================================================================
   SCROLL REVEAL + PARALLAX
   ========================================================================== */
safely('scroll-reveal', () => {
  const targets = [
    ...document.querySelectorAll('.section__head, .card-slot, .proof, .shot, .self-callout, .about__body, .about__note, .work__group-title'),
  ];
  if (!motionOK()) return;

  for (const el of targets) el.setAttribute('data-inview', '');

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      // stagger within a row, capped so nothing waits long enough to feel slow
      const peers = el.parentElement ? [...el.parentElement.children] : [el];
      const idx = Math.min(peers.indexOf(el), 4);
      el.style.transitionDelay = `${idx * 55}ms`;
      el.setAttribute('data-inview', 'in');
      io.unobserve(el);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  for (const el of targets) io.observe(el);
});

safely('parallax', () => {
  if (!motionOK() || !finePointer.matches) return;

  const layers = [
    { el: document.querySelector('.hero__media'), depth: 0.12 },
    { el: document.querySelector('.page-texture'), depth: 0.03 },
  ].filter((l) => l.el);
  if (!layers.length) return;

  let pending = false;
  const update = () => {
    pending = false;
    const y = window.scrollY;
    for (const l of layers) {
      l.el.style.setProperty('translate', `0 ${(y * l.depth).toFixed(1)}px`);
    }
  };
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
});

/* =============================================================================
   CTA BACKGROUND VIDEO
   The static poster ships by default; the 1.5 MB loop is only fetched when the
   section is actually approached, and never under reduced-motion or Save-Data.
   ========================================================================== */
safely('cta-video', () => {
  const video = document.querySelector('.cta__video');
  if (!video) return;

  const saveData = navigator.connection && navigator.connection.saveData;
  const wantsLoop = motionOK() && !saveData;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // The poster is the shipped default; even the static image waits until
        // the section is approached rather than loading with the page.
        if (!video.poster) video.poster = video.dataset.poster;
        if (!wantsLoop) { io.disconnect(); return; }
        video.preload = 'auto';
        video.play().catch(() => { /* autoplay refused — poster stands in */ });
      } else if (wantsLoop) {
        video.pause();
      }
    }
  }, { rootMargin: '300px 0px' });
  io.observe(video);
});

/* =============================================================================
   MISC
   ========================================================================== */
safely('year', () => {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
});
