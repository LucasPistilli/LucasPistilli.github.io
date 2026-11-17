/* =========================================================
   Portfólio v2 — Lucas Neres Pistilli
   Textos: data/content.json, data/projects.json, data/sections.json
   ========================================================= */
(async () => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sst = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q = new URLSearchParams(location.search);
const cur = {anchor: 'hero'}; let screenKey = '', bhReady = false;

/* ================= dados ================= */
let C, P, S;
try {
  [C, P, S] = await Promise.all(['data/content.json', 'data/projects.json', 'data/sections.json'].map(u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); })));
} catch (e) {
  document.body.classList.remove('is-loading'); $('#loader').remove();
  document.body.prepend(el('p', 'mono', 'Não foi possível carregar os arquivos de data/. Abra o site por um servidor local (ex.: npx serve) em vez de abrir o arquivo direto.'));
  return;
}
const PROJECTS = P.projects || [];
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
$$('[data-c]').forEach(n => { const v = get(C, n.dataset.c); if (v != null) n.textContent = v; });
$$('[data-s]').forEach(n => { const v = get(S, n.dataset.s); if (v != null) n.textContent = v; });
const title = (id, a, b) => { const h = document.getElementById(id); if (!h) return; h.textContent = ''; h.append(a + ' '); const em = el('em', '', b); h.append(em); };
const stackAll = Object.values(C.stack || {}).flat();
const GEN = S.assets || {};
if (GEN.objects) document.documentElement.style.setProperty('--sprite', `url("${GEN.objects}")`);
const ct = C.contact || {};
const linkFor = key => key === 'github' ? ct.github : key === 'linkedin' ? ct.linkedin : key === 'email' ? (ct.email ? 'mailto:' + ct.email : null)
  : key.startsWith('repo:') ? (PROJECTS.find(p => p.id === key.slice(5)) || {}).repo : key;

/* ================= carregamento ================= */
const FR_N = 36, FPS = 12, SRC_W = 1280, SRC_H = 720, HOLE = {x: 641, y: 368};
const ringR = T => 120 + 7.4 * T;
const frames = new Array(FR_N); let loaded = 0;
const loadFrame = i => new Promise(res => { const im = new Image(); im.decoding = 'async';
  im.onload = () => { frames[i] = im; loaded++; res(); }; im.onerror = () => { loaded++; res(); }; im.src = `assets/hero-frames/f${String(i + 1).padStart(3, '0')}.webp`; });
(() => {
  const pct = $('#loader-pct'), msg = $('#loader-msg'), msgs = S.loader || [''];
  let shown = 0, mi = 0; msg.textContent = msgs[0];
  const iv = setInterval(() => { mi = (mi + 1) % msgs.length; msg.textContent = msgs[mi]; }, 900);
  const all = Promise.all(Array.from({length: FR_N}, (_, i) => loadFrame(i)));
  const done = () => { clearInterval(iv); pct.textContent = 100; $('#loader').classList.add('is-done'); document.body.classList.remove('is-loading'); window.__ready = true; };
  (function tick(){ const target = Math.round(loaded / FR_N * 100); shown += Math.ceil((target - shown) * .2); pct.textContent = shown; if (shown < 100) requestAnimationFrame(tick); })();
  Promise.race([Promise.all([all, document.fonts.ready]), new Promise(r => setTimeout(r, 5000))]).then(() => setTimeout(done, 250));
})();

/* ================= navegação ================= */
(() => {
  const links = $('#nav-links'), sheetL = $('#navsheet-links'), sheet = $('#navsheet'), burger = $('#burger');
  (S.nav || []).forEach(n => {
    const li = el('li'), a = el('a', '', n.label); a.href = '#' + n.target; li.append(a); links.append(li);
    const li2 = el('li'), a2 = el('a', '', n.label); a2.href = '#' + n.target; li2.append(a2); sheetL.append(li2);
  });
  const toggle = open => { burger.setAttribute('aria-expanded', open); sheet.hidden = !open; document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => toggle(sheet.hidden));
  sheetL.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  const nav = $('#nav'); let lastY = scrollY;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('is-hidden', y > 300 && y > lastY + 4 && sheet.hidden); if (y < lastY - 4 || y < 300) nav.classList.remove('is-hidden'); lastY = y; }, {passive: true});
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('is-on', a.hash === '#' + e.target.id)); }), {rootMargin: '-45% 0px -50% 0px'});
  (S.nav || []).forEach(n => { const s = document.getElementById(n.target); if (s) io.observe(s); });
})();

