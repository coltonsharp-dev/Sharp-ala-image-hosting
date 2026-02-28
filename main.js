/* ==========================================================
   ALA Cards Carousel with circular avatars + reactive glow
   - Square images: auto circular.
   - Wide panoramas (~19:6): auto-detect, crop to upper half,
     then circular, matching the standard look.
   - Glow reacts to pointer/touch and gently breathes.
   ========================================================== */

/* ---------- Image base folder (raw GitHub) ---------- */
const BASE_IMG_DIR = "https://raw.githubusercontent.com/coltonsharp-dev/Sharp-ala-image-hosting/main/";

/* ---------- Fallbacks ---------- */
const LOGO_URL_FALLBACK =
  "https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1748388507/alaschoolsorg/e03t6vb0x6rayligspcp/DefendersLogo-8.png";
const BADGE_FALLBACK_TEXT = "ALA";

/* ---------- Your 11 students with the provided file names ---------- */
const CARDS = [
  { nameFirst: "Noah",    nameLast: "Baker",       pen: "https://codepen.io/NoahBaker2025/full/jEWZjKx",    tag: "Project", img: "176DA72F-8559-415F-BAD3-9C74E7CFF6BB.png" },
  { nameFirst: "Noemi",   nameLast: "Gradinariu",  pen: "https://codepen.io/EntropyReversed/pen/QwybYEJ",  tag: "Project", img: "29DFC0BF-CBA9-4F02-AAF6-454B6AE8471B.png" },
  { nameFirst: "Patricia",nameLast: "Gradinariu",  pen: "https://codepen.io/patriciagradinariu/full/YPwGbEb", tag: "Project", img: "44895920-FE8C-48F8-85F4-9BA3F032C559.png" },
  { nameFirst: "YUN KAI", nameLast: "HU",          pen: "https://codepen.io/Yunkai-H2025-74229/full/EaPQzrR", tag: "Project", img: "50EEA593-6B52-445F-88C2-4DA740E95B3F.png" },
  { nameFirst: "Steven",  nameLast: "Myers",       pen: "https://codepen.io/Shmavey50/full/xbZYLeL",       tag: "Project", img: "7D2AD359-556A-4849-A744-E9732213F356.png" },
  { nameFirst: "Levi",    nameLast: "Neypes",      pen: "https://codepen.io/LN_Osamufurr/full/WbryBpL",    tag: "Project", img: "8E93D31E-1516-4BA4-8D12-912ED4366648.png" },
  { nameFirst: "Caleb",   nameLast: "Palmer",      pen: "https://codepen.io/calebp2025/full/myVrYRZ",      tag: "Project", img: "981EC5CC-7D6A-478C-BD17-7368F7A58BCA.png" },
  { nameFirst: "Rishwika",nameLast: "Pembarthi",   pen: "https://codepen.io/Rishwika/full/PwZQvyw",        tag: "Project", img: "ADB2D1FB-00EC-4858-8A61-79E9D7C4C63C.png" },
  { nameFirst: "Isaac",   nameLast: "Proctor",     pen: "https://codepen.io/IsaacProctor2025/full/qEbxGQJ", tag: "Project", img: "B884B8B4-01A5-4A37-BA56-D3C6930394F0.png" },
  { nameFirst: "Daxton",  nameLast: "Ulrich",      pen: "https://codepen.io/daxton123/full/qEbxzdv",       tag: "Project", img: "C2715C9D-2E3A-4EDC-8508-EEBB0C3B7317.png" },
  { nameFirst: "Xavier",  nameLast: "Valenzuela",  pen: "https://codepen.io/Xavier-Valenzuela/full/XJXjwpV", tag: "Project", img: "CF9A1E1F-E61C-47FE-97C6-5F13E3641E23.png" }
];

const cardsUL = document.getElementById("cards");
const imgURL = (file) => BASE_IMG_DIR + encodeURIComponent(file);

/* ---------- Build markup ---------- */
cardsUL.innerHTML = CARDS.map((c, i) => {
  const lastInitial = (c.nameLast || "").toUpperCase().slice(0, 1);
  const mainImgSrc = c.img ? imgURL(c.img) : LOGO_URL_FALLBACK;
  const badgeSrc = c.img ? mainImgSrc : null;

  return `
    <li data-index="${i}" data-pen="${encodeURI(c.pen)}" aria-roledescription="slide">
      <div class="card-top">
        <span class="bear-badge" aria-hidden="true">
          ${badgeSrc
            ? `<img src="${badgeSrc}" alt="" loading="lazy" decoding="async"
                 onerror="this.remove(); this.parentElement.insertAdjacentHTML('beforeend','<span class=&quot;badge-fallback&quot;>${BADGE_FALLBACK_TEXT}</span>')" />`
            : `<span class="badge-fallback">${BADGE_FALLBACK_TEXT}</span>`}
        </span>
        <div class="title"><span>ALA</span><span class="dash"></span><span>Bear</span></div>
        <div class="name">${c.nameFirst} ${lastInitial}.</div>
      </div>

      <div class="thumb">
        <div class="avatar-wrap">
          <img
            class="avatar"
            src="${mainImgSrc}"
            alt="${c.img ? `${c.nameFirst} ${c.nameLast} photo` : 'ALA Defenders Logo'}"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div class="card-bottom">
        <button class="cta" type="button" aria-label="Open ${c.nameFirst} ${c.nameLast} project">Open Pen</button>
        <div class="meta">${c.tag || "Project"}</div>
      </div>
    </li>
  `;
}).join("");

/* ---------- Interactions ---------- */
const $cards = Array.from(document.querySelectorAll(".cards li"));

