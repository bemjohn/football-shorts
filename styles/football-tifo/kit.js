// =====================================================================
//  styles/football-tifo/kit.js — bold Tifo-style explainer look
//  Flat poster color, heavy condensed type with black extrusions,
//  halftone dots, paper grain, vector trophies, silhouette badges,
//  sticker ribbons, stamps, trend arrows and a part badge.
//  Built on kit/core.js (trace, paint, ink, RNG, star4, grain, ...).
// =====================================================================
const FT = {
  yellow: '#FFE600',
  yellowD: '#cdb400',
  yellowL: '#fff45c',
  black: '#0b0b0d',
  ink: '#151517',
  red: '#6d0e1b',
  redD: '#47080f',
  redL: '#8d1626',
  crimson: '#a3132a',
  crimsonL: '#c2243b',
  charcoal: '#16181d',
  charcoalL: '#22252c',
  slate: '#2b3037',
  slateL: '#3b424b',
  slateD: '#1d2228',
  navy: '#101a33',
  navyL: '#1a2b50',
  amber: '#d3971c',
  amberL: '#efb62e',
  signal: '#e02736',
  burn: '#2a1209',
  paper: '#efe6cf',
  white: '#f5f0e2',
  cream: '#e8ddc4',
  steel: '#9aa0aa',
};
const TIFO_F = 'Impact, "Arial Black", "Franklin Gothic Heavy", "Segoe UI", sans-serif';
const TIFO_S = '"Segoe UI", "Arial Narrow", Arial, sans-serif';

function tifoW(str, size) { ctx.save(); ctx.font = `400 ${size}px ${TIFO_F}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }
function tifoSW(str, size, weight = 700) { ctx.save(); ctx.font = `${weight} ${size}px ${TIFO_S}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }

// heavy type with a thick black extrusion + black outline (Tifo captions / labels)
function tifoText(str, x, y, size, color, o = {}) {
  ctx.save();
  ctx.translate(x, y);
  if (o.rot) ctx.rotate(o.rot);
  if (o.sc != null && o.sc !== 1) ctx.scale(o.sc, o.sc);
  ctx.font = `${o.weight ?? 400} ${size}px ${o.fam ?? TIFO_F}`;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = o.al ?? 1;
  const sh = o.shadow !== false, sc = o.shc ?? FT.black;
  if (sh) {
    ctx.fillStyle = sc;
    ctx.fillText(str, o.dx ?? size * 0.075, o.dy ?? size * 0.09);
  }
  if (o.outline) {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = sc;
    ctx.lineWidth = o.outline;
    ctx.strokeText(str, 0, 0);
  }
  ctx.fillStyle = color;
  ctx.fillText(str, 0, 0);
  ctx.restore();
}

const popAt = (t) => (TT < t ? 0 : EZ.back(clamp((TT - t) / 0.22)));

// --- flat backgrounds -------------------------------------------------
function tifoFill(c) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function tifoGlow(cx, cy, r, c0, c1) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, c0); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function tifoHalftone(c, gap = 34, s = 3, al = 0.10) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = c; ctx.globalAlpha = al;
  for (let y = 0, row = 0; y < H + gap; y += gap, row++) {
    for (let x = (row % 2) * gap / 2; x < W + gap; x += gap) { ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
function tifoDiag(c, gap = 44, al = 0.08, w = 2) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = c; ctx.globalAlpha = al; ctx.lineWidth = w;
  ctx.beginPath();
  for (let x = -H; x < W + H; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x + H, H); }
  ctx.stroke(); ctx.restore();
}
function tifoScan(c = 'rgba(0,0,0,0.05)', step = 6) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = c;
  for (let y = 0; y < H; y += step) ctx.fillRect(0, y, W, 1);
  ctx.restore();
}
function tifoVignette(al = 0.30) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H * 0.44, H * 0.16, W / 2, H * 0.5, H * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${al})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// stadium-pitch linework (vertical pitch, drawn behind the graphics)
function tifoPitch(c, al = 0.20) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = c; ctx.globalAlpha = al; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  const x0 = 62, x1 = W - 62, y0 = 250, y1 = H - 210, cy = (y0 + y1) / 2;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, cy, 160, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, cy, 7, 0, TAU); ctx.fillStyle = c; ctx.fill();
  // boxes top and bottom
  ctx.strokeRect(x0 + 118, y0, x1 - x0 - 236, 210);
  ctx.strokeRect(x0 + 118, y1 - 210, x1 - x0 - 236, 210);
  ctx.strokeRect(x0 + 250, y0, x1 - x0 - 500, 84);
  ctx.strokeRect(x0 + 250, y1 - 84, x1 - x0 - 500, 84);
  ctx.beginPath(); ctx.arc(W / 2, y0 + 210, 78, 0.15, Math.PI - 0.15); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, y1 - 210, 78, Math.PI + 0.15, TAU - 0.15); ctx.stroke();
  ctx.restore();
}
// globe linework behind the trophy on beat 1
function tifoGlobe(cx, cy, r, c, al = 0.16) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = c; ctx.globalAlpha = al; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
  for (let i = 1; i < 4; i++) {
    const k = i / 4;
    ctx.beginPath(); ctx.ellipse(cx, cy, r * k, r, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, r, r * k, 0, 0, TAU); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.restore();
}