/* ================= 01 hero ================= */
(() => {
  const h1 = $('#hero-title'); C.name.split(' ').forEach(w => h1.append(el('span', '', w)));
  const H = S.hero || {};
  (H.meta || []).forEach(m => $('#hero-meta').append(el('li', '', m)));
  [['#chip-a', H.chips && H.chips[0]], ['#chip-b', H.chips && H.chips[1]]].forEach(([sel, c]) => { if (!c) return;
    const box = $(sel); box.append(el('span', 'chip-card__ic', c.tag)); const d = el('div'); d.append(el('strong', '', c.title), el('small', '', c.text)); box.append(d); });
  const mq = $('#marquee'); for (let k = 0; k < 4; k++) (H.marquee || []).forEach(w => mq.append(el('span', '', w)));
  if (REDUCED) return;
  const fl = $$('#floaters .fl'), chips = $$('.chip-card');
  addEventListener('pointermove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    fl.forEach(f => { const d = +f.dataset.depth || 1; f.style.setProperty('--px', (-x * 40 * d).toFixed(1) + 'px'); f.style.setProperty('--py', (-y * 30 * d).toFixed(1) + 'px'); }); });
  addEventListener('scroll', () => { const y = scrollY; if (y > innerHeight * 1.2) return;
    chips.forEach((c, i) => c.style.transform = `translateY(${(-y * (i ? .35 : .55)).toFixed(1)}px) rotate(${(i ? 3 : -4) * Math.min(1, y / 400)}deg)`);
    fl.forEach(f => f.style.translate = `0 ${(-y * (+f.dataset.depth || 1) * .5).toFixed(1)}px`); }, {passive: true});
})();

/* ================= 02 processo ================= */
const howSec = $('#processo');
const STEPS = (S.process && S.process.steps) || [];
howSec.style.setProperty('--steps', STEPS.length);
$('#ring-text').textContent = (S.process.ring || '').repeat(2);
$('#how-t').textContent = STEPS.length;
const bars = $('#how-bars'); STEPS.forEach(s => bars.append(el('li', '', s.key)));
const howState = {step: -1, flipT: 1, flipFrom: 0, sub: 0};
function setStep(i, instant){
  if (i === howState.step) return;
  const first = howState.step < 0; howState.step = i; const s = STEPS[i];
  $('#how-n').textContent = i + 1;
  $$('li', bars).forEach((b, k) => b.classList.toggle('is-on', k <= i));
  const h = $('#how-title'), tx = $('#how-text'), pill = $('#how-pill');
  const fill = () => { h.textContent = ''; [...(s.title + ' ').split(' ').filter(Boolean)].forEach(w => { h.append(el('span', 'w', w), ' '); });
    const em = el('em'); s.em.split(' ').forEach(w => em.append(el('span', 'w', w), ' ')); h.append(em); tx.textContent = s.text; pill.textContent = s.pill; };
  if (first || instant || REDUCED){ fill(); return; }
  h.classList.add('is-out'); tx.classList.add('is-fade');
  setTimeout(() => { fill(); h.classList.remove('is-out'); h.classList.add('is-in'); void h.offsetWidth; h.classList.remove('is-in'); tx.classList.remove('is-fade'); }, 330);
  howState.flipT = 0;                                       // o buraco negro gira e troca de tela
}
function howProgress(){ const r = howSec.getBoundingClientRect(), span = howSec.offsetHeight - innerHeight; return clamp(-r.top / span); }
setStep(0, true);

/* ================= 03 bento ================= */
(() => {
  const T = S.bento.tiles, g = $('#bn-grid');
  title('bento-title', S.bento.title, S.bento.em);
  const head = (t, cls) => { const f = document.createDocumentFragment(); const tag = el('p', 'bn__tag'); const i = el('i', '', t.n); tag.append(i, t.tag); f.append(tag, el('h3', 'bn__title', t.title), el('p', 'bn__text', t.text)); return f; };
  const tile = (key, cls) => { const d = el('article', 'bn ' + cls); d.append(head(T[key])); g.append(d); return d; };
  /* back-end */
  const back = tile('back', 'bn--back'); const rs = el('div', 'routes');
  T.back.routes.forEach(([m, p, c]) => { const r = el('div', 'route'); r.append(el('b', '', m), el('span', '', p)); const em = el('em', 'pend', '···'); em.dataset.code = c; r.append(em); rs.append(r); });
  back.append(rs); const big = el('p', 'bn__big', String(stackAll.length).padStart(2, '0')); big.append(el('small', '', 'TECNOLOGIAS NA STACK')); back.append(big);
  /* front-end */
  const front = tile('front', 'bn--front'); const w = el('div', 'wire'); for (let i = 0; i < 6; i++) w.append(el('i')); front.append(w);
  /* banco */
  const db = tile('db', 'bn--db'); const sc = el('div', 'schema');
  sc.innerHTML = '<svg viewBox="0 0 200 200"><defs><path id="dbp" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs><circle cx="100" cy="100" r="88" fill="none" stroke="#170a02" stroke-width="2" stroke-dasharray="4 7"/><text font-family="JetBrains Mono" font-size="13" letter-spacing="3" fill="#170a02"><textPath href="#dbp">DESPESA · FAMÍLIA · USUÁRIO · PRODUTO · PEDIDO · </textPath></text></svg><b>PG</b>';
  db.append(sc);
  /* typescript */
  const ts = tile('ts', 'bn--ts'); const sq = el('div', 'squig'); sq.innerHTML = 'const total: number = <u>"42"</u>;<small>✗ Type \'string\' is not assignable to type \'number\'.</small>'; ts.append(sq);
  /* python */
  const py = tile('py', 'bn--py'); const art = el('div', 'py-art'); [38, 62, 46, 84, 58, 96, 70].forEach(h => { const i = el('i'); i.style.setProperty('--h', h + 'px'); art.append(i); }); py.append(art);
  /* git */
  const git = tile('git', 'bn--git'); const wrap = el('div'); [...git.childNodes].forEach(n => wrap.append(n)); git.append(wrap);
  const svg = `<svg class="gitgraph" viewBox="0 0 640 150" preserveAspectRatio="none">
    <path class="c" style="--len:640" stroke="#ff7a1a" d="M10 75 H630"/>
    <path class="c" style="--len:300" stroke="#ffb347" d="M120 75 C160 75 160 30 200 30 H330 C370 30 370 75 410 75"/>
    <path class="c" style="--len:240" stroke="#ffe1b0" d="M380 75 C420 75 420 120 460 120 H540 C580 120 580 75 610 75"/>
    ${[10, 70, 120, 250, 330, 410, 470, 540, 610, 630].map((x, i) => `<circle class="n" style="transition-delay:${(i * .2).toFixed(1)}s" cx="${x}" cy="${[75, 75, 75, 30, 30, 75, 120, 120, 75, 75][i]}" r="7" fill="#0a0705" stroke="${['#ff7a1a', '#ff7a1a', '#ff7a1a', '#ffb347', '#ffb347', '#ff7a1a', '#ffe1b0', '#ffe1b0', '#ff7a1a', '#ff7a1a'][i]}"/>`).join('')}</svg>`;
  git.insertAdjacentHTML('beforeend', svg);
  /* inclinação 3D ao passar o mouse */
  if (!REDUCED) $$('.bn', g).forEach(t => {
    t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; t.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`; });
    t.addEventListener('pointerleave', () => t.style.transform = '');
  });
  /* entra na tela: anima */
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('is-in'); io.unobserve(e.target);
    if (e.target === back) $$('.route', back).forEach((r, i) => setTimeout(() => { r.classList.add('is-in'); setTimeout(() => { const em = $('em', r); em.textContent = em.dataset.code; em.classList.remove('pend'); }, 500); }, REDUCED ? 0 : 200 + i * 260)); }), {threshold: .25});
  $$('.bn', g).forEach(t => io.observe(t));
})();

/* ================= 04 sobre ================= */
(() => {
  const A = S.about; title('about-title', A.title, A.em);
  const cover = id => (PROJECTS.find(p => p.id === id) || {}).cover;
  const art = kind => {
    if (kind === 'mercante' || kind === 'iton'){ const im = el('img'); im.src = cover(kind) || ''; im.alt = ''; im.loading = 'lazy'; if (kind === 'iton') im.style.setProperty('--pos', '68% 42%'); return im; }
    if (kind === 'terminal' && GEN.chapter1){ const im = el('img'); im.src = GEN.chapter1; im.alt = ''; im.loading = 'lazy'; im.style.setProperty('--pos', '40% 40%'); return im; }
    if (kind === 'blackhole'){ const im = el('img'); im.src = GEN.chapter4 || 'assets/img/bh-core.webp'; im.alt = ''; im.loading = 'lazy'; im.style.setProperty('--pos', '50% 50%'); return im; }
    const d = el('div'); d.innerHTML = `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice"><rect width="300" height="400" fill="#120904"/>
      <g fill="#fff" opacity=".6">${Array.from({length: 40}, (_, i) => `<circle cx="${(i * 73) % 300}" cy="${(i * 131) % 400}" r="${i % 5 ? .8 : 1.6}"/>`).join('')}</g>
      <circle cx="150" cy="150" r="120" fill="#ff7a1a" opacity=".12"/>
      <rect x="40" y="120" width="220" height="160" rx="14" fill="#0a0705" stroke="#ffb347" stroke-width="2"/>
      <circle cx="60" cy="138" r="5" fill="#8a3d08"/><circle cx="76" cy="138" r="5" fill="#ff7a1a"/><circle cx="92" cy="138" r="5" fill="#ffe1b0"/>
      <text x="58" y="182" font-family="JetBrains Mono" font-size="15" fill="#ffb347">&gt; console.log(</text>
      <text x="58" y="206" font-family="JetBrains Mono" font-size="15" fill="#ffe1b0">  "olá, mundo"</text>
      <text x="58" y="230" font-family="JetBrains Mono" font-size="15" fill="#ffb347">)</text>
      <rect x="58" y="244" width="11" height="18" fill="#ffb347"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`;
    return d.firstElementChild;
  };
  A.chapters.forEach(c => {
    const li = el('li', 'chapter reveal'); const fr = el('div', 'chapter__frame');
    fr.append(el('span', 'chapter__label', c.label), art(c.art), el('span', 'chapter__chip', c.chip));
    li.append(fr, el('h3', '', c.title), el('p', '', c.text)); $('#chapters').append(li);
  });
  const ol = $('#chapters'), cnt = $('#chapters-count'), N = A.chapters.length;
  const upd = () => { const w = ol.firstElementChild ? ol.firstElementChild.getBoundingClientRect().width : 1; const i = Math.min(N, Math.round(ol.scrollLeft / (w + 14)) + 1); cnt.textContent = `${i} / ${N} · ${A.swipe || ''}`; };
  ol.addEventListener('scroll', upd, {passive: true}); upd();
})();

/* ================= 05 pergunte ================= */
(() => {
  const CH = S.chat; title('chat-title', CH.title, CH.em);
  const qs = $('#chat-qs'), log = $('#chat-log'); let busy = false, timer = 0;
  log.append(el('p', 'msg msg--hint', CH.placeholder));
  const ask = (i, btn) => {
    if (busy) return; busy = true; const it = CH.qa[i];
    $$('.chat__q', qs).forEach(b => b.classList.toggle('is-on', b === btn));
    log.textContent = ''; log.append(el('p', 'msg msg--me', it.q));
    const bot = el('div', 'msg msg--bot'); const body = el('span'); const dots = el('span', 'dots'); dots.append(el('i'), el('i'), el('i')); body.append(dots); bot.append(body);
    setTimeout(() => { log.append(bot);
      setTimeout(() => { body.textContent = ''; let n = 0; clearInterval(timer);
        timer = setInterval(() => { n = Math.min(it.a.length, n + 2); body.textContent = it.a.slice(0, n); if (n >= it.a.length){ clearInterval(timer); busy = false; } }, REDUCED ? 0 : 18); }, REDUCED ? 0 : 900);
    }, REDUCED ? 0 : 350);
  };
  CH.qa.forEach((it, i) => { const b = el('button', 'chat__q', it.q); b.type = 'button'; b.addEventListener('click', () => ask(i, b)); qs.append(b); });
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); setTimeout(() => ask(0, $('.chat__q', qs)), 500); } }, {threshold: .5});
  io.observe($('#pergunte .chat__win'));
})();

/* ================= 06 projetos ================= */
const pjState = {sel: 0, img: null};
(() => {
  const PS = S.projects; title('projects-title', PS.title, PS.em);
  const list = $('#pj-list'), card = $('#pj-card');
  const slots = [...PROJECTS, null];
  slots.forEach((p, i) => {
    const b = el('button', 'pj__item' + (p ? '' : ' pj__item--soon')); b.type = 'button'; b.setAttribute('role', 'tab');
    const ball = el('b', '', p ? '' : '+'); if (p){ ball.style.backgroundImage = `url("${p.cover}")`; ball.style.backgroundPosition = p.coverFocus || '72% 40%'; }
    const d = el('div'); d.append(el('strong', '', p ? p.title : PS.soonTitle), el('small', '', p ? p.subtitle : '')); b.append(ball, d, el('i', '', String(i + 1).padStart(2, '0')));
    b.addEventListener('click', () => pick(i)); list.append(b);
  });
  function render(i){
    const p = slots[i]; card.textContent = '';
    if (p){ const im = el('img'); im.src = p.cover; im.alt = `Capa do projeto ${p.title}`; card.append(im); } else card.append(el('div', 'pj__soon', '+'));
    const b = el('div', 'pj__body');
    if (p) b.append(el('p', 'pj__count', PS.count.replace('{n}', String(i + 1).padStart(2, '0')).replace('{total}', String(PROJECTS.length).padStart(2, '0'))));
    b.append(el('h3', '', p ? p.title : PS.soonTitle));
    if (p) b.append(el('p', 'pj__sub', p.subtitle));
    b.append(el('p', 'pj__desc', p ? p.description : PS.soonText));
    if (p){ const t = el('div', 'pj__tags'); p.tags.forEach(x => t.append(el('span', '', x))); b.append(t);
      const links = el('div', 'cta__btns');
      if (p.repo){ const a = el('a', 'btn btn--amber', PS.repo); a.href = p.repo; a.target = '_blank'; a.rel = 'noopener'; links.append(a); }
      if (p.demo){ const a = el('a', 'btn btn--line', PS.demo); a.href = p.demo; a.target = '_blank'; a.rel = 'noopener'; links.append(a); }
      b.append(links); }
    card.append(b);
  }
  function pick(i, instant){
    pjState.sel = i; $$('.pj__item', list).forEach((b, k) => b.setAttribute('aria-selected', k === i));
    const p = slots[i]; pjState.img = p ? p.cover : null; pjState.flipT = 0; updateScreenContent(true);
    if (instant){ render(i); return; }
    card.classList.add('swap'); setTimeout(() => { render(i); card.classList.remove('swap'); }, 260);
  }
  pick(Math.max(0, PROJECTS.findIndex(p => p.featured)), true);
})();

/* ================= 07 fluxo ================= */
(() => {
  const F = S.flow; title('flow-title', F.title, F.em);
  const tabs = $('#flow-tabs'), nodes = $('#flow-nodes'), src = $('#flow-src'), cv = $('#flow-canvas'), g = cv.getContext('2d'), stage = $('#flow-stage');
  const COLORS = ['#ff7a1a', '#ffb347', '#ffe1b0', '#f4f1ec', '#ff5631'];
  $('#flow-foot').append(...F.foot.map(t => el('span', '', t)));
  let graph, W = 0, H = 0, DPR = 1, live = false;
  const parts = [];
  function setGraph(name){
    graph = F.graphs[name]; $$('button', tabs).forEach(b => b.setAttribute('aria-selected', b.textContent === name));
    src.textContent = ''; src.append(el('small', '', graph.source[0]), el('strong', '', graph.source[1]));
    nodes.textContent = ''; graph.nodes.forEach(([n, d], i) => { const li = el('li'); li.style.setProperty('--c', COLORS[i % COLORS.length]); const x = el('div'); x.append(el('strong', '', n), el('small', '', d)); li.append(x); nodes.append(li); });
    layout();
  }
  F.tabs.forEach(t => { const b = el('button', '', t); b.type = 'button'; b.setAttribute('role', 'tab'); b.addEventListener('click', () => setGraph(t)); tabs.append(b); });
  let ends = [], start = {x: 0, y: 0, h: 0};
  function layout(){
    DPR = Math.min(devicePixelRatio || 1, 1.5); W = stage.clientWidth; H = stage.clientHeight; cv.width = W * DPR; cv.height = H * DPR;
    const sr = src.getBoundingClientRect(), st = stage.getBoundingClientRect();
    start = {x: sr.right - st.left + 16, y: H / 2, h: H * .5};
    ends = $$('li', nodes).map(li => { const r = li.getBoundingClientRect(); return {x: r.left - st.left - 10, y: r.top - st.top + r.height / 2}; });
  }
  const pickNode = () => { const w = graph.weights, sum = w.reduce((a, b) => a + b, 0); let r = Math.random() * sum; for (let i = 0; i < w.length; i++){ r -= w[i]; if (r <= 0) return i; } return 0; };
  const spawn = p => { p.n = pickNode(); p.t = 0; p.v = .12 + Math.random() * .16; p.o0 = (Math.random() - .5); p.o1 = (Math.random() - .5); p.s = .8 + Math.random() * 1.6; return p; };
  setGraph(F.tabs[0]); addEventListener('resize', layout);
  const N = innerWidth < 820 ? 700 : 1600;
  for (let i = 0; i < N; i++){ const p = spawn({}); p.t = Math.random(); parts.push(p); }
  new IntersectionObserver(es => { live = es[0].isIntersecting; if (live) layout(); }).observe(stage);
  let last = performance.now();
  (function loop(now){ requestAnimationFrame(loop); const dt = Math.min((now - last) / 1000, .05); last = now; if (!live || !ends.length) return;
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    const wsum = graph.weights.reduce((a, b) => a + b, 0), band = Math.min(64, H / graph.nodes.length * .62);
    for (const p of parts){
      p.t += dt * p.v * (REDUCED ? 0 : 1); if (p.t >= 1) spawn(p);
      const e = ends[p.n] || ends[0], t = p.t, u = t * t * (3 - 2 * t);
      const y0 = start.y + p.o0 * start.h * (graph.weights[p.n] / wsum) * 2.2, y1 = e.y + p.o1 * band * (graph.weights[p.n] / 5);
      const x = lerp(start.x, e.x, t), y = lerp(y0, y1, u);
      g.globalAlpha = .35 + .65 * Math.sin(Math.PI * t); g.fillStyle = COLORS[p.n % COLORS.length]; g.fillRect(x, y, p.s, p.s);
    }
    g.globalAlpha = 1; g.fillStyle = '#ffb347'; g.fillRect(start.x - 8, start.y - start.h / 2, 4, start.h);
  })(last);
})();

/* ================= 08 cemitério ================= */
(() => {
  const B = S.bugs; title('bugs-title', B.title, B.em);
  const yard = $('#yard'), n = $('#bugs-n'); let dead = 0;
  const kill = s => { if (s.classList.contains('is-dead')) return; s.classList.add('is-dead'); s.setAttribute('aria-pressed', 'true'); dead++; n.textContent = dead;
    if (dead === B.stones.length){ const b = $('#bugs-all'); b.textContent = B.done; b.disabled = true; } };
  B.stones.forEach(([t, d, k]) => { const s = el('button', 'stone'); s.type = 'button'; s.setAttribute('aria-pressed', 'false'); s.setAttribute('aria-label', `Enterrar o bug ${t}: ${d}`);
    s.append(el('span', 'rip', 'R.I.P.'), el('small', '', k.toUpperCase()), el('strong', '', t), el('span', '', d)); s.addEventListener('click', () => kill(s)); yard.append(s); });
  $('#bugs-all').addEventListener('click', () => $$('.stone:not(.is-dead)', yard).forEach((s, i) => setTimeout(() => kill(s), REDUCED ? 0 : i * 120)));
})();

/* ================= 09 órbita ================= */
(() => {
  const O = S.orbit; title('orbit-title', O.title, O.em);
  const orb = $('#orb'), ul = $('#orb-items');
  const abbr = t => ({'JavaScript': 'JS', 'TypeScript': 'TS', 'Python': 'PY', 'PostgreSQL': 'PG', 'Node.js': 'NO', 'Prisma': 'PR', 'GitHub': 'GH'}[t] || t.slice(0, 3).toUpperCase());
  const items = stackAll.map((t, i) => { const li = el('li', 'orb__it'); li.append(el('b', '', abbr(t)), el('span', '', t)); ul.append(li); return {li, ring: i % 2, a0: i / stackAll.length * Math.PI * 2}; });
  const months = (C.stats || []).find(s => /mes/i.test(s.label));
  [[PROJECTS.length, O.labels[0]], [stackAll.length, O.labels[1]], [months ? months.value : '—', O.labels[2]]].forEach(([v, l]) => { const li = el('li'); li.append(el('strong', '', String(v).padStart(2, '0')), el('span', '', l)); $('#orb-stats').append(li); });
  let rot = 0, vel = REDUCED ? 0 : .12, drag = false, x0 = 0, live = false;
  orb.addEventListener('pointerdown', e => { drag = true; x0 = e.clientX; orb.classList.add('is-drag'); });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - x0; x0 = e.clientX; rot += dx * .006; vel = dx * .006 * 30; });
  addEventListener('pointerup', () => { drag = false; orb.classList.remove('is-drag'); });
  new IntersectionObserver(es => live = es[0].isIntersecting).observe(orb);
  let last = performance.now();
  (function loop(now){ requestAnimationFrame(loop); const dt = Math.min((now - last) / 1000, .05); last = now; if (!live) return;
    if (!drag){ rot += vel * dt; vel = lerp(vel, REDUCED ? 0 : .12, dt * 1.5); }
    const W = orb.clientWidth, H = orb.clientHeight;
    items.forEach(it => { const A = W * (it.ring ? .28 : .43), Bv = H * (it.ring ? .2 : .31), a = it.a0 + rot * (it.ring ? -1.4 : 1);
      const x = W / 2 + Math.cos(a) * A, y = H / 2 + Math.sin(a) * Bv, d = (Math.sin(a) + 1) / 2;
      it.li.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${lerp(.72, 1.08, d).toFixed(3)})`;
      it.li.style.zIndex = Math.sin(a) > -.2 ? 10 : 1; it.li.style.opacity = lerp(.5, 1, d).toFixed(2); });
  })(last);
})();

