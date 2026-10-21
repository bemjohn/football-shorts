// =====================================================================
//  SCORE — football story demo, 35.4s voice-led Tifo explainer.
//  A D-minor bed that turns to D major for the series payoff; plucks,
//  table stings and stamps land on the spoken words (voice.json).
// =====================================================================
const at = (id, sec = 0) => SB[id].t0 + sec;
const END = typeof VOICE !== 'undefined' && VOICE.duration ? VOICE.duration : SB.series.t1 + 1.1;
const pl = (t, n, v, p = 0) => pluck(t, nz(n), v, p);

to = 'm';
// pads: glory -> memory -> grim -> tension -> bright payoff
pad(SB.hook.t0 - 0.10, SB.hook.t1 + 0.35, ['D3', 'F3', 'A3'], 0.019, { type: 'triangle', cut: 1050, att: 0.5, rel: 0.45 });
pad(SB.legends.t0 - 0.14, SB.legends.t1 + 0.26, ['Bb2', 'D3', 'F3'], 0.021, { type: 'triangle', cut: 1150, att: 0.5, rel: 0.45 });
pad(SB.midtable.t0 - 0.31, SB.midtable.t1 + 0.24, ['G2', 'Bb2', 'D3'], 0.019, { type: 'triangle', cut: 900, att: 0.5, rel: 0.5 });
pad(SB.fall.t0 - 0.31, SB.series.t0 + 0.26, ['A2', 'Cs3', 'E3'], 0.021, { type: 'triangle', cut: 1050, att: 0.45, rel: 0.45 });
pad(SB.series.t0 + 0.01, END, ['D3', 'Fs3', 'A3', 'D4'], 0.024, { type: 'triangle', cut: 1300, att: 0.35, rel: 0.5 });
pad(SB.series.t0 + 4.01, END, ['D3', 'A3', 'D4', 'Fs4'], 0.014, { type: 'triangle', cut: 1700, att: 0.6, rel: 0.5 });

// bass anchors
bass(at('hook'), nz('D2'), 0.42);
bass(at('hook', 2.2), nz('D2'), 0.32);
bass(at('legends'), nz('Bb2'), 0.40);
bass(at('legends', 2.5), nz('F2'), 0.30);
bass(at('legends', 4.5), nz('Bb2'), 0.32);
bass(at('midtable'), nz('G2'), 0.42);
bass(at('midtable', 2.6), nz('D3'), 0.30);
bass(at('midtable', 4.6), nz('Bb2'), 0.34);
bass(at('fall') - 0.05, nz('A2'), 0.46);
bass(at('fall', 1.6), nz('E3'), 0.28);
bass(at('fall', 2.4), nz('A2'), 0.38);
bass(at('series'), nz('D2'), 0.48);
bass(at('series', 2.4), nz('A2'), 0.38);
bass(at('series', 4.6), nz('D3'), 0.34);

// plucked motif per beat
pl(at('hook', 0.9), 'A4', 0.10, -0.2); pl(at('hook', 1.4), 'F4', 0.09, -0.1); pl(at('hook', 1.9), 'D4', 0.09, 0);
pl(at('hook', 2.9), 'E4', 0.08, 0.15); pl(at('hook', 3.4), 'F4', 0.08, 0.1);
// one pluck per legend name
pl(wT('legends', 'Ferguson', 1.2), 'F4', 0.11, -0.35);
pl(wT('legends', 'Scholes', 1.8), 'A4', 0.11, -0.18);
pl(wT('legends', 'Giggs', 2.2), 'C5', 0.11, 0);
pl(wT('legends', 'Ronaldo', 2.6), 'D5', 0.11, 0.18);
pl(wT('legends', 'Rooney', 3.0), 'F5', 0.10, 0.35);
pl(at('legends', 1.0), 'D5', 0.08, -0.2); pl(at('legends', 3.4), 'A4', 0.08, 0.2);
pl(at('legends', 5.4), 'D5', 0.09, -0.15); pl(at('legends', 6.4), 'F4', 0.08, 0.15);
// mid-table: a small descending figure, then the manager phrase
pl(at('midtable', 0.7), 'D4', 0.10, -0.2); pl(at('midtable', 2.2), 'C4', 0.09, 0.2);
pl(at('midtable', 3.5), 'Bb3', 0.09, -0.1); pl(wT('midtable', 'manager', 4.8), 'A3', 0.10, 0.1);
pl(at('midtable', 5.6), 'D4', 0.08, -0.15);
// fall: thin high notes over the drop
pl(at('fall', 0.5), 'A4', 0.09, -0.25); pl(at('fall', 1.2), 'E5', 0.08, 0.25);
pl(at('fall', 2.0), 'D5', 0.08, -0.1); pl(at('fall', 2.8), 'A4', 0.08, 0.15);
// series: rising motif, then the shock sting
pl(at('series', 0.9), 'D5', 0.11, -0.25); pl(at('series', 1.4), 'Fs5', 0.10, 0);
pl(at('series', 1.9), 'A5', 0.10, 0.2); pl(at('series', 2.4), 'D6', 0.09, 0.3);
chime(at('series', 2.4), [nz('D6'), nz('A6')], 0.05, -0.1);