/* CTA -> open CodePen */
cardsUL.addEventListener("click", (e) => {
  const cta = e.target.closest(".cta");
  if (!cta) return;
  const li = e.target.closest("li");
  const url = li?.dataset?.pen;
  if (url) window.open(url, "_blank", "noopener");
});

/* Reactive glow: track pointer per card */
$cards.forEach((card) => {
  const thumb = card.querySelector(".thumb");
  const setXY = (x, y) => {
    const rect = thumb.getBoundingClientRect();
    const mx = ((x - rect.left) / rect.width) * 100;
    const my = ((y - rect.top) / rect.height) * 100;
    thumb.style.setProperty("--mx", mx + "%");
    thumb.style.setProperty("--my", my + "%");
  };
  thumb.addEventListener("mousemove", (e) => setXY(e.clientX, e.clientY));
  thumb.addEventListener("touchmove", (e) => {
    const t = e.touches[0]; if (t) setXY(t.clientX, t.clientY);
  }, { passive: true });
  // initial center
  setXY(thumb.getBoundingClientRect().left + thumb.offsetWidth/2,
        thumb.getBoundingClientRect().top + thumb.offsetHeight/2);
});

/* Auto-detect panoramas and bias crop to upper half for round avatar */
document.querySelectorAll(".avatar").forEach((img) => {
  if (img.complete) handleAspect(img);
  else img.addEventListener("load", () => handleAspect(img), { once: true });

  // If it fails, fall back gracefully
  img.addEventListener("error", () => { img.src = LOGO_URL_FALLBACK; });
});

function handleAspect(img){
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) return;
  const ratio = w / h;
  // treat super-wide images as panoramas (e.g., >= 2.6 ~ 19:7; 19:6 is ~3.17)
  if (ratio >= 2.6){
    img.classList.add("is-pano");   // object-position: 50% 20% via CSS
  } else {
    img.classList.remove("is-pano"); // normal square/portrait cover
  }
}

/* ---------- GSAP carousel (same as before) ---------- */
const hasGSAP = typeof gsap !== "undefined";
const hasST   = hasGSAP && typeof ScrollTrigger !== "undefined";
const hasDrag = hasGSAP && typeof Draggable !== "undefined";

if (!(hasGSAP && hasST)) {
  // Simple fallback
  let idx = 0;
  const show = (i) =>
    $cards.forEach((el, k) => {
      el.style.zIndex = k === i ? 10 : 1;
      el.style.opacity = k === i ? 1 : 0;
      el.style.transform = k === i ? "scale(1)" : "scale(0.92)";
    });
  show(idx);
  document.querySelector(".prev")?.addEventListener("click", () => { idx = (idx - 1 + $cards.length) % $cards.length; show(idx); });
  document.querySelector(".next")?.addEventListener("click", () => { idx = (idx + 1) % $cards.length; show(idx); });
} else {
  gsap.registerPlugin(ScrollTrigger); if (hasDrag) gsap.registerPlugin(Draggable);
  let iteration = 0; const spacing = 0.13; const snapTime = gsap.utils.snap(spacing);
  gsap.set($cards, { xPercent: 400, opacity: 0, scale: 0.9 });

  const animateFunc = (el) =>
    gsap.timeline()
      .fromTo(el, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.45, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false })
      .fromTo(el, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, 0);

  const seamlessLoop = buildSeamlessLoop($cards, spacing, animateFunc);
  const playhead = { offset: 0 };
  const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
  const scrub = gsap.to(playhead, { offset: 0, onUpdate(){ seamlessLoop.time(wrapTime(playhead.offset)); }, duration: 0.5, ease: "power3", paused: true });

  const trigger = ScrollTrigger.create({
    start: 0, end: "+=3000", pin: ".gallery",
    onUpdate(self){
      const scroll = self.scroll();
      if (scroll > self.end - 1) wrap(1, 2);
      else if (scroll < 1 && self.direction < 0) wrap(-1, self.end - 2);
      else { scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration(); scrub.invalidate().restart(); }
    }
  });

  const progressToScroll = (p) => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, p) * trigger.end);
  function wrap(iterDelta, scrollTo){ iteration += iterDelta; trigger.scroll(scrollTo); trigger.update(); }
  function scrollToOffset(offset){
    const snappedTime = snapTime(offset);
    const progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
    const scroll = progressToScroll(progress);
    if (progress >= 1 || progress < 0) return wrap(Math.floor(progress), scroll);
    trigger.scroll(scroll);
  }

  ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));
  document.querySelector(".prev")?.addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));
  document.querySelector(".next")?.addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));

  if (hasDrag){
    Draggable.create(".drag-proxy", {
      type:"x", trigger:".cards",
      onPress(){ this.startOffset = scrub.vars.offset; },
      onDrag(){ scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001; scrub.invalidate().restart(); },
      onDragEnd(){ scrollToOffset(scrub.vars.offset); }
    });
  }

  function buildSeamlessLoop(items, spacing, animateFunc){
    const overlap = Math.ceil(1 / spacing);
    const startTime = items.length * spacing + 0.5;
    const loopTime = (items.length + overlap) * spacing + 1;
    const raw = gsap.timeline({ paused:true });
    const loop = gsap.timeline({ paused:true, repeat:-1, onRepeat(){ this._time===this._dur && (this._tTime += this._dur - 0.01); } });
    const L = items.length + overlap * 2;
    for (let i=0;i<L;i++){
      const idx = i % items.length; const t = i * spacing;
      raw.add(animateFunc(items[idx]), t);
      if (i <= items.length) loop.add("label"+i, t);
    }
    raw.time(startTime);
    loop.to(raw, { time: loopTime, duration: loopTime - startTime, ease:"none" })
        .fromTo(raw, { time: overlap*spacing + 1 }, { time: startTime, duration: startTime - (overlap*spacing + 1), immediateRender:false, ease:"none" });
    return loop;
  }
}
