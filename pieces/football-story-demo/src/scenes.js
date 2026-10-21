// =====================================================================
//  SCENES — football story demo (Tifo explainer, 35.4s, voice-led)
//  Five spoken script beats drive everything: each line's window and word
//  times come from voice.json (tools/voice.mjs -> VOICE), so captions pop
//  on the actual voice and every graphic is cued to a spoken word.
//  Each beat draws into its own layer and crossfades with a soft gate.
// =====================================================================

// ---- SCRIPT BEATS — the same five lines that were recorded
const SCRIPT = [
  { id: 'hook', text: 'Everyone remembers when Manchester United were the most feared club on the planet.', t0: 0.45, t1: 4.99, sound: 'stadium' },
  { id: 'legends', text: 'Ferguson, Scholes, Giggs, Ronaldo, Rooney, trebles, titles, Champions League nights that made the whole world stop.', t0: 5.24, t1: 13.11, sound: 'chant' },
  { id: 'midtable', text: 'Now in 2026, they are sitting mid-table, getting booed off their own pitch, and their manager is fighting for his job before October.', t0: 13.61, t1: 21.31, sound: 'boos' },
  { id: 'fall', text: 'How did the biggest club in England fall this far, this fast?', t0: 21.76, t1: 25.39, sound: 'riser' },
  { id: 'series', text: 'Stay with us, because this 10-part series is going to break down every single reason United are where they are today. And trust me, some of it will shock you.', t0: 25.79, t1: 34.30, sound: 'chime' },
];
// with a voice-over the beats follow the recorded lines and their word times
if (typeof VOICE !== 'undefined' && VOICE.lines) for (const b of SCRIPT) {
  const L = VOICE.lines.find((l) => l.id === b.id);
  if (L) { b.t0 = L.t0; b.t1 = L.t1; b.text = L.text; b.words = L.words; }
}
const SB = {}, NEXT = {};
SCRIPT.forEach((b, i) => { SB[b.id] = b; NEXT[b.id] = SCRIPT[i + 1] ? SCRIPT[i + 1].t0 : b.t1; });

// word lookup: first occurrence of each normalised word inside a line
const WM = {};
for (const b of SCRIPT) {
  WM[b.id] = {};
  (b.words || []).forEach((w) => {
    const k = String(w.w).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!(k in WM[b.id])) WM[b.id][k] = w;
  });
}
const nw = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function wT(id, word, fb = 1) {
  const w = WM[id] && WM[id][nw(word)];
  return w ? w.t0 : SB[id].t0 + (fb || 1);
}

// ---- beat gates (layer fade in just before the line, out as the next starts)
const sT = (id, k = 0) => SB[id].t0 + BEAT * k;
const sProg = (id, k0 = 0, k1 = 1) => seg(TT, sT(id, k0), sT(id, k1));
const sGateIn = (id) => (id === 'hook' ? 1 : EZ.o2(seg(TT, SB[id].t0 - 0.18, SB[id].t0 - 0.02)));
const sGateOut = (id) => (id === SCRIPT[SCRIPT.length - 1].id ? 1 : 1 - EZ.i2(seg(TT, NEXT[id] - 0.24, NEXT[id] - 0.10)));
const sA = (id) => sGateIn(id) * sGateOut(id);

// the shared cue map and storyboard (TIMELINE lives in src/head.html)
TIMELINE.cues = Object.fromEntries(SCRIPT.map((b) => [b.id, b.t0]));
TIMELINE.narration = SCRIPT.map((b) => ({ t0: b.t0, t1: b.t1, text: b.text }));
TIMELINE.board = SCRIPT.map((b) => ({ t: b.t0, title: b.text.split(/[,.]/)[0], sound: b.sound, next: b.id }));
const SHOT_TITLES = { hook: 'the feared era', legends: 'the legend lineup', midtable: '2026: mid-table', fall: 'how did it fall', series: 'ten-part series' };
TIMELINE.shots = SCRIPT.map((b, i) => ({ id: i + 1, key: b.id, era: 0, t0: b.t0, t1: b.t1, title: SHOT_TITLES[b.id] || b.id }));
TIMELINE.acts = [
  { name: 'Glory', role: 'build', t0: 0.0, t1: SB.legends.t0 },
  { name: 'Legends', role: 'build', t0: SB.legends.t0, t1: SB.midtable.t0 },
  { name: 'Fall', role: 'turn', t0: SB.midtable.t0, t1: SB.series.t0 },
  { name: 'Series', role: 'payoff', t0: SB.series.t0, t1: VOICE.duration },
];