// ---- sfx: transitions, stickers, stamps
to = 's';
noiseHit(at('hook'), 0.14, 'bandpass', 520, 1.4, 0.15, -0.25, 0.25);       // opening whoosh
sub(at('hook'), 0.38);
noiseHit(sT('hook', 0.75), 0.13, 'bandpass', 900, 1.5, 0.14, 0.2, 0.2);   // THE FEARED ERA sticker
sub(sT('hook', 0.75), 0.22);
sweep(at('legends') - 0.15, at('legends', 0.35), 0.13, 500, 3200);        // into the legends
noiseHit(wT('legends', 'trebles', 3.4), 0.16, 'bandpass', 760, 1.3, 0.16, -0.1, 0.25); // 1999 TREBLE sticker
sub(wT('legends', 'trebles', 3.4), 0.26);
sweep(at('midtable') - 0.12, at('midtable', 0.4), 0.12, 2400, 420);       // the turn to 2026
noiseHit(at('midtable', 0.15), 0.11, 'bandpass', 700, 1.6, 0.12, -0.25, 0.2); // standings card drops
noiseHit(wT('midtable', 'mid-table', 2.5), 0.12, 'bandpass', 620, 1.4, 0.14, 0.25, 0.2); // trend arrow
sub(wT('midtable', 'mid-table', 2.5), 0.26);
noiseHit(wT('midtable', 'booed', 3), 0.20, 'bandpass', 900, 1.2, 0.19, -0.2, 0.25);  // BOOED OFF stamp
sub(wT('midtable', 'booed', 3), 0.50);
noiseHit(wT('midtable', 'manager', 4.6), 0.14, 'bandpass', 1200, 1.4, 0.14, 0.25, 0.2); // JOB UNDER THREAT
sweep(at('fall') - 0.25, at('fall', 0.45), 0.15, 3400, 320);              // the drop
sub(at('fall', 0.1), 0.42);
noiseHit(sT('fall', 0.9), 0.16, 'bandpass', 640, 1.3, 0.15, 0.2, 0.25);   // trend arrow lands
sub(sT('fall', 0.9), 0.30);
noiseHit(wT('fall', 'fast', 4), 0.10, 'highpass', 4200, 0.9, 0.08, -0.1, 0.1);
riser(at('series') - 1.6, at('series') - 0.04, 0.16);                     // into the series
noiseHit(at('series'), 0.24, 'bandpass', 700, 1.3, 0.20, 0, 0.3);         // PART 1 / 10 slams in
sub(at('series'), 0.55);
chime(at('series'), [nz('D5'), nz('A5'), nz('D6')], 0.10, 0);
noiseHit(wT('series', 'shock', 5), 0.18, 'bandpass', 900, 1.2, 0.18, 0.1, 0.3);  // shock sting
sub(wT('series', 'shock', 5), 0.46);
chime(wT('series', 'shock', 5), [nz('D6'), nz('A6')], 0.07, 0);
chime(at('series', 8.2), [nz('A5'), nz('D6'), nz('A6')], 0.06, -0.15);

// a light pulse through the legends, a slow heartbeat through the table beat
for (let t = at('legends'); t < SB.midtable.t0 - 0.1; t += BEAT) {
  blip(t, 128, 44, 0.13, 0.10);
  noiseHit(t, 0.04, 'highpass', 6200, 0.8, 0.030, 0.1, 0);
}
for (let t = at('midtable'); t < SB.fall.t0 - 0.1; t += BEAT * 2) {
  blip(t, 104, 40, 0.16, 0.12);
  blip(t + BEAT * 0.28, 92, 38, 0.12, 0.07);
}
to = 'm';
