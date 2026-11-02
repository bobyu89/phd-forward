import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Hairline-style isometric line drawing: a stack of four books, an open journal with
 * a reference list, and one citation line from each reference to its book.
 * Built by hand (no dependency) after the rules of lucasmarkes/hairline:
 * opaque plates painted back to front, a silhouette plus one dim crease per solid,
 * one bright place at a time, springs for the pointer, nothing runs at rest.
 */

type V2 = [number, number];
type V3 = [number, number, number];

// ── camera: isometric, 30° ──
const C30 = Math.cos(Math.PI / 6);
const P = ([x, y, z]: V3): V2 => [(x - y) * C30, (x + y) * 0.5 - z];

const f = (n: number) => Math.round(n * 10) / 10;
const pathOf = (pts: V2[], close: boolean) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join("") + (close ? "Z" : "");

function hull(pts: V2[]): V2[] {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V2[] = [];
  for (const p of s) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  const up: V2[] = [];
  for (let i = s.length - 1; i >= 0; i--) {
    const p = s[i];
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/** A flat block in plan: centre, half sizes, corner radius, turn (radians). */
interface Block {
  cx: number;
  cy: number;
  hw: number;
  hd: number;
  r: number;
  rot: number;
}

/** Local (u, v) on a block → world (x, y). */
function local(b: Block, u: number, v: number): [number, number] {
  const c = Math.cos(b.rot);
  const s = Math.sin(b.rot);
  return [b.cx + u * c - v * s, b.cy + u * s + v * c];
}

/** Rounded-rectangle ring, four steps per corner, with outward normals in world space. */
function ring(b: Block, inset = 0): { p: [number, number]; n: number }[] {
  const out: { p: [number, number]; n: number }[] = [];
  const r = Math.max(b.r - inset, 0.5);
  const corners: [number, number, number][] = [
    [1, 1, 0],
    [-1, 1, 90],
    [-1, -1, 180],
    [1, -1, 270],
  ];
  for (const [sx, sy, a0] of corners) {
    const ox = sx * (b.hw - inset - r);
    const oy = sy * (b.hd - inset - r);
    for (let k = 0; k <= 4; k++) {
      const a = ((a0 + k * 22.5) * Math.PI) / 180;
      const u = ox + r * Math.cos(a);
      const v = oy + r * Math.sin(a);
      const na = a + b.rot;
      // facing the camera when the normal points toward +x+y
      out.push({ p: local(b, u, v), n: Math.cos(na) + Math.sin(na) });
    }
  }
  return out;
}

/** Silhouette (closed, filled with the plate) and crease (the front run of the top ring). */
function solid(b: Block, z0: number, z1: number, crease = 1.4) {
  const base = ring(b).map(({ p }) => P([p[0], p[1], z0]));
  const top = ring(b).map(({ p }) => P([p[0], p[1], z1]));
  const sil = pathOf(hull(base.concat(top)), true);
  const inner = ring(b, crease);
  // longest contiguous run of camera-facing points
  const start = inner.findIndex((q, i) => q.n > 0.05 && inner[(i - 1 + inner.length) % inner.length].n <= 0.05);
  const run: V2[] = [];
  for (let i = 0; i < inner.length; i++) {
    const q = inner[(start + i) % inner.length];
    if (q.n <= 0.05) break;
    run.push(P([q.p[0], q.p[1], z1]));
  }
  return { sil, crease: pathOf(run, false) };
}

// ── the scene, in world units ──

interface Book extends Block {
  z0: number;
  z1: number;
  rest: number; // how far the book sits out of the stack at rest
}

const BOOKS: Book[] = [
  { cx: 150, cy: -84, hw: 66, hd: 42, r: 3, rot: 0.03, z0: 0, z1: 15, rest: 2 },
  { cx: 148, cy: -86, hw: 60, hd: 38, r: 3, rot: -0.07, z0: 15, z1: 25, rest: -3 },
  { cx: 152, cy: -84, hw: 63, hd: 40, r: 3, rot: 0.05, z0: 25, z1: 38, rest: 12 },
  { cx: 147, cy: -86, hw: 54, hd: 34, r: 3, rot: -0.02, z0: 38, z1: 46, rest: 1 },
  { cx: 151, cy: -85, hw: 62, hd: 40, r: 3, rot: 0.06, z0: 46, z1: 60, rest: -2 },
  { cx: 149, cy: -86, hw: 50, hd: 32, r: 3, rot: -0.05, z0: 60, z1: 67, rest: 6 },
];
const REST_BOOK = 2;
const PULL = 30;

// open journal: a cover board and two pages
const COVER: Block = { cx: 92, cy: 68, hw: 86, hd: 62, r: 3, rot: 0 };
const PAGE_L: Block = { cx: 50, cy: 68, hw: 41, hd: 58, r: 2, rot: 0 };
const PAGE_R: Block = { cx: 134, cy: 68, hw: 41, hd: 58, r: 2, rot: 0 };
const PAGE_Z0 = 1.6;
const PAGE_Z1 = 4;

/** Text lines on a page: [v, length as a share of the line]. Lines run across the page (along x). */
const LEFT_LINES: [number, number][] = [
  [-46, 0.55],
  [-36, 0.92],
  [-28, 0.88],
  [-20, 0.95],
  [-12, 0.7],
  [-2, 0.9],
  [6, 0.93],
  [14, 0.84],
  [22, 0.9],
  [30, 0.6],
  [42, 0.88],
];
const CITED_LINE = 6; // the sentence that carries the citations
const RIGHT_TEXT: [number, number][] = [
  [-46, 0.9],
  [-38, 0.86],
  [-30, 0.5],
];
const REF_V = [-20, -8, 4, 16, 28, 40]; // one entry per book, top to bottom

const LINE_Z = PAGE_Z1 + 0.05;

function pageLine(page: Block, v: number, share: number, indent = 0): string {
  const x0 = -page.hw + 7 + indent;
  const x1 = x0 + (page.hw * 2 - 14 - indent) * share;
  const a = local(page, x0, v);
  const b = local(page, x1, v);
  return pathOf([P([a[0], a[1], LINE_Z]), P([b[0], b[1], LINE_Z])], false);
}

/** Where a reference entry starts (its dot), on the right page. */
function refDot(i: number): V3 {
  const p = local(PAGE_R, -PAGE_R.hw + 8, REF_V[i]);
  return [p[0], p[1], LINE_Z];
}

/** Where the cited sentence's superscript sits. */
const CITE_POINT: V3 = (() => {
  const p = local(PAGE_L, -PAGE_L.hw + 7 + (PAGE_L.hw * 2 - 14) * 0.93 + 4, LEFT_LINES[CITED_LINE][0] - 3);
  return [p[0], p[1], LINE_Z];
})();

/** Books slide out of the stack along their own +y, spine first, toward the journal. */
function movedBook(b: Book, pull: number): Book {
  const [x, y] = local(b, 0, pull);
  return { ...b, cx: x, cy: y };
}

function spinePoint(b: Book): V3 {
  const [x, y] = local(b, 0, b.hd);
  return [x, y, (b.z0 + b.z1) / 2];
}

function bookDetail(b: Book) {
  // headbands on the spine (+y face), pages on the tail (+x face)
  const bands = [-1, 1].map((s) => {
    const [x, y] = local(b, s * (b.hw - 12), b.hd);
    return pathOf([P([x, y, b.z0 + 2.4]), P([x, y, b.z1 - 2.4])], false);
  });
  const pages: string[] = [];
  const n = b.z1 - b.z0 > 11 ? 3 : 2;
  for (let k = 1; k <= n; k++) {
    const z = b.z0 + 1.8 + ((b.z1 - b.z0 - 3.6) * k) / (n + 1);
    const a = local(b, b.hw, -b.hd + 4);
    const c = local(b, b.hw, b.hd - 6);
    pages.push(pathOf([P([a[0], a[1], z]), P([c[0], c[1], z])], false));
  }
  return { bands, pages };
}

/** Citation link, a raised arc from the reference entry to the book's spine. */
function link(from: V3, to: V3): string {
  const mid: V3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, Math.max(from[2], to[2]) + 44];
  const a = P(from);
  const c = P(mid);
  const b = P(to);
  return `M${f(a[0])} ${f(a[1])}Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`;
}

// ── fit: the frame holds every book fully pulled out ──
const VIEW = (() => {
  const pts: V2[] = [];
  for (const b of BOOKS)
    for (const pull of [0, PULL + 4])
      for (const q of ring(movedBook(b, pull))) for (const z of [b.z0, b.z1]) pts.push(P([q.p[0], q.p[1], z]));
  for (const q of ring(COVER)) pts.push(P([q.p[0], q.p[1], 0]));
  for (let i = 0; i < BOOKS.length; i++) {
    const from = refDot(i);
    const to = spinePoint(BOOKS[i]);
    pts.push(P([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, Math.max(from[2], to[2]) + 44]));
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = 6;
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  return { x0, y0, w: Math.max(...xs) + pad - x0, h: Math.max(...ys) + pad - y0 };
})();

// static parts: the journal never moves
const JOURNAL = (() => {
  const cover = solid(COVER, 0, 1.6, 0.8);
  const left = solid(PAGE_L, PAGE_Z0, PAGE_Z1, 0.8);
  const right = solid(PAGE_R, PAGE_Z0, PAGE_Z1, 0.8);
  const text = LEFT_LINES.filter((_, i) => i !== CITED_LINE).map(([v, s]) => pageLine(PAGE_L, v, s));
  const cited = pageLine(PAGE_L, LEFT_LINES[CITED_LINE][0], LEFT_LINES[CITED_LINE][1]);
  const rightText = RIGHT_TEXT.map(([v, s]) => pageLine(PAGE_R, v, s));
  // each reference: a first line after its dot, and a hanging second line
  const refs = REF_V.map((v, i) => [pageLine(PAGE_R, v, 0.82 - (i % 3) * 0.08, 8), pageLine(PAGE_R, v + 5, 0.45 + (i % 2) * 0.25, 14)]);
  return { cover, left, right, text, cited, rightText, refs };
})();

// rest-pose hit test (rule 01): spine centres on screen never move with the books
const SPINE_REST = BOOKS.map((b) => P(spinePoint(b)));
const STACK_BOX = (() => {
  const pts: V2[] = [];
  for (const b of BOOKS)
    for (const pull of [b.rest, PULL])
      for (const q of ring(movedBook(b, pull))) for (const z of [b.z0, b.z1]) pts.push(P([q.p[0], q.p[1], z]));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
})();
const REF_SCREEN = REF_V.map((_, i) => P(refDot(i)));

function pick(x: number, y: number): number {
  if (x >= STACK_BOX.x0 && x <= STACK_BOX.x1 && y >= STACK_BOX.y0 && y <= STACK_BOX.y1) {
    let best = 0;
    for (let i = 1; i < SPINE_REST.length; i++)
      if (Math.abs(SPINE_REST[i][1] - y) < Math.abs(SPINE_REST[best][1] - y)) best = i;
    return best;
  }
  for (let i = 0; i < REF_SCREEN.length; i++) {
    const [rx, ry] = REF_SCREEN[i];
    if (x > rx - 8 && x < rx + 70 && Math.abs(y - (ry + 6)) < 5) return i;
  }
  return -1;
}

// springs, k 100 · c 18 · m 1
const K = 100;
const DAMP = 18;

function targets(active: number): number[] {
  if (active < 0) return BOOKS.map((b) => b.rest);
  return BOOKS.map((b, i) => {
    const d = Math.abs(i - active);
    return i === active ? PULL : b.rest * 0.4 + (d === 1 ? 4 : 0);
  });
}

export function HairlineLibrary({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(-1);
  const [pulls, setPulls] = useState<number[]>(() => targets(-1));
  const state = useRef({ x: targets(-1), v: BOOKS.map(() => 0), t: targets(-1), raf: 0, last: 0 });

  useEffect(() => {
    const s = state.current;
    s.t = targets(active);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      s.x = [...s.t];
      s.v = s.v.map(() => 0);
      setPulls([...s.x]);
      return;
    }
    if (s.raf) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      let moving = false;
      for (let i = 0; i < s.x.length; i++) {
        const a = -K * (s.x[i] - s.t[i]) - DAMP * s.v[i];
        s.v[i] += a * dt;
        s.x[i] += s.v[i] * dt;
        if (Math.abs(s.x[i] - s.t[i]) > 0.02 || Math.abs(s.v[i]) > 0.02) moving = true;
        else {
          s.x[i] = s.t[i];
          s.v[i] = 0;
        }
      }
      setPulls([...s.x]);
      s.raf = moving ? requestAnimationFrame(tick) : 0;
    };
    s.raf = requestAnimationFrame(tick);
  }, [active]);

  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const next = pick(pt.x, pt.y);
    if (next !== active) setActive(next);
  };

  const lit = active < 0 ? REST_BOOK : active;
  const books = useMemo(() => BOOKS.map((b, i) => movedBook(b, pulls[i])), [pulls]);

  return (
    <svg
      ref={svgRef}
      viewBox={`${f(VIEW.x0)} ${f(VIEW.y0)} ${f(VIEW.w)} ${f(VIEW.h)}`}
      className={`hairline ${className}`}
      role="img"
      aria-label="線條插畫：一疊書和一本攤開的期刊，文末的每一條參考文獻都拉了一條引用線，連到書堆裡的一本書。"
      onPointerMove={onMove}
      onPointerLeave={() => setActive(-1)}
    >
      {/* books, bottom to top, so each cover hides the one under it */}
      {books.map((b, i) => {
        const s = solid(b, b.z0, b.z1);
        const d = bookDetail(b);
        return (
          <g key={i}>
            <path className={`hl-plate hl-sil ${i === lit ? "is-hi" : ""}`} d={s.sil} />
            <path className="hl-crease" d={s.crease} />
            {d.pages.map((p) => (
              <path key={p} className="hl-crease" d={p} />
            ))}
            {d.bands.map((p) => (
              <path key={p} className="hl-crease" d={p} />
            ))}
          </g>
        );
      })}

      {/* the journal lies in front of the stack, so it is painted after it */}
      <g>
        <path className="hl-plate hl-sil" d={JOURNAL.cover.sil} />
        <path className="hl-plate hl-sil" d={JOURNAL.left.sil} />
        <path className="hl-plate hl-sil" d={JOURNAL.right.sil} />
        <path className="hl-crease" d={JOURNAL.left.crease} />
        <path className="hl-crease" d={JOURNAL.right.crease} />
        {JOURNAL.text.map((d) => (
          <path key={d} className="hl-text" d={d} />
        ))}
        <path className="hl-text hl-cited" d={JOURNAL.cited} />
        {JOURNAL.rightText.map((d) => (
          <path key={d} className="hl-text" d={d} />
        ))}
        {JOURNAL.refs.map(([a, b], i) => (
          <g key={i}>
            <circle className={`hl-dot ${i === lit ? "is-hi" : ""}`} cx={REF_SCREEN[i][0]} cy={REF_SCREEN[i][1]} r={1.5} />
            <path className="hl-text" d={a} />
            <path className="hl-text" d={b} />
          </g>
        ))}
        <circle className="hl-dot" cx={P(CITE_POINT)[0]} cy={P(CITE_POINT)[1]} r={1.3} />
      </g>

      {/* citation lines last: they arc through the air above everything */}
      {books.map((b, i) => (
        <path key={i} className={`hl-link ${i === lit ? "is-hi" : ""}`} d={link(refDot(i), spinePoint(b))} />
      ))}
    </svg>
  );
}