/* ================= 10 contato e rodapé ================= */
(() => {
  const K = S.contact; const h = $('#cta-title'); h.textContent = K.title + ' '; h.append(el('em', '', K.em));
  $('#badge-text').textContent = K.ring.repeat(2);
  const btns = $('#cta-btns');
  if (ct.email){ const a = el('a', 'btn btn--amber'); a.href = 'mailto:' + ct.email; a.append(el('span', '', (C.contactSection && C.contactSection.emailCta) || 'E-mail'), el('b', '', '→')); btns.append(a); }
  [['github', K.github], ['linkedin', K.linkedin]].forEach(([k, label]) => { if (!ct[k]) return; const a = el('a', 'btn btn--line', label + ' ↗'); a.href = ct[k]; a.target = '_blank'; a.rel = 'noopener'; btns.append(a); });
  if (ct.email){ const m = el('button', 'mailcard'); m.type = 'button'; m.append(el('i', '', '@')); const d = el('div'); const s = el('strong', '', ct.email); d.append(el('small', '', K.card), s); m.append(d);
    m.addEventListener('click', async () => { try { await navigator.clipboard.writeText(ct.email); s.textContent = K.copied; setTimeout(() => s.textContent = ct.email, 1600); } catch (e) { location.href = 'mailto:' + ct.email; } }); btns.append(m); }
  K.checks.forEach(c => $('#cta-checks').append(el('li', '', c)));
  const F = S.footer, tag = $('#footer-tag'); tag.append(F.tagline + ' ', el('em', '', F.em), ' ' + F.tail);
  F.cols.forEach(c => { const d = el('div'); d.append(el('h4', '', c.title)); c.links.forEach(([l, k]) => { const href = linkFor(k); if (!href) return; const a = el('a', '', l === 'email' ? ct.email : l); a.href = href;
    if (/^https?:/.test(href)){ a.target = '_blank'; a.rel = 'noopener'; } d.append(a); }); $('#footer-cols').append(d); });
})();