// --- vector trophies --------------------------------------------------
function tifoShadowDisc(x, y, r, al = 0.35) {
  ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = FT.black;
  ctx.beginPath(); ctx.arc(x + 9, y + 11, r, 0, TAU); ctx.fill(); ctx.restore();
}
// big-eared European cup
function tifoCup(x, y, h, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  const s = (h / 260) * lerp(0.78, 1, Math.min(1, u));
  const gold = o.c ?? FT.yellow, goldD = o.cd ?? FT.yellowD;
  ctx.save();
  ctx.translate(x, y + Math.sin(TT * 1.1 + (o.ph ?? 0)) * 5);
  ctx.rotate((o.rot ?? 0) + (1 - Math.min(1, u)) * -0.07);
  ctx.scale(s, s);
  const body = [[-60, -140], [60, -140], [52, -86], [28, -34], [24, -18], [24, 14], [34, 30], [34, 48], [-34, 48], [-34, 30], [-24, 14], [-24, -18], [-28, -34], [-52, -86]];
  // big ears: full rings drawn behind the bowl, so the body hides the inner arc
  ctx.save(); ctx.lineCap = 'round';
  for (const [ex, rot] of [[-62, -0.14], [62, 0.14]]) {
    ctx.strokeStyle = FT.black; ctx.lineWidth = 26;
    ctx.beginPath(); ctx.ellipse(ex, -96, 36, 58, rot, 0, TAU); ctx.stroke();
    ctx.strokeStyle = gold; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.ellipse(ex, -96, 36, 58, rot, 0, TAU); ctx.stroke();
  }
  ctx.restore();
  // body
  paint(body, { fill: gold, line: FT.black, w: 6, tex: [{ k: 'hatch', a: 0.9, gap: 9, c: goldD, al: 0.18, w: 2 }] });
  // rim
  paint([[-72, -154], [72, -154], [72, -138], [-72, -138]], { fill: gold, line: FT.black, w: 5 });
  // stem + base
  paint([[-17, 48], [17, 48], [23, 86], [23, 97], [-23, 97], [-23, 86]], { fill: gold, line: FT.black, w: 5 });
  paint([[-52, 97], [52, 97], [44, 118], [-44, 118]], { fill: gold, line: FT.black, w: 5 });
  // base plate + shine
  ctx.fillStyle = FT.black; ctx.fillRect(-44, 118, 88, 6);
  ink([[-38, -128], [-48, -92]], { color: FT.yellowL, w: 7, amt: 1.0, key: 'cup' + h + x });
  ctx.restore();
}
// smaller crown cup (league / treble marker)
function tifoSmallCup(x, y, h, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  const s = (h / 180) * lerp(0.78, 1, Math.min(1, u));
  const gold = o.c ?? FT.yellow, goldD = o.cd ?? FT.yellowD;
  ctx.save();
  ctx.translate(x, y + Math.sin(TT * 1.3 + x * 0.02) * 4);
  ctx.rotate((o.rot ?? 0) + (1 - Math.min(1, u)) * -0.06);
  ctx.scale(s, s);
  // handles
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = FT.black; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.ellipse(-46, -76, 22, 30, 0, Math.PI * 0.6, Math.PI * 1.84); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(46, -76, 22, 30, 0, -Math.PI * 0.84, Math.PI * 0.4); ctx.stroke();
  ctx.strokeStyle = gold; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.ellipse(-46, -76, 22, 30, 0, Math.PI * 0.6, Math.PI * 1.84); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(46, -76, 22, 30, 0, -Math.PI * 0.84, Math.PI * 0.4); ctx.stroke();
  ctx.restore();
  // bowl
  paint([[-50, -96], [50, -96], [40, -58], [22, -30], [18, -18], [18, 10], [26, 22], [26, 38], [-26, 38], [-26, 22], [-18, 10], [-18, -18], [-22, -30], [-40, -58]], { fill: gold, line: FT.black, w: 5, tex: [{ k: 'hatch', a: 0.9, gap: 8, c: goldD, al: 0.16, w: 2 }] });
  paint([[-58, -110], [58, -110], [58, -96], [-58, -96]], { fill: gold, line: FT.black, w: 4 });
  paint([[-13, 38], [13, 38], [18, 70], [18, 80], [-18, 80], [-18, 70]], { fill: gold, line: FT.black, w: 4 });
  paint([[-42, 80], [42, 80], [34, 98], [-34, 98]], { fill: gold, line: FT.black, w: 4 });
  ctx.restore();
}