// =====================================================================
//  BEAT LAYERS
// =====================================================================
const BEAT_L = { hook: 1, legends: 2, midtable: 3, fall: 4, series: 5 };
function withLayer(i, alpha, fn) {
  if (alpha <= 0.002) return;
  const lc = layer(i).getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalAlpha = 1;
  lc.globalCompositeOperation = 'source-over'; lc.setLineDash([]); lc.filter = 'none';
  lc.clearRect(0, 0, W, H);
  const saved = ctx; ctx = lc;
  fn();
  ctx = saved;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(layer(i), 0, 0);
  ctx.restore();
}

// =====================================================================
//  CAPTIONS — yellow Tifo type, black extrusion + outline, each word
//  pops with a little back-ease and settles with a short vibration.
// =====================================================================
function tifoCaption(id, o = {}) {
  const b = SB[id];
  const size = o.s ?? 68, maxW = o.maxW ?? 780, y0 = o.y ?? 1440;
  const ol = size * (o.ol ?? 0.13);
  let toks;
  if (b.words && b.words.length) {
    toks = b.words.map((w) => ({ s: String(w.w).toUpperCase(), t: w.t0 }));
  } else {
    const ws = b.text.split(/\s+/), dur = b.t1 - b.t0, tot = b.text.length;
    let acc = b.t0;
    toks = ws.map((s) => { const t = acc; acc += dur * s.length / tot; return { s: s.toUpperCase(), t }; });
  }
  const sp = Math.max(size * 0.28, tifoW('M M', size) - 2 * tifoW('M', size));
  const rows = [];
  let row = [], wsum = 0;
  for (const tk of toks) {
    const w = tifoW(tk.s, size);
    if (row.length && wsum + sp + w > maxW) { rows.push(row); row = []; wsum = 0; }
    wsum += (row.length ? sp : 0) + w;
    row.push({ ...tk, w });
  }
  if (row.length) rows.push(row);
  const lh = size * 1.16;
  if (!rows.length) return;
  ctx.save();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  rows.forEach((rw, ri) => {
    if (TT < rw[0].t) return;
    const rev = rw.filter((t) => TT >= t.t);
    if (!rev.length) return;
    const revW = rw.reduce((a, t, i) => a + t.w + (i ? sp : 0), 0);
    let x = W / 2 - revW / 2;
    const y = y0 - (rows.length - 1 - ri) * lh;
    rw.forEach((tk, wi) => {
      const age = TT - tk.t;
      if (age < 0) return;
      const pop = EZ.back(clamp(age / 0.16));
      const vib = Math.max(0, 1 - age / 0.45);
      const jx = Math.sin(TT * 61 + wi * 1.7 + ri) * 1.8 * vib;
      const jy = Math.cos(TT * 53 + wi * 2.3 + ri) * 1.3 * vib;
      const rot = Math.sin(TT * 47 + wi * 2.7) * 0.012 * vib;
      const sc = 1 + 0.10 * (1 - Math.min(1, pop));
      ctx.save();
      ctx.translate(x + tk.w / 2 + jx, y - size * 0.34 + jy);
      ctx.rotate(rot);
      ctx.scale(sc, sc);
      ctx.font = `400 ${size}px ${TIFO_F}`;
      ctx.globalAlpha = o.al ?? 1;
      ctx.fillStyle = FT.black;
      ctx.fillText(tk.s, -tk.w / 2 + size * 0.055, size * 0.34 + size * 0.065);
      ctx.fillText(tk.s, -tk.w / 2 + size * 0.115, size * 0.34 + size * 0.145);
      ctx.lineJoin = 'round';
      ctx.lineWidth = ol;
      ctx.strokeStyle = FT.black;
      ctx.strokeText(tk.s, -tk.w / 2, size * 0.34);
      ctx.fillStyle = FT.yellow;
      ctx.fillText(tk.s, -tk.w / 2, size * 0.34);
      ctx.restore();
      x += tk.w + sp;
    });
  });
  ctx.restore();
}

