import { SUBJ } from "./data.js";

export const agg = fb => SUBJ.map(s => { const l = fb.filter(f => f.s === s), n = l.length; return { s, n, r: n ? l.reduce((a, f) => a + f.r, 0) / n : 0 } });

export const ago = t => { const m = Math.floor((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + " h ago" : Math.floor(m / 1440) + " d ago" };