/* ================= revelar ================= */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); rio.unobserve(e.target); } }), {threshold: .12});
$$('.reveal').forEach(n => rio.observe(n));

/* =========================================================
   BURACO NEGRO VIAJANTE — o "celular 3D" da referência
   desce do hero, pousa no anel do Processo, gira e troca de tela
   a cada passo, e reaparece em Projetos e Contato.
   ========================================================= */
const cv = $('#bh'), bx = cv.getContext('2d');
const scr = $('#bh-screen'), scrIn = $('#bh-screen-in');
const anchors = {}; $$('[data-bh-anchor]').forEach(a => anchors[a.dataset.bhAnchor] = a);
/* ring: raio do anel de fótons em fração do lado do slot; mask: raio do esmaecimento */
const CFG = { hero: {ring: .19, mask: .62}, how: {ring: .24, mask: .66}, projects: {ring: .3, mask: .5}, cta: {ring: .17, mask: .5} };
let VW = 0, VH = 0, DPR = 1;
const resize = () => { DPR = Math.min(devicePixelRatio || 1, 1.5); VW = innerWidth; VH = innerHeight; cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR); };
addEventListener('resize', resize); resize();
const rectOf = a => { const r = a.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2, s: Math.min(r.width, r.height)}; };
const visible = r => r.y + r.s > -VH * .2 && r.y - r.s < VH * 1.2;