// --- silhouette legend badge -----------------------------------------
function tifoBust(r) {
  paint([[-r * 0.62, r * 0.5], [-r * 0.54, r * 0.1], [-r * 0.3, -r * 0.04], [-r * 0.24, -r * 0.16], [-r * 0.27, -r * 0.34], [-r * 0.16, -r * 0.54], [0, -r * 0.58], [r * 0.16, -r * 0.54], [r * 0.27, -r * 0.34], [r * 0.24, -r * 0.16], [r * 0.3, -r * 0.04], [r * 0.54, r * 0.1], [r * 0.62, r * 0.5]], { fill: FT.yellow, line: false });
}
function tifoLegend(x, y, r, name, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const sc = lerp(1.22, 1, Math.min(1, u));
  ctx.save();
  ctx.translate(x, y + Math.sin(TT * 1.2 + x * 0.013) * 3);
  ctx.rotate((o.rot ?? 0) + (1 - Math.min(1, u)) * 0.05);
  ctx.scale(sc, sc);
  tifoShadowDisc(0, 0, r);
  ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = FT.yellow; ctx.lineWidth = Math.max(3, r * 0.075); ctx.beginPath(); ctx.arc(0, 0, r * 0.91, 0, TAU); ctx.stroke();
  tifoBust(r * 0.92);
  // name plate
  const ns = r * 0.26, nw = Math.max(tifoW(name, ns) + r * 0.34, r * 1.7), nh = r * 0.4;
  ctx.save(); ctx.translate(0, r * 1.08); ctx.rotate(-0.03);
  ctx.fillStyle = FT.black; ctx.fillRect(-nw / 2, -nh / 2, nw, nh);
  ctx.strokeStyle = FT.yellow; ctx.lineWidth = Math.max(2, r * 0.03); ctx.strokeRect(-nw / 2 + 3, -nh / 2 + 3, nw - 6, nh - 6);
  tifoText(name, 0, nh * 0.36, ns, FT.yellow, { align: 'center', shadow: false });
  ctx.restore();
  ctx.restore();
}

function tifoFlame(x, y, s, c, o = {}) {
  const f = 1 + 0.16 * Math.sin(TT * 8 + (o.ph ?? 0));
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s * f);
  ctx.beginPath(); ctx.moveTo(0, 2); ctx.bezierCurveTo(-26, -16, -18, -52, 2, -84); ctx.bezierCurveTo(8, -48, 32, -32, 17, -2); ctx.bezierCurveTo(10, 5, -5, 6, 0, 2);
  ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = FT.black; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(2, -10); ctx.bezierCurveTo(-8, -32, -2, -50, 6, -64); ctx.bezierCurveTo(14, -40, 20, -24, 10, -8); ctx.closePath();
  ctx.fillStyle = FT.yellowL; ctx.fill();
  ctx.restore();
}