// =====================================================================
//  STANDINGS CARD (beat 3)
// =====================================================================
function tifoTable(cx, cy, w, h, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const rows = [
    ['8', 'NEW', '57', '+12'], ['9', 'AST', '55', '+4'], ['10', 'BHA', '52', '+1'],
    ['11', 'BRE', '50', '-1'], ['12', 'CRY', '48', '-3'], ['13', 'MUN', '46', '-5'],
    ['14', 'WOL', '44', '-8'], ['15', 'EVE', '42', '-9'],
  ];
  ctx.save();
  ctx.translate(cx + 70 * (1 - Math.min(1, u)), cy);
  ctx.rotate(-0.018);
  ctx.save(); ctx.translate(12, 14); ctx.globalAlpha = 0.36; ctx.fillStyle = FT.black; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
  ctx.fillStyle = '#101114'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = FT.yellow; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  tifoText('PREMIER LEAGUE', -w / 2 + 26, -h / 2 + 54, 29, FT.white, { fam: TIFO_S, weight: 800, shadow: false });
  tifoText('2026', w / 2 - 26, -h / 2 + 58, 44, FT.yellow, { align: 'right', shadow: false });
  ctx.fillStyle = FT.yellow; ctx.fillRect(-w / 2 + 24, -h / 2 + 74, w - 48, 4);
  tifoText('#', -w / 2 + 36, -h / 2 + 100, 18, FT.steel, { fam: TIFO_S, weight: 700, shadow: false });
  tifoText('CLUB', -w / 2 + 92, -h / 2 + 100, 18, FT.steel, { fam: TIFO_S, weight: 700, shadow: false });
  tifoText('PTS', w / 2 - 106, -h / 2 + 100, 18, FT.steel, { fam: TIFO_S, weight: 700, align: 'right', shadow: false });
  tifoText('GD', w / 2 - 32, -h / 2 + 100, 18, FT.steel, { fam: TIFO_S, weight: 700, align: 'right', shadow: false });
  const rh = (h - 140) / rows.length;
  rows.forEach((r, i) => {
    const ry = -h / 2 + 116 + i * rh, hot = r[1] === 'MUN';
    if (hot) { ctx.fillStyle = FT.yellow; ctx.fillRect(-w / 2 + 16, ry, w - 32, rh - 4); }
    else if (i % 2 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(-w / 2 + 16, ry, w - 32, rh - 4); }
    const fs = Math.min(33, rh * 0.42), col = hot ? FT.black : FT.white;
    tifoText(r[0], -w / 2 + 38, ry + rh * 0.62, fs * 0.9, hot ? FT.black : FT.steel, { fam: TIFO_S, weight: 700, shadow: false });
    tifoText(r[1], -w / 2 + 92, ry + rh * 0.62, fs, col, { fam: TIFO_S, weight: 800, shadow: false });
    tifoText(r[2], w / 2 - 106, ry + rh * 0.62, fs, col, { fam: TIFO_S, weight: 700, align: 'right', shadow: false });
    tifoText(r[3], w / 2 - 32, ry + rh * 0.62, fs * 0.86, hot ? FT.black : (r[3][0] === '-' ? FT.crimsonL : FT.steel), { fam: TIFO_S, weight: 700, align: 'right', shadow: false });
    if (hot) {
      ctx.fillStyle = FT.crimsonL;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 10, ry + rh * 0.32); ctx.lineTo(w / 2 - 2, ry + rh * 0.32); ctx.lineTo(w / 2 - 6, ry + rh * 0.52); ctx.closePath(); ctx.fill();
    }
  });
  ctx.restore();
}