/* linhas de código sugadas (só no hero) */
const CODE = [
  'const despesas = await prisma.despesa.findMany({ where: { familiaId } });', 'def fechar_pedido(self, carrinho): return sum(i.preco for i in carrinho)',
  'router.post("/despesas", auth, async (req, res) => {', 'SELECT categoria, SUM(valor) FROM despesas GROUP BY categoria;',
  'const total = itens.reduce((soma, i) => soma + i.valor, 0);', 'model Despesa { id Int @id @default(autoincrement()) valor Decimal }',
  'git commit -m "feat: atravessa o horizonte de eventos"', 'while (curioso) { aprender(); construir(); repetir(); }',
  'type Portfolio = { nome: "Lucas"; foco: "full-stack" };', 'class Marketplace: def listar_produtos(self): return self.estoque',
];
const rnd = (a, b) => a + Math.random() * (b - a);
const LINES = []; const NL = innerWidth < 820 ? 6 : 12;
const spawnL = (L, first) => { L.text = CODE[(Math.random() * CODE.length) | 0]; L.a0 = rnd(0, 6.28); L.turns = rnd(.45, .9); L.R0 = rnd(4.2, 6.5); L.t = first ? rnd(0, .9) : 0; L.v = rnd(.04, .08); L.size = rnd(10, 14); L.hot = Math.random() < .3; };
for (let i = 0; i < NL; i++){ const L = {}; spawnL(L, true); LINES.push(L); }
function spiral(L, t, H, o){ const u = 1 - t, r = H.r * (.22 + (L.R0 - .22) * Math.pow(u, 1.55)), a = L.a0 + L.turns * 6.2832 * (1 - Math.pow(u, .62));
  const sq = lerp(1, .5, clamp((r / H.r - 1.1) / 3)); o.x = H.x + Math.cos(a) * r; o.y = H.y + Math.sin(a) * r * sq; o.r = r / H.r; return o; }