function tifoJersey(x, y, sc, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  const al = o.al ?? 1, trim = o.trim ?? FT.crimson, bg = o.bg ?? FT.red;
  const body = [[-30, -140], [-58, -126], [-104, -84], [-76, -44], [-50, -76], [-44, 42], [-40, 116], [40, 116], [44, 42], [50, -76], [76, -44], [104, -84], [58, -126], [30, -140], [0, -128]];
  ctx.save();
  ctx.translate(x, y - (1 - Math.min(1, u)) * 50 + Math.sin(TT * 1.1 + x * 0.01) * 3);
  ctx.rotate(o.rot ?? -0.04);
  ctx.scale(sc * lerp(0.88, 1, Math.min(1, u)), sc * lerp(0.88, 1, Math.min(1, u)));
  ctx.globalAlpha = al;
  paint(body, { fill: o.c ?? FT.cream, line: FT.black, w: 6, tex: [{ k: 'hatch', a: 0.9, gap: 10, c: o.cd ?? FT.paper, al: 0.14, w: 2 }] });
  ctx.strokeStyle = trim; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-58, -125); ctx.lineTo(-76, -44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(58, -125); ctx.lineTo(76, -44); ctx.stroke();
  ctx.strokeStyle = FT.black; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-58, -125); ctx.lineTo(-76, -44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(58, -125); ctx.lineTo(76, -44); ctx.stroke();
  ctx.strokeStyle = trim; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(0, -128, 30, 0.12, Math.PI - 0.12); ctx.stroke();
  ctx.strokeStyle = FT.black; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(0, -128, 30, 0.12, Math.PI - 0.12); ctx.stroke();
  ctx.strokeStyle = FT.black; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-20 + i * 13, -120); ctx.lineTo(-14 + i * 13, -104); ctx.stroke(); }
  ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(-30, -84, 17, 0, TAU); ctx.fill(); ctx.strokeStyle = FT.black; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = FT.yellow; ctx.beginPath(); ctx.arc(-30, -84, 8, 0, TAU); ctx.fill();
  tifoText('UNITED', 0, -82, 18, trim, { align: 'center', shadow: false, fam: TIFO_S, weight: 800 });
  tifoText('7', 0, 42, 118, o.numC ?? trim, { align: 'center', shadow: false });
  ctx.save(); trace(body, true); ctx.clip();
  const g = ctx.createLinearGradient(0, 38, 0, 120);
  g.addColorStop(0, 'rgba(42,18,9,0)'); g.addColorStop(0.55, 'rgba(42,18,9,0.6)'); g.addColorStop(1, 'rgba(10,5,3,0.96)');
  ctx.fillStyle = g; ctx.fillRect(-120, 36, 240, 90);
  ctx.globalAlpha = al * 0.92; ctx.fillStyle = bg;
  for (const [hx, hy, hr] of [[-22, 86, 9], [14, 98, 7], [34, 72, 5], [-46, 64, 5]]) { ctx.beginPath(); ctx.ellipse(hx, hy, hr * 1.5, hr, 0.3, 0, TAU); ctx.fill(); }
  ctx.globalAlpha = al; ctx.restore();
  ctx.strokeStyle = FT.signal; ctx.lineWidth = 5; ctx.globalAlpha = al * 0.65;
  ctx.beginPath(); ctx.moveTo(-40, 108); ctx.lineTo(-18, 92); ctx.lineTo(4, 112); ctx.lineTo(26, 94); ctx.lineTo(40, 110); ctx.stroke();
  ctx.globalAlpha = al;
  tifoFlame(-38, 112, 0.7, FT.yellow, { ph: 0.4 });
  tifoFlame(-6, 116, 1.0, FT.signal, { ph: 1.7 });
  tifoFlame(24, 112, 0.8, FT.yellow, { ph: 2.9 });
  ctx.restore();
}