// =====================================================================
//  SCENE HELPERS
// =====================================================================
function tifoStar(x, y, s, c) { star4(x, y, s, c); }

function chartLine(P, frac) {
  if (frac <= 0) return;
  const Q = frac >= 1 ? P : subPath(P, frac);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  trace(Q, false); ctx.strokeStyle = FT.black; ctx.lineWidth = 30; ctx.stroke();
  trace(Q, false); ctx.strokeStyle = FT.yellow; ctx.lineWidth = 14; ctx.stroke();
  ctx.restore();
}

// =====================================================================
//  B1 — THE FEARED ERA (deep red, globe, trophy cutouts)
// =====================================================================
function drawHook() {
  tifoFill(FT.red);
  tifoGlow(W / 2, 760, 1010, FT.redL, '#3b060d');
  tifoJersey(540, 790, 1.55, { k: sT('hook', -0.9), al: 0.16, rot: 0.045, bg: FT.red, trim: FT.crimsonL, numC: FT.crimson });
  tifoGlobe(520, 740, 420, FT.yellow, 0.10);
  tifoDiag('rgba(0,0,0,0.10)', 54, 1, 2);
  tifoHalftone(FT.yellow, 40, 2.6, 0.05);
  tifoCup(318, 780, 470, { k: sT('hook', -0.65), rot: -0.07 });
  tifoSmallCup(792, 820, 285, { k: sT('hook', -0.25), rot: 0.09 });
  tifoSmallCup(884, 924, 180, { k: sT('hook', -0.10), rot: 0.16 });
  tifoRibbon('MANCHESTER UNITED', 540, 298, 42, { k: sT('hook', -0.60), rot: -0.02 });
  tifoSticker('THE GLORY ERA', 540, 386, 23, { k: sT('hook', -0.35), bg: FT.yellow, rot: -0.015, fam: 's' });
  tifoStar(168, 468, 26, FT.yellow);
  tifoStar(912, 486, 20, FT.yellow);
  tifoStar(238, 1010, 16, FT.yellow);
  tifoSticker('MOST FEARED', 540, 1040, 42, { k: wT('hook', 'feared', 3.5), bg: FT.black, c: FT.yellow, rot: 0.02 });
  tifoCaption('hook', { s: 70 });
}

// =====================================================================
//  B2 — FERGUSON + THE LEGENDS (crimson pitch, five silhouette badges)
// =====================================================================
function drawLegends() {
  tifoFill(FT.red);
  tifoGlow(W / 2, 720, 1050, FT.crimsonL, '#4a0812');
  tifoPitch('rgba(255,230,0,0.85)', 0.18);
  tifoHalftone(FT.black, 44, 3, 0.08);
  tifoRibbon('THE LEGEND LINEUP', 540, 292, 38, { k: sT('legends', 0.02) });
  const figures = [
    ['ferguson', 198, 'FERGUSON', 0.0],
    ['ronaldo', 540, 'RONALDO', 1.0],
    ['rooney', 882, 'ROONEY', 2.0],
  ];
  figures.forEach(([pose, x, name, off], i) => {
    const k = wT('legends', name.toLowerCase(), 1.2 + off);
    if (popAt(k) > 0) {
      tifoShadowDisc(x, 640, 176, 0.32);
      ctx.save();
      ctx.fillStyle = FT.black;
      ctx.beginPath(); ctx.arc(x, 640, 176, 0, TAU); ctx.fill();
      ctx.strokeStyle = FT.yellow; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(x, 640, 164, 0, TAU); ctx.stroke();
      ctx.restore();
    }
    tifoPlayer(x, 640, 310, pose, { k, rot: (i - 1) * 0.015 });
    tifoSticker(name, x, 862, 23, { k, bg: FT.black, c: FT.yellow, rot: (i - 1) * 0.02 });
  });
  tifoText('SCHOLES 18  ·  GIGGS 11', 540, 946, 24, FT.cream, { align: 'center', fam: TIFO_S, weight: 800 });
  tifoSticker('1999 TREBLE', 328, 1026, 28, { k: wT('legends', 'trebles', 3.4), bg: FT.yellow, rot: -0.025, fam: 's' });
  tifoSticker('TITLES', 540, 1042, 23, { k: wT('legends', 'titles', 4.4), bg: FT.cream, rot: 0.02, fam: 's' });
  tifoSticker('UCL NIGHTS', 756, 1026, 24, { k: wT('legends', 'champions', 5.2), bg: FT.signal, c: FT.white, rot: -0.02, fam: 's' });
  tifoStar(108, 508, 22, FT.yellow);
  tifoStar(972, 540, 26, FT.yellow);
  tifoCaption('legends', { s: 64 });
}