const P0 = {}, P1 = {};
function drawLines(dt, H, alpha, guardY){
  if (alpha <= .01) return; bx.globalCompositeOperation = 'lighter'; bx.textBaseline = 'middle'; bx.textAlign = 'center';
  const guardX = VW < 820 ? -1 : VW * .5;
  for (const L of LINES){
    L.t += dt * L.v * (.45 + 2.6 * L.t * L.t); if (L.t >= 1) spawnL(L, false);
    let t = L.t; const fade = sst(0, .1, L.t), n = L.text.length;
    for (let j = 0; j < n && t > 0; j++){
      spiral(L, t, H, P0); spiral(L, Math.max(t - .002, 0), H, P1);
      const dx = P0.x - P1.x, dy = P0.y - P1.y, sp = Math.hypot(dx, dy) / .002 || 1, near = clamp(1 - (P0.r - .3) / 2.4);
      const size = L.size * lerp(1, .5, near) * (VH / 900 + .25), st = 1 + 2.4 * near * near, ang = Math.atan2(dy, dx), flip = Math.cos(ang) < 0;
      const keep = guardX < 0 ? sst(guardY - 10, guardY + 50, P0.y) : sst(guardX - 60, guardX + 60, P0.x);
      const al = alpha * fade * keep * clamp((P0.r - .28) / .5) * (1 - j / n * .55) * (L.hot ? 1 : .78);
      if (al > .01){ bx.globalAlpha = al; bx.fillStyle = j < 3 ? '#fff6e6' : (L.hot ? '#ffe1b0' : '#ffb85c'); bx.font = `500 ${size.toFixed(1)}px "JetBrains Mono",monospace`;
        bx.setTransform(DPR, 0, 0, DPR, P0.x * DPR, P0.y * DPR); bx.rotate(flip ? ang + Math.PI : ang); bx.scale(st, 1); bx.fillText(flip ? L.text[j] : L.text[n - 1 - j], 0, 0); bx.setTransform(DPR, 0, 0, DPR, 0, 0); }
      t -= size * .62 * st / sp;
    }
  }
  bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
}

