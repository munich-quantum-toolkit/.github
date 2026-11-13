/* Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
 * Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
 * SPDX-License-Identifier: MIT */
const sourceDeck = window.SC26_IQM_DECK;
const sourceCompilerDeck = window.MQSC_AWS_BOOTH;
const slides = [];
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const mathCache = new Map();
const math = (parts, ...values) => {
  const source = String.raw(parts, ...values);
  if (!mathCache.has(source))
    mathCache.set(
      source,
      katex.renderToString(source, {
        throwOnError: true,
        strict: "error",
        macros: { "\\ket": "\\lvert #1\\rangle" },
      }),
    );
  return mathCache.get(source);
};
const snippet = (id) =>
  `<pre class="highlight" data-snippet="${id}"><code>${SNIPPETS[id].html
    .split("\n")
    .map(
      (line, i) =>
        `<span class="code-line"><span class="line-no" aria-hidden="true">${i + 1}</span><span class="code-text">${line}</span></span>`,
    )
    .join("")}</code></pre>`;
const code = (id) => `<div class="code-block">${snippet(id)}</div>`;
const at = (step, body) =>
  `<div class="layer" data-step="${step}">${body}</div>`;
const staged = (frames) => frames.map((s, i) => at(i, s)).join("");
function add(id, chapter, title, body, builds = 0) {
  slides.push({
    id,
    chapter,
    title,
    builds,
    html: `<div class="tutorial-slide"><h2>${title}</h2><div class="stage">${body}</div></div>`,
  });
}
const C = {
  navy: "#142b45",
  blue: "#2f70b8",
  teal: "#087d92",
  pale: "#eaf2fa",
  line: "#cbdced",
  muted: "#526a83",
  orange: "#a45a19",
};
const text = (
  x,
  y,
  s,
  size = 32,
  anchor = "middle",
  color = C.navy,
  extra = "",
) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}" ${extra}>${esc(s)}</text>`;
const path = (d, color = C.blue, width = 4, extra = "") =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const arrow = (x1, y1, x2, y2, color = C.blue, extra = "") => {
  const dx = x2 - x1,
    dy = y2 - y1,
    l = Math.hypot(dx, dy),
    ux = dx / l,
    uy = dy / l,
    bx = x2 - 14 * ux,
    by = y2 - 14 * uy;
  return (
    path(
      `M${x1} ${y1}L${bx} ${by}`,
      color,
      3,
      `stroke-linecap="butt" ${extra}`,
    ) +
    `<path d="M${x2} ${y2}L${bx - 7 * uy} ${by + 7 * ux}L${bx + 7 * uy} ${by - 7 * ux}Z" fill="${color}"/>`
  );
};
const rect = (x, y, w, h, fill = C.pale, stroke = C.line, rx = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
const fm = (x, y, tex, w = 200, h = 65, size = 35) =>
  `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" class="svg-math" style="font-size:${size}px">${tex}</div></foreignObject>`;
const figure = (body, w = 1760, h = 610) =>
  `<svg class="diagram" viewBox="0 0 ${w} ${h}" role="img" aria-label="Technical illustration">${body}</svg>`;
const icon = MQSF_VIZ.icon;
function circuit(gates, n = 2, w = 800, labels = null) {
  const ys = Array.from({ length: n }, (_, i) => 80 + i * 100);
  let body = ys
    .map(
      (y, i) =>
        fm(0, y - 28, labels ? math`${labels[i]}` : math`q_${i}`, 58, 56, 27) +
        path(`M70 ${y}H${w - 20}`, C.muted, 3),
    )
    .join("");
  const dx = (w - 200) / Math.max(5, ...gates.map((g) => g[0] + 1));
  for (const [col, kind, q, t = null, build = 0, until = null] of gates) {
    const x = 120 + col * dx,
      y = ys[q];
    let g = "";
    if (kind === "CX")
      g =
        path(`M${x} ${y}V${ys[t]}`, C.navy, 3) +
        `<circle cx="${x}" cy="${y}" r="7" fill="${C.navy}"/><circle cx="${x}" cy="${ys[t]}" r="22" fill="white" stroke="${C.blue}" stroke-width="3"/>` +
        path(`M${x - 14} ${ys[t]}h28M${x} ${ys[t] - 14}v28`, C.blue, 3);
    else if (kind === "SWAP")
      g = path(
        `M${x} ${y}V${ys[t]}M${x - 12} ${y - 12}l24 24M${x - 12} ${y + 12}l24 -24M${x - 12} ${ys[t] - 12}l24 24M${x - 12} ${ys[t] + 12}l24 -24`,
        C.blue,
        4,
      );
    else if (kind === "M")
      g =
        rect(x - 30, y - 30, 60, 60, "white", C.blue, 7) +
        icon("measurement", x - 24, y - 26, 48);
    else
      g =
        rect(x - 30, y - 30, 60, 60, "white", C.blue, 7) +
        fm(x - 30, y - 28, math`${kind}`, 60, 56, 29);
    body += `<g data-build="${build}" ${until === null ? "" : `data-until="${until}"`}>${g}</g>`;
  }
  return figure(body, w, ys.at(-1) + 75);
}
const scene = (id, chapter, title, frames) =>
  add(id, chapter, title, staged(frames), frames.length - 1);
const bellGates = [
  [0, "H", 0],
  [2, "CX", 0, 1],
  [4, "M", 0],
  [4, "M", 1],
];
const overview = "System software";
const quantum = "Quantum programming";
const compiler = "Quantum compilation";
const integration = "HPC integration";

function technical(id, title, body) {
  return `<div class="tutorial-slide" data-topic="${id}"><h2 data-morph="heading">${title}</h2><div class="stage">${body}</div></div>`;
}
function animated(id, chapter, title, builds, render, playbacks = {}) {
  slides.push({
    id,
    chapter,
    title,
    builds,
    render: (s, p = 1) => technical(id, title, render(s, p ?? 1)),
    playbacks,
  });
}
function titleOverview() {
  const template = document.createElement("template");
  template.innerHTML = MQSF_OPENING.architecture("detail", 3, 1);
  template.content
    .querySelectorAll("a,[opacity='0']")
    .forEach((e) => e.remove());
  template.content.querySelectorAll("text").forEach((e) => {
    if (
      !e.closest(
        '[data-morph^="frontend-"], [data-morph^="stack-"], [data-morph^="world-device-"]',
      )
    )
      e.remove();
  });
  template.content
    .querySelectorAll("[data-morph]")
    .forEach((e) => e.removeAttribute("data-morph"));
  const svg = template.content.querySelector("svg");
  svg.setAttribute("viewBox", "0 -50 1760 760");
  return template.innerHTML;
}
slides.push({
  id: "welcome",
  chapter: "",
  title: "Connecting the Quantum and HPC Communities",
  builds: 0,
  html: `<div class="tutorial-slide cover"><h1>Connecting the<br>Quantum and<br>HPC Communities</h1><p class="cover-subtitle">High-Performance Software<br>for Quantum Computing</p><p class="authors"><strong>Lukas Burgholzer</strong> · <strong>Daniel Haag</strong><br>Patrick Hopf · Yannick Stade · Robert Wille</p><p class="affiliations">TUM · MQSC</p><img class="event-logo" src="${ASSETS.sc26}" alt="SC26"><div class="cover-art">${titleOverview()}</div></div>`,
});

const shotPrefix = [{ "00": 0, 11: 0 }];
for (const outcome of SAMPLING.shots) {
  const counts = { ...shotPrefix.at(-1) };
  counts[outcome]++;
  shotPrefix.push(counts);
}
function histogram(n) {
  const counts = shotPrefix[n],
    x0 = 85,
    y0 = 380,
    h = 300;
  let body = "";
  for (const percent of [0, 25, 50, 75, 100]) {
    const y = y0 - (percent * h) / 100;
    body +=
      path(`M${x0} ${y}H466`, C.line, 1.5) +
      text(x0 - 12, y + 8, percent + "%", 26, "end", C.muted);
  }
  for (const [i, value] of ["00", "11"].entries()) {
    const height = n ? (h * counts[value]) / n : 0,
      x = 112 + i * 206;
    body += `<rect data-outcome="${value}" data-count="${counts[value]}" data-frequency="${n ? counts[value] / n : 0}" x="${x}" y="${y0 - height}" width="96" height="${height}" fill="${i ? C.teal : C.blue}"/>`;
    body +=
      text(x + 48, y0 - height - 14, counts[value], 30) +
      text(x + 48, y0 + 42, value, 30);
  }
  return figure(body, 490, 440);
}
function measurementCircuit(cycle, active) {
  let body = circuit(bellGates, 2, 650, ["\\ket0", "\\ket0"]);
  let overlay = "";
  if (active) {
    const x = 90 + Math.min(cycle / 0.7, 1) * 390;
    overlay += `<path d="M${x} 38V222" stroke="${C.teal}" stroke-width="5" opacity="${cycle < 0.82 ? 0.65 : 0}"/>`;
    overlay += `<rect x="445" y="45" width="70" height="170" rx="10" fill="none" stroke="${C.teal}" stroke-width="5" opacity="${cycle > 0.65 && cycle < 0.95 ? 1 : 0}"/>`;
  }
  return body.replace("</svg>", overlay + "</svg>");
}
animated(
  "quantum-program",
  quantum,
  "A quantum program is a sampling experiment",
  5,
  (step, progress) => {
    const active = step >= 2 && progress < 1;
    const n =
      step < 2
        ? 0
        : step < 5
          ? step - 2 + (progress >= 0.86 ? 1 : 0)
          : 3 + Math.floor((SAMPLING.shots.length - 3) * progress);
    const cycle = step === 5 ? (progress * 14) % 1 : progress;
    return `<div class="sampling-flow">
    <section data-morph="sampling-code"><h3>Write a program</h3>${code("bell")}</section>
    <section class="sampling-circuit ${step < 1 ? "unrevealed" : ""}" data-morph="sampling-circuit"><h3>Execute a circuit</h3>${measurementCircuit(cycle, active)}</section>
    <section class="sampling-histogram ${step < 2 ? "unrevealed" : ""}" data-morph="sampling-histogram"><h3>Simulator samples</h3>${histogram(n)}<p class="shot-counter"><span data-shots="${n}">${n.toLocaleString("en-US")}</span> ${n === 1 ? "shot" : "shots"}</p></section>
  </div>`;
  },
  {
    2: { duration: 1500 },
    3: { duration: 1500 },
    4: { duration: 1500 },
    5: { duration: 6000 },
  },
);

function compilerMap() {
  const logo = (key, x, y, w, h, name) =>
    `<image href="${ASSETS[key]}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"><title>${name}</title></image>`;
  const label = (x, y, value, size = 26, anchor = "middle") =>
    text(x, y, value, size, anchor);
  // Shafts stop at the head base, 14 px before the destination.
  const connect = (d, both = false) =>
    path(
      d,
      C.blue,
      3,
      `stroke-linecap="butt" marker-end="url(#compiler-arrow)"${both ? ' marker-start="url(#compiler-arrow)"' : ""}`,
    );
  const pill = (x, y, w, name) =>
    rect(x, y, w, 38, "white") + label(x + w / 2, y + 27, name, 24);
  const version = (x, y, value) =>
    `<g class="format-version" transform="rotate(20 ${x + 35} ${y + 19})">${rect(x + 2, y + 3, 70, 38, "#142b4526", "none")}${rect(x, y, 70, 38, "#ffd166", "#e4a11b")}${text(x + 35, y + 28, value, 26, "middle", C.navy, 'font-weight="800"')}</g>`;
  const openqasm = (x) =>
    label(x + 190, 121, "OpenQASM 2 · 3", 28) + version(x + 300, 70, "3.1");
  const qiskit = (x) =>
    logo("pr-qiskit", x + 74, 200, 70, 62, "Qiskit") +
    label(x + 227, 240, "Qiskit", 28);
  return `<svg class="diagram compiler-map" viewBox="0 0 1760 690" role="img" aria-label="Compiler Collection: input formats, QC and QCO dialects, output formats, and jeff exchange with Catalyst, Quantinuum, NVIDIA and QuEra">
    <defs><marker id="compiler-arrow" viewBox="0 0 14 14" refX="0" refY="7" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L14 7L0 14Z" fill="${C.blue}"/></marker></defs>
    ${label(190, 40, "Input formats", 30)}
    ${rect(0, 70, 380, 350, "white")}
    ${openqasm(0)}
    ${qiskit(0)}
    ${logo("pr-pennylane", 70, 315, 240, 62, "PennyLane")}
    ${connect("M380 160H596")}${label(495, 142, "Import")}
    ${rect(610, 80, 490, 145)}
    ${label(855, 126, "QC", 40)}${label(855, 164, "Reference semantics")}
    ${pill(805, 180, 100, "CBit")}
    ${connect("M790 80V54Q790 42 802 42H908Q920 42 920 54V66")}
    ${label(855, 22, "Canonicalize")}
    ${connect("M725 225V336")}${label(705, 294, "Linearize", 26, "end")}
    ${connect("M985 350V239")}${label(1005, 294, "Bufferize", 26, "start")}
    ${rect(610, 350, 490, 170)}
    ${label(855, 397, "QCO", 40)}${label(855, 435, "Value semantics")}
    ${pill(714, 460, 150, "QTensor")}${pill(884, 460, 110, "CBit")}
    ${connect("M1100 385H1136Q1160 385 1160 409V461Q1160 485 1136 485H1114")}
    ${label(1180, 444, "Optimize", 26, "start")}
    ${connect("M1100 160H1366")}${label(1240, 142, "Export")}
    ${label(1570, 40, "Output formats", 30)}
    ${rect(1380, 70, 380, 460, "white")}
    ${openqasm(1380)}
    ${qiskit(1380)}
    ${logo("pr-qir", 1460, 296, 180, 66, "QIR")}${version(1604, 274, "2.1")}
    ${logo("pr-iqm", 1465, 405, 210, 70, "IQM")}
    ${connect("M770 520V586")}${connect("M940 600V534")}
    ${rect(610, 600, 490, 85, "white")}
    ${logo("pr-jeff", 780, 610, 150, 65, "jeff")}
    ${connect("M1114 645H1246", true)}${label(1180, 624, "Exchange", 24)}
    ${rect(1260, 555, 500, 130, "white")}
    <svg x="1275" y="565" width="220" height="46" viewBox="330 584 4340 498" preserveAspectRatio="xMidYMid meet"><title>PennyLane Catalyst</title><image href="${ASSETS.catalyst}" width="5000" height="1667"/></svg>
    ${logo("pr-quantinuum", 1510, 566, 230, 44, "Quantinuum")}
    ${logo("qce-nvidia", 1325, 633, 135, 33, "NVIDIA")}
    ${logo("quera", 1530, 621, 200, 52, "QuEra")}
  </svg>`;
}
add("compiler-map", compiler, "Inside the Compiler Collection", compilerMap());

scene(
  "mlir-operation",
  compiler,
  "MLIR: Multi-Level Intermediate Representation",
  [0, 1].map(
    (step) =>
      `<div class="mlir-primer"><div class="mlir-logos" data-morph="mlir-logos"><img src="${ASSETS["pr-mlir"]}" alt="MLIR"><img src="${ASSETS["pr-llvm"]}" alt="LLVM"></div>
  <div class="mlir-code" data-morph="mlir-code">${code("addition")}
  <div class="operation-anatomy ${step < 1 ? "unrevealed" : ""}"><div class="operation"><span><code>%sum</code><small>result</small></span><b>=</b><span><code>arith.addi</code><small>dialect.operation</small></span><span><code>%a, %b</code><small>operands</small></span><b>:</b><span><code>i32</code><small>type</small></span></div></div></div></div>`,
  ),
);

function compactCircuit() {
  let body =
    fm(0, 9, math`q_0`, 56, 44, 25) +
    fm(0, 70, math`q_1`, 56, 44, 25) +
    path("M65 32H470M65 94H470", C.muted, 3);
  const positions = [105, 185, 265];
  for (const x of positions)
    body +=
      rect(x - 24, 8, 48, 48, "white", C.blue, 6) +
      fm(x - 24, 9, math`H`, 48, 44, 27);
  body +=
    path("M380 32V94", C.navy, 3) +
    `<circle cx="380" cy="32" r="6" fill="${C.navy}"/><circle cx="380" cy="94" r="18" fill="white" stroke="${C.blue}" stroke-width="3"/>` +
    path("M368 94h24M380 82v24", C.blue, 3);
  return figure(body, 480, 126);
}
function qcoDAG(hadamards = 3) {
  const xs = hadamards === 3 ? [92, 190, 288] : [190],
    y = 38,
    low = 105;
  let body = `<circle cx="10" cy="${y}" r="6" fill="white" stroke="${C.navy}" stroke-width="2"/><circle cx="10" cy="${low}" r="6" fill="white" stroke="${C.navy}" stroke-width="2"/>`;
  let previous = 18;
  for (const [i, x] of xs.entries()) {
    body +=
      arrow(previous, y, x - 23, y) +
      text((previous + x - 23) / 2, y - 12, i ? `%a${i}` : "%a", 24);
    body +=
      `<circle cx="${x}" cy="${y}" r="23" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>` +
      text(x, y + 9, "H", 27);
    previous = x + 23;
  }
  body +=
    arrow(previous, y, 398, y) +
    text((previous + 398) / 2, y - 12, `%a${hadamards}`, 24);
  body += arrow(18, low, 398, low) + text(200, low - 13, "%b", 24);
  body += rect(398, 12, 66, 116, C.pale, C.blue, 14) + text(431, 79, "CX", 26);
  body +=
    arrow(464, y, 554, y) +
    arrow(464, low, 554, low) +
    text(509, y - 12, "%c", 24) +
    text(509, low - 13, "%d", 24);
  return figure(body, 560, 140);
}
function programPanel(
  kind,
  source,
  column,
  visual = "",
  shown = true,
  key = kind,
) {
  return `<section class="program-panel ${shown ? "" : "unrevealed"}" data-morph="program-${key}" style="left:${column * 600}px"><div class="program-visual">${visual}</div><h3>${kind}</h3>${snippet(source)}</section>`;
}
function pythonFooter(optimization, shown) {
  const snippets = optimization ? ["simplify"] : ["import-qasm", "to-qco"];
  return `<div class="story-python ${optimization ? "optimization-python" : ""} ${shown ? "" : "unrevealed"}" data-morph="compiler-python">${snippets.map(snippet).join("")}</div>`;
}
animated(
  "representations",
  compiler,
  "One program, three representations",
  3,
  (step) =>
    `<div class="compiler-story"><div class="story-circuit" data-morph="program-circuit">${compactCircuit()}</div>${programPanel("OpenQASM", "source", 0)}${programPanel("QC", "qc", 1, "", step >= 1)}${programPanel("QCO", "qco", 2, qcoDAG(), step >= 2)}${pythonFooter(false, step >= 3)}</div>`,
);
animated(
  "optimize",
  compiler,
  "Optimize the program",
  2,
  (step) =>
    `<div class="compiler-story">${programPanel("QCO", "qco", 0.5, qcoDAG())}${programPanel("Optimized QCO", "optimized", 1.5, qcoDAG(1), step >= 1, "optimized")}${pythonFooter(true, step >= 2)}</div>`,
);

add(
  "execute",
  integration,
  "Compile and run your program",
  `<div class="api-example">${code("execute")}<section class="execution-output"><h3><code>Counts</code></h3>${histogram(SAMPLING.shots.length)}<p>${SAMPLING.shots.length.toLocaleString("en-US")} shots</p></section></div>`,
);

add(
  "conclusions",
  "CONCLUSIONS",
  "Conclusions",
  `<div class="closing-resources">${[
    ["Tutorial materials", "sc26", "qr-tutorial"],
    ["MQT Core", "pr-mqt", "pr-qr-core-repo"],
    ["QDMI", "pr-qdmi", "pr-qr-qdmi-repo"],
    ["MQSC", "mqsc", "qr-mqsc"],
  ]
    .map(
      ([title, logo, qr]) =>
        `<section class="closing-resource"><img class="closing-logo" src="${ASSETS[logo]}" alt="${title}"><h3>${title}</h3><img class="closing-qr${qr === "qr-mqsc" ? " mqsc-qr" : ""}" src="${ASSETS[qr]}" alt="QR code: ${title}"></section>`,
    )
    .join("")}</div>`,
);

// Presentation edits are applied at registration, leaving the reference source intact.
function presentationCopy(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const root = template.content;
  root.querySelector(".opening-paper")?.remove();
  const sequence = root.querySelector(".quantum-sequence .sequence-svg svg");
  if (sequence) {
    sequence.insertAdjacentHTML(
      "afterbegin",
      `<defs><marker id="afqmc-arrow" viewBox="0 0 8 8" refX="0" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${C.blue}"/></marker></defs>`,
    );
    sequence.querySelectorAll('[data-morph^="sequence-"]').forEach((group) => {
      const shaft = group.querySelector("line, path");
      group.querySelectorAll("path").forEach((node) => {
        if (node !== shaft) node.remove();
      });
      if (shaft.tagName === "line") {
        const x1 = Number(shaft.getAttribute("x1"));
        const x2 = Number(shaft.getAttribute("x2"));
        shaft.setAttribute("x2", x2 - Math.sign(x2 - x1) * 8);
      } else {
        shaft.setAttribute("d", "M395 175h28v30h-20");
      }
      shaft.setAttribute("stroke-width", "2");
      shaft.setAttribute("stroke-linecap", "butt");
      shaft.setAttribute("marker-end", "url(#afqmc-arrow)");
    });
  }
  const qrAssets = new Set(
    Object.entries(MQSF_ASSETS)
      .filter(([key]) => key.startsWith("qr-"))
      .map(([, value]) => value),
  );
  root.querySelectorAll("a").forEach((link) => {
    const qr = [...link.querySelectorAll("img,image")].find((image) =>
      qrAssets.has(image.getAttribute("src") || image.getAttribute("href")),
    );
    if (qr) {
      const replacement =
        link.namespaceURI === "http://www.w3.org/2000/svg"
          ? document.createElementNS(link.namespaceURI, "g")
          : document.createElement("div");
      replacement.setAttribute("class", link.getAttribute("class") || "");
      if (link.matches(".sc-card-resource, .talk-resource")) {
        replacement.append(...link.childNodes);
        const texts = document.createTreeWalker(
          replacement,
          NodeFilter.SHOW_TEXT,
        );
        while (texts.nextNode()) {
          if (texts.currentNode.textContent.includes("github.com/"))
            texts.currentNode.textContent = "";
        }
      } else replacement.append(qr);
      link.replaceWith(replacement);
    } else link.remove();
  });
  root
    .querySelectorAll(".opening-repo-stat, .opening-downloads, .qr-block .url")
    .forEach((e) => e.remove());
  root.querySelectorAll("img,image").forEach((e) => {
    const src = e.getAttribute("src") || e.getAttribute("href");
    if (!src || src === "undefined" || src.startsWith("omit:")) e.remove();
  });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (!n.parentElement?.closest("pre,code"))
      n.textContent = n.textContent
        .replace(/([·→]\s+)([a-z])/g, (_, sep, c) => sep + c.toUpperCase())
        .replaceAll("; ", ". ");
  }
  return template.innerHTML;
}
function structuredCopy(id, html) {
  if (id === "structured") return html;
  const template = document.createElement("template");
  template.innerHTML = html;
  const root = template.content;
  if (id === "grover-growth") {
    const equation = root.querySelector(".grover-equation");
    equation.outerHTML = `<div class="grover-equation latex-equation">${math`\displaystyle k=\left\lfloor\frac{\pi}{4\arcsin\!\left(2^{-n/2}\right)}\right\rfloor\approx\left\lfloor\frac{\pi}{4}\sqrt{2^n}\right\rfloor`}</div>`;
  }
  if (id === "adaptive-execution") {
    root.querySelector(".qpe-program > h3").innerHTML =
      `Iterative QPE · ${math`\varphi=1/3`} · 8 Bits`;
    const labels = new Map([
      ["k = 0, …, 7 · 8 Rounds", `${math`k=0,\ldots,7`} · 8 Rounds`],
      ["|0⟩", math`\ket{0}`],
      ["H", math`H`],
      ["X", math`X`],
      ["P", math`P`],
      ["P(θ)", math`P\!\left(\theta\right)`],
      ["Repeat 27−k Times", `Repeat ${math`2^{7-k}`} Times`],
      [
        "Controlled-U · U = P(π / 6)⊗4",
        `Controlled-${math`U`} · ${math`U=P\!\left(\pi/6\right)^{\otimes4}`}`,
      ],
      ["result[k]", math`\mathrm{result}[k]`],
      [
        "θ ← θ / 2 − π / 2 × result[k]",
        math`\theta\leftarrow\theta/2-\left(\pi/2\right)\,\mathrm{result}[k]`,
      ],
      [
        "θ ← 0 Initially · Next-Round Feedback",
        `${math`\theta\leftarrow0`} Initially · Next-Round Feedback`,
      ],
    ]);
    root.querySelectorAll(".qpe-nested svg text").forEach((node) => {
      const value = node.textContent;
      const qubit = value.match(/^q\[(\d+)\]$/);
      const content = qubit ? math`q_${qubit[1]}` : labels.get(value);
      if (!content) throw new Error(`Missing QPE math label: ${value}`);
      const size = Number(node.getAttribute("font-size"));
      const x = Number(node.getAttribute("x")),
        y = Number(node.getAttribute("y"));
      const width = qubit
        ? 64
        : value.length > 15
          ? 520
          : value.length > 2
            ? 170
            : 64;
      node.outerHTML = `<foreignObject x="${x - width / 2}" y="${y - size * 1.35}" width="${width}" height="${size * 2}"><div xmlns="http://www.w3.org/1999/xhtml" class="mqsf-math" style="font-size:${size}px;color:${node.getAttribute("fill") || C.navy}"><span>${content}</span></div></foreignObject>`;
    });
    const sequence = root.querySelector(".adaptive-sequence svg");
    sequence.insertAdjacentHTML(
      "afterbegin",
      `<defs><marker id="runtime-arrow" viewBox="0 0 9 9" refX="0" refY="4.5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="${C.blue}"/></marker></defs>`,
    );
    sequence.querySelectorAll('[data-morph^="sequence-"]').forEach((group) => {
      const shaft = group.querySelector("line, path");
      group.querySelectorAll("path").forEach((node) => {
        if (node !== shaft) node.remove();
      });
      if (shaft.tagName === "line") {
        const x1 = Number(shaft.getAttribute("x1"));
        const x2 = Number(shaft.getAttribute("x2"));
        shaft.setAttribute("x2", x2 - Math.sign(x2 - x1) * 9);
      } else {
        shaft.setAttribute("d", "M558 180h34v26h-25");
      }
      shaft.setAttribute("stroke-width", "3");
      shaft.setAttribute("stroke-linecap", "butt");
      shaft.setAttribute("marker-end", "url(#runtime-arrow)");
    });
  }
  return template.innerHTML;
}
function renderTechnical(slide, step) {
  const template = document.createElement("template");
  template.innerHTML = slide.html;
  template.content.querySelector(".tutorial-slide").dataset.topic = slide.id;
  template.content.querySelectorAll("[data-step]").forEach((e) => {
    if (Number(e.dataset.step) !== step) e.remove();
  });
  template.content
    .querySelectorAll("[data-build],[data-until]")
    .forEach((e) => {
      if (
        Number(e.dataset.build || 0) > step ||
        (e.hasAttribute("data-until") && Number(e.dataset.until) < step)
      )
        e.remove();
    });
  return template.innerHTML;
}
window.MQSC_AWS_BOOTH = {
  partner: "tum",
  register(context) {
    const { add } = context;
    const originals = new Map();
    sourceDeck.register({
      ...context,
      add: (...args) => originals.set(args[0], args),
    });
    sourceCompilerDeck.register({
      ...context,
      add: (...args) => {
        if (args[0] === "routing") originals.set("routing", args);
      },
    });
    const local = new Map(slides.map((s) => [s.id, s]));
    const custom = (id) => {
      const s = local.get(id);
      add(
        id,
        s.chapter,
        s.title,
        s.builds,
        s.render || ((step) => renderTechnical(s, step)),
        s.playbacks,
      );
    };
    const copy = (id, sourceId, section, limit = null) => {
      const [, , title, builds, render, playbacks] = originals.get(sourceId);
      const count = limit ?? builds;
      add(
        id,
        section,
        title,
        count,
        (s, p) => presentationCopy(render(s, p ?? 1)),
        Object.fromEntries(
          Object.entries(playbacks || {}).filter(([s]) => Number(s) <= count),
        ),
      );
    };
    const handoff = (id, number, title, files) =>
      add(
        id,
        "YOUR TURN",
        title,
        0,
        () =>
          `<section class="notebook-dark"><div class="notebook-main"><span class="notebook-index">${number}</span><div><h1>${title}</h1><div class="notebook-files">${files.map((f) => `<p>${f}.ipynb</p>`).join("")}</div></div></div><img class="notebook-qr" src="${ASSETS["qr-tutorial"]}" alt="QR code for tutorial materials"></section>`,
      );
    custom("welcome");
    for (const key of ["problem", "stack", "detail"]) copy(key, key, overview);
    custom("quantum-program");
    handoff("notebook-circuits", "01", "Build and sample a quantum circuit", [
      "circuit_basics",
    ]);
    copy("native-demo", "routing", compiler);
    for (const id of [
      "mlir-operation",
      "representations",
      "optimize",
      "compiler-map",
    ])
      custom(id);
    add(
      "break",
      "",
      "Break",
      0,
      () =>
        '<div class="chapter-separator"><h1>Break</h1><div class="chapter-rule"></div></div>',
    );
    handoff("notebook-compiler", "02", "Inspect, optimize, and compile", [
      "compiler_representations",
      "hardware_compilation",
    ]);
    copy("hybrid-algorithm", "hybrid-algorithm", integration);
    copy("afqmc-execution", "afqmc-execution", integration);
    copy("qdmi-interface", "qdmi-interface", integration, 3);
    copy("slurm-playground", "slurm-playground", integration);
    custom("execute");
    handoff("notebook-qdmi", "03", "Run programs through QDMI", [
      "qdmi_execution",
    ]);
    for (const id of ["grover-growth", "structured", "adaptive-execution"]) {
      const source = window.SC26_MQSF_SLIDES.find((slide) => slide.id === id);
      add(
        id,
        "STRUCTURED PROGRAMS",
        source.title,
        source.builds,
        (step, progress) =>
          `<div class="mqsf-copy">${structuredCopy(id, source.render(step, progress ?? 1))}</div>`,
        source.playbacks,
      );
    }
    custom("conclusions");
  },
};