// =====================================================================
//  B3 — 2026: MID-TABLE (charcoal, standings card, arrows, BOOED OFF)
// =====================================================================
function drawMidtable() {
  tifoFill(FT.slate);
  tifoGlow(W / 2, 740, 980, FT.slateL, '#10141a');
  tifoDiag('rgba(255,230,0,0.045)', 60, 1, 2);
  tifoHalftone('rgba(0,0,0,0.42)', 44, 3.2, 0.32);
  tifoRibbon('WHERE ARE THEY NOW?', 452, 298, 34, { k: sT('midtable', 0.04), bg: FT.black });
  tifoText('13', 160, 944, 320, FT.yellow, { align: 'center', shadow: false, al: 0.045 });
  tifoDownArrow(148, 580, 190, FT.signal, { k: sT('midtable', 0.10), rot: 0.36 });
  tifoArrow(92, 470, 386, 700, FT.signal, { k: wT('midtable', 'mid-table', 2.5), w: 24, head: 58 });
  tifoArrow(160, 760, 326, 966, FT.signal, { k: wT('midtable', 'booed', 3), w: 17, head: 42 });
  tifoSticker('13TH', 184, 895, 40, { k: wT('midtable', 'mid-table', 2.5), bg: FT.signal, c: FT.white, rot: -0.05 });
  tifoSticker('BOOED OFF', 254, 970, 33, { k: wT('midtable', 'booed', 3), bg: FT.yellow, rot: -0.08 });
  tifoTable(690, 690, 500, 620, { k: wT('midtable', 'mid-table', 2.1) });
  tifoCaption('midtable', { s: 62 });
}