/* conteúdo da "tela" dentro da sombra */
function updateScreenContent(force){
  if (!bhReady) return;
  const k = cur.anchor === 'how' ? 'how' + howState.step : cur.anchor === 'projects' ? 'pj' + pjState.sel : '';
  if (k === screenKey && !force) return; screenKey = k; scrIn.textContent = ''; scr.classList.remove('is-img');
  if (cur.anchor === 'how' && STEPS[howState.step]){ const lines = STEPS[howState.step].screen; if (lines.length === 1 || lines[0].length <= 2) { scrIn.append(el('span', 'big', lines[0])); lines.slice(1).forEach(l => scrIn.append(l + '\n')); } else scrIn.textContent = lines.join('\n'); }
  else if (cur.anchor === 'projects'){ if (pjState.img){ scr.classList.add('is-img'); const im = el('img'); im.src = pjState.img; im.alt = ''; scrIn.append(im); } else scrIn.append(el('span', 'big', '+')); }
}
pjState.flipT = 1; bhReady = true;

let clock = 0, lastT = performance.now();
function frame(now){
  requestAnimationFrame(frame);
  const dt = Math.min((now - lastT) / 1000, .05); lastT = now; clock += dt;
  bx.setTransform(DPR, 0, 0, DPR, 0, 0); bx.clearRect(0, 0, VW, VH);
  if (!frames[0]) return;

  /* 1) onde está o buraco negro */
  const howTop = howSec.offsetTop, y = scrollY;
  let X, Y, Sz, cfg, anchor, tilt = 0, codeAlpha = 0;
  const rh = rectOf(anchors.hero), rw = rectOf(anchors.how);
  if (y < howTop){
    const t = easeIO(clamp(y / howTop));                      // desce do hero até pousar no anel
    X = lerp(rh.x, rw.x, t); Y = lerp(rh.y, rw.y, t); Sz = lerp(rh.s, rw.s, t);
    cfg = {ring: lerp(CFG.hero.ring, CFG.how.ring, t), mask: lerp(CFG.hero.mask, CFG.how.mask, t)};
    anchor = t < .98 ? 'hero' : 'how'; tilt = Math.sin(t * Math.PI) * -.5; codeAlpha = 1 - sst(0, .35, t);
  } else {
    const cands = ['how', 'projects', 'cta'].map(k => [k, rectOf(anchors[k])]).filter(([, r]) => visible(r));
    if (!cands.length){ scr.style.opacity = 0; return; }
    cands.sort((a, b) => Math.abs(a[1].y - VH / 2) - Math.abs(b[1].y - VH / 2));
    const [k, r] = cands[0]; anchor = k; X = r.x; Y = r.y; Sz = r.s; cfg = CFG[k];
  }
  if (anchor !== cur.anchor){ cur.anchor = anchor; updateScreenContent(true); }

  /* 2) passo do processo e giro */
  if (anchor === 'how' || y >= howTop * .98){
    const p = howProgress(), i = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * .999));
    if (y >= howTop - 2) setStep(i);
    const bars = $$('#how-bars li'); bars.forEach((b, k) => b.style.setProperty('--p', (clamp(p * STEPS.length - k) * 100).toFixed(1) + '%'));
    $('.how__ring').style.rotate = (p * 240).toFixed(1) + 'deg';
  }
  let flip = 0;
  if (anchor === 'how'){ if (howState.flipT < 1){ howState.flipT = Math.min(1, howState.flipT + dt / .95); } flip = howState.flipT; if (flip > .5 && screenKey !== 'how' + howState.step) updateScreenContent(); }
  else if (anchor === 'projects'){ if (pjState.flipT < 1) pjState.flipT = Math.min(1, pjState.flipT + dt / .8); flip = pjState.flipT; }
  else flip = 1;
  const f = easeIO(flip), spin = (anchor === 'hero' ? 0 : f * Math.PI * 2) + tilt, squash = flip < 1 ? Math.cos(f * Math.PI * 2) : 1, dip = 1 - .18 * Math.sin(f * Math.PI);

  /* 3) desenha o quadro do vídeo, girado e com máscara radial */
  const T = .3 + 1.25 * (1 + Math.sin(clock * .55));          // "respira" nos primeiros ~3 s do vídeo
  const ff = clamp(T * FPS, 0, FR_N - 1.001), i0 = Math.floor(ff), fr = ff - i0, A = frames[i0] || frames[0], B = frames[i0 + 1] || A;
  const ringPx = Sz * cfg.ring * dip, scale = ringPx / ringR(T), maskR = Sz * cfg.mask * dip;
  bx.save(); bx.translate(X, Y); bx.rotate(spin); bx.scale(lerp(.25, 1, Math.abs(squash)) * Math.sign(squash || 1), 1);
  bx.drawImage(A, -HOLE.x * scale, -HOLE.y * scale, SRC_W * scale, SRC_H * scale);
  if (fr > .02 && B !== A){ bx.globalAlpha = fr; bx.drawImage(B, -HOLE.x * scale, -HOLE.y * scale, SRC_W * scale, SRC_H * scale); bx.globalAlpha = 1; }
  bx.restore();
  bx.globalCompositeOperation = 'destination-in';
  const gr = bx.createRadialGradient(X, Y, maskR * .35, X, Y, maskR); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  bx.fillStyle = gr; bx.fillRect(0, 0, VW, VH); bx.globalCompositeOperation = 'source-over';

  /* 4) código sugado (hero) */
  drawLines(dt, {x: X, y: Y, r: ringPx}, codeAlpha, anchors.hero.getBoundingClientRect().top);

  /* 5) "tela" dentro da sombra */
  const showScreen = (anchor === 'how' && y >= howTop - 2) || anchor === 'projects';
  const d = ringPx * 1.62;
  scr.style.width = scr.style.height = d.toFixed(1) + 'px';
  scr.style.fontSize = Math.max(9, d / 11).toFixed(1) + 'px';
  scr.style.transform = `translate(${(X - d / 2).toFixed(1)}px,${(Y - d / 2).toFixed(1)}px) scale(${(Math.abs(squash) * dip).toFixed(3)},${dip.toFixed(3)})`;
  scr.style.opacity = showScreen ? (flip < 1 ? Math.abs(squash) : 1).toFixed(2) : 0;
}
requestAnimationFrame(frame);
})();