function tifoPlayer(x, y, h, pose, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const s = h / 300 * lerp(0.88, 1, Math.min(1, u)), c = o.c ?? FT.yellow;
  ctx.save();
  ctx.translate(x, y + Math.sin(TT * 1.4 + x * 0.01) * 2.5);
  ctx.rotate((o.rot ?? 0) + (1 - Math.min(1, u)) * 0.04);
  ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const seg = (a, b, w = 17) => {
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = FT.black; ctx.lineWidth = w + 10; ctx.stroke();
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke();
  };
  const shoe = (px, py, dir = 1) => {
    ctx.save(); ctx.translate(px, py); ctx.scale(dir, 1);
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.ellipse(5, 2, 16, 9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(4, 0, 12, 5, 0, 0, TAU); ctx.fill();
    ctx.restore();
  };
  const head = (px, py, r) => {
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(px, py, r + 6, 0, TAU); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill();
  };
  const disc = (px, py, r) => {
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(px, py, r + 5, 0, TAU); ctx.fill();
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill();
  };
  if (pose === 'ferguson') {
    seg([-15, 46], [-19, 144], 18); seg([15, 46], [19, 144], 18);
    shoe(-19, 146, -1); shoe(19, 146, 1);
    paint([[-42, -96], [42, -96], [52, 40], [28, 58], [-28, 58], [-52, 40]], { fill: c, line: FT.black, w: 7 });
    seg([-42, -84], [22, -30], 17); seg([42, -84], [-22, -30], 17);
    head(0, -122, 18);
    ctx.fillStyle = FT.black; ctx.fillRect(-21, -137, 42, 7); ctx.fillRect(-26, -132, 52, 5);
    ctx.beginPath(); ctx.moveTo(0, -101); ctx.lineTo(-9, -84); ctx.lineTo(9, -84); ctx.closePath(); ctx.fill();
  } else if (pose === 'ronaldo') {
    seg([-13, 38], [-36, 146], 18); seg([13, 38], [38, 146], 18);
    shoe(-36, 148, -1); shoe(38, 148, 1);
    seg([-24, -88], [-82, -124], 14); seg([24, -88], [82, -124], 14);
    paint([[-26, -98], [26, -98], [30, 36], [-30, 36]], { fill: c, line: FT.black, w: 7 });
    disc(-82, -124, 7); disc(82, -124, 7);
    head(0, -124, 16);
    tifoText('7', 0, 8, 58, FT.black, { align: 'center', shadow: false });
  } else if (pose === 'rooney') {
    seg([-2, 40], [-24, 146], 18); shoe(-24, 148, -1);
    seg([12, 34], [62, 76], 17); seg([62, 76], [92, 64], 15);
    paint([[-24, -94], [22, -94], [30, 42], [-16, 50]], { fill: c, line: FT.black, w: 7 });
    seg([-20, -86], [-62, -58], 15); seg([20, -86], [58, -118], 15);
    disc(-62, -58, 7); disc(58, -118, 7);
    head(-4, -120, 17);
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(108, 74, 17, 0, TAU); ctx.fill();
    ctx.fillStyle = FT.cream; ctx.beginPath(); ctx.arc(108, 74, 12, 0, TAU); ctx.fill();
    ctx.fillStyle = FT.black; ctx.beginPath(); ctx.arc(108, 74, 5, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// --- arrows, bolts, stickers -----------------------------------------
function tifoArrow(x1, y1, x2, y2, c, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  const ang = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1);
  const head = Math.min(len * 0.34, o.head ?? 56), w = o.w ?? 24;
  ctx.save();
  ctx.translate(x1 - Math.cos(ang) * (1 - Math.min(1, u)) * 44, y1 - Math.sin(ang) * (1 - Math.min(1, u)) * 44);
  ctx.rotate(ang);
  ctx.scale(lerp(0.9, 1, Math.min(1, u)), lerp(0.9, 1, Math.min(1, u)));
  paint([[0, -w / 2], [len - head, -w / 2], [len - head, -w * 1.4], [len, 0], [len - head, w * 1.4], [len - head, w / 2], [0, w / 2]], { fill: c, line: FT.black, w: 5 });
  ctx.restore();
}
function tifoDownArrow(x, y, h, c, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  const w = h * 0.34;
  ctx.save();
  ctx.translate(x, y - (1 - Math.min(1, u)) * 70);
  ctx.rotate((o.rot ?? 0) + (1 - Math.min(1, u)) * 0.08);
  ctx.scale(lerp(0.8, 1, Math.min(1, u)), lerp(0.8, 1, Math.min(1, u)));
  paint([[-w / 2, -h * 0.5], [w / 2, -h * 0.5], [w / 2, h * 0.06], [w * 1.25, h * 0.06], [0, h * 0.5], [-w * 1.25, h * 0.06], [-w / 2, h * 0.06]], { fill: c, line: FT.black, w: 5 });
  ctx.restore();
}
function tifoBolt(x, y, s, c, o = {}) {
  const u = o.k != null ? popAt(o.k) : 1;
  if (u <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(lerp(0.5, 1, Math.min(1, u)) * s / 100, lerp(0.5, 1, Math.min(1, u)) * s / 100);
  paint([[4, -100], [46, -100], [16, -28], [52, -28], [-6, 100], [6, 6], [-30, 6], [22, -100]], { fill: c, line: FT.black, w: 5 });
  ctx.restore();
}
function tifoSticker(str, x, y, size, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const bg = o.bg ?? FT.yellow, fg = o.c ?? FT.black;
  const w = (o.fam === 's' ? tifoSW(str, size, 800) : tifoW(str, size)) + size * (o.pad ?? 1.1), h = size * 1.42;
  ctx.save();
  ctx.translate(x, y - (1 - Math.min(1, u)) * 50);
  ctx.rotate((o.rot ?? -0.04) + (1 - Math.min(1, u)) * 0.05);
  ctx.scale(lerp(0.85, 1, Math.min(1, u)), lerp(0.85, 1, Math.min(1, u)));
  ctx.save(); ctx.translate(9, 11); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
  ctx.fillStyle = bg; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = FT.black; ctx.lineWidth = 7; ctx.strokeRect(-w / 2, -h / 2, w, h);
  if (o.inner !== false) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 12, -h / 2 + 10, w - 24, h - 20); }
  if (o.fam === 's') tifoText(str, 0, h * 0.24, size, fg, { fam: TIFO_S, weight: 800, align: 'center', shadow: false });
  else tifoText(str, 0, h * 0.33, size, fg, { align: 'center', shadow: false });
  ctx.restore();
}
function tifoRibbon(str, x, y, size, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const w = tifoW(str, size) + size * 1.5, h = size * 1.3;
  ctx.save();
  ctx.translate(x, y - (1 - Math.min(1, u)) * 40);
  ctx.rotate((o.rot ?? -0.03) + (1 - Math.min(1, u)) * 0.04);
  ctx.scale(lerp(0.9, 1, Math.min(1, u)), lerp(0.9, 1, Math.min(1, u)));
  ctx.fillStyle = o.bg ?? FT.black; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = o.c ?? FT.yellow; ctx.lineWidth = 4; ctx.strokeRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10);
  tifoText(str, 0, h * 0.34, size, o.c ?? FT.yellow, { align: 'center', shadow: false });
  ctx.restore();
}

// --- series badge -----------------------------------------------------
function tifoPartBadge(x, y, sc, o = {}) {
  const u = popAt(o.k ?? 0);
  if (u <= 0) return;
  const big = o.big !== false;
  const w = (big ? 470 : 300) * sc, h = (big ? 300 : 76) * sc;
  ctx.save();
  ctx.translate(x, y - (1 - Math.min(1, u)) * (big ? 80 : 40));
  ctx.rotate((o.rot ?? 0.04) + (1 - Math.min(1, u)) * 0.06);
  ctx.scale(lerp(0.82, 1, Math.min(1, u)), lerp(0.82, 1, Math.min(1, u)));
  ctx.save(); ctx.translate(10, 12); ctx.fillStyle = 'rgba(0,0,0,0.34)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
  ctx.fillStyle = FT.black; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = FT.yellow; ctx.lineWidth = Math.max(3, 6 * sc); ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  if (big) {
    tifoText('PART', 0, -h * 0.14, 54 * sc, FT.white, { align: 'center', shadow: false });
    tifoText('1 / 10', 0, h * 0.25, 132 * sc, FT.yellow, { align: 'center', shadow: false });
    tifoText('TEN-PART SERIES', 0, h * 0.45, 26 * sc, FT.white, { fam: TIFO_S, weight: 800, align: 'center', shadow: false });
  } else {
    tifoText('PART 1 / 10', 0, h * 0.22, 40 * sc, FT.yellow, { align: 'center', shadow: false });
  }
  ctx.restore();
}

// =====================================================================
//  STYLE hooks
// =====================================================================
const STYLE = {
  name: 'football-tifo',
  paper: FT.red,
  backdrop(c) { tifoFill(c); },
  window(P, key, src) { ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); },
  blob(P, c, key) { paint(P, { fill: c, line: FT.black, w: 4 }); },
  hero(x, y, r, o) { tifoLegend(x, y, r, o.name ?? 'UNITED', o); },
  heroColor: FT.yellow,
  heroPts: (x, y, r) => ellipsePts(x, y, r * 0.72, r * 0.72, 0, 64),
  post() {
    grain({ n: 2800, dark: 'rgba(0,0,0,0.15)', light: 'rgba(255,255,255,0.055)' });
    tifoVignette(0.30);
    tifoScan('rgba(0,0,0,0.030)', 6);
  },
  ones: true,
};