// =====================================================================
//  B4 — HOW DID IT FALL? (navy, descending trend line, down arrow)
// =====================================================================
function drawFall() {
  tifoFill(FT.slateD);
  tifoGlow(W / 2, 720, 980, FT.slateL, '#0c1015');
  tifoDiag('rgba(255,230,0,0.05)', 58, 1, 2);
  tifoHalftone('rgba(255,255,255,0.10)', 46, 2.2, 0.05);
  tifoRibbon('THE DECLINE', 540, 298, 42, { k: sT('fall', 0.06) });
  const P = [[170, 512], [330, 566], [468, 648], [604, 742], [736, 852], [858, 968]];
  const frac = clamp((TT - (SB.fall.t0 + 0.2)) / 1.2);
  chartLine(P, frac);
  P.forEach(([x, y], i) => {
    const k = sT('fall', 0.2 + i * 0.24);
    const u = popAt(k);
    if (u <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(lerp(0.5, 1, Math.min(1, u)), lerp(0.5, 1, Math.min(1, u)));
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fill();
    ctx.fillStyle = FT.yellow; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill();
    ctx.restore();
  });
  tifoText('2008', 170, 562, 34, FT.steel, { fam: TIFO_S, weight: 800, align: 'center', shadow: false });
  tifoText('2013', 468, 700, 34, FT.steel, { fam: TIFO_S, weight: 800, align: 'center', shadow: false });
  tifoText('2026', 890, 1032, 42, FT.yellow, { fam: TIFO_S, weight: 800, align: 'center', shadow: false });
  ctx.save();
  ctx.setLineDash([10, 12]); ctx.strokeStyle = 'rgba(255,230,0,0.5)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(858, 992); ctx.lineTo(858, 1120); ctx.stroke();
  ctx.restore();
  tifoArrow(626, 882, 884, 1118, FT.signal, { k: wT('fall', 'fast', 4.4), w: 24, head: 54 });
  tifoSticker('THIS FAST?', 756, 1140, 28, { k: wT('fall', 'fast', 4), bg: FT.signal, c: FT.white, rot: 0.04 });
  tifoCaption('fall', { s: 82 });
}

// =====================================================================
//  B5 — PART 1 / 10 (amber, giant badge, lightning)
// =====================================================================
function drawSeries() {
  tifoFill(FT.amber);
  tifoGlow(W / 2, 700, 1000, FT.amberL, '#a56f0c');
  tifoDiag('rgba(0,0,0,0.07)', 56, 1, 2);
  tifoHalftone(FT.black, 42, 2.8, 0.07);
  tifoText('10', 540, 920, 560, FT.black, { align: 'center', shadow: false, al: 0.045 });
  const scrim = ctx.createLinearGradient(0, 980, 0, 1620);
  scrim.addColorStop(0, 'rgba(0,0,0,0)'); scrim.addColorStop(0.5, 'rgba(0,0,0,0.16)'); scrim.addColorStop(1, 'rgba(0,0,0,0.30)');
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = scrim; ctx.fillRect(0, 980, W, H - 980); ctx.restore();
  tifoRibbon('THE FULL STORY', 540, 292, 40, { k: sT('series', 0.05) });
  tifoPartBadge(540, 512, 1.0, { big: true, k: sT('series', 0.06), rot: 0.02 });
  tifoBolt(168, 470, 230, FT.yellow, { k: sT('series', 0.5), rot: -0.2 });
  tifoBolt(886, 660, 290, FT.yellow, { k: wT('series', 'shock', 5), rot: 0.16 });
  const sk = wT('series', 'shock', 6);
  if (TT > sk) {
    const pp = popAt(sk);
    tifoStar(540, 512, 120 + 40 * Math.min(1, pp), 'rgba(255,230,0,0.35)');
    tifoStar(332, 420, 34, FT.white);
    tifoStar(752, 736, 28, FT.white);
    tifoStar(196, 720, 22, FT.white);
  }
  tifoSticker('EVERY REASON', 328, 930, 21, { k: wT('series', 'reason', 5.2), bg: FT.white, rot: 0.02, fam: 's' });
  tifoSticker('SHOCK', 768, 930, 28, { k: sk, bg: FT.signal, c: FT.white, rot: -0.06 });
  tifoCaption('series', { s: 62, ol: 0.15 });
}

// =====================================================================
//  STORY — composite the five layers, then the small series tag
// =====================================================================
function seriesTag() {
  const t0 = 1.2;
  if (TT < t0) return;
  const u = popAt(t0);
  if (u <= 0) return;
  tifoPartBadge(845, 300, 0.58, { big: false, k: t0, rot: 0.04 });
}

function sceneStory() {
  withLayer(BEAT_L.hook, sA('hook'), drawHook);
  withLayer(BEAT_L.legends, sA('legends'), drawLegends);
  withLayer(BEAT_L.midtable, sA('midtable'), drawMidtable);
  withLayer(BEAT_L.fall, sA('fall'), drawFall);
  withLayer(BEAT_L.series, sA('series'), drawSeries);
  seriesTag();
}
