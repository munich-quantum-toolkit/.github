/*
 * Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
 * Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
 * All rights reserved.
 *
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License
 */

"use strict";
(() => {
  const data = window.MQSF_DATA;
  const assets = window.MQSF_ASSETS;
  const viz = window.MQSF_VIZ;
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  const app = data.application || {};
  const targets = data.targets || [];
  const references = data.references || {};
  const presentation = data.presentation || {};
  const modernLayout = presentation.modernLayout || presentation.deployment;
  const state = {
    slide: 0,
    step: 0,
    animation: null,
    token: 0,
    jump: "",
    overview: 0,
  };
  const svg = (body, box = "0 0 1600 650", name = "Illustration") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${esc(name)}">${body}</svg>`;
  const text = (x, y, s, size = 32, color = "#142b45", anchor = "middle") =>
    `<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
  const line = (x1, y1, x2, y2, color = "#2f70b8", width = 4) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
  const logo = (name, cls = "logo") =>
    `<img class="${cls}" src="${assets[name]}" alt="${esc(name === "tum-cda" ? "Chair for Design Automation, TUM" : name.toUpperCase())}" />`;
  const heading = (title, sub = "") =>
    `<h2 data-morph="heading">${title}</h2>${sub ? `<p class="subtitle">${sub}</p>` : ""}`;
  const qr = (name, url, caption, showStats = true) => {
    const stats = showStats && references.repo_stats?.[`https://${url}`];
    const stars = stats
      ? `<span class="repo-stars"><svg viewBox="0 0 24 24" aria-label="GitHub stars"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z" fill="#e7ae18"/></svg>${stats.stars}${stats.downloads ? ` · ${esc(stats.downloads)}` : ""}</span>`
      : "";
    return `<div class="qr-block" data-morph="qr-${name}"><img src="${assets[`qr-${name}`]}" alt="QR code: ${esc(url)}"/><div><div class="url">${url.startsWith("github.com/") ? logo("github", "github-mark") + esc(url.slice(11)) : esc(url)}</div><div class="caption">${esc(caption)}</div>${stars}</div></div>`;
  };
  const fmt = (n, digits = 2) =>
    Number(n).toLocaleString("en-US", { maximumFractionDigits: digits });
  function code(
    a,
    { start = 0, count = 11, hot = [], title, compact = false, key } = {},
  ) {
    if (!a?.code)
      return `<div class="code-frame"><p class="small">Capture unavailable</p></div>`;
    const lines = a.code.split("\n");
    start = Math.max(0, Math.min(start, Math.max(0, lines.length - 1)));
    const shown = lines.slice(start, start + count);
    const indent = Math.min(
      ...shown.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
      100,
    );
    const body = shown
      .map((raw, i) => {
        const l = raw.slice(indent),
          highlighted = a.lines_html?.[start + i]?.replace(
            new RegExp(`^ {0,${indent}}`),
            "",
          );
        const content = highlighted ?? esc(l);
        return `<span class="code-line ${hot.includes(start + i) ? "hot" : ""}"><span class="line-no">${start + i + (a.excerpt_start_line || 1)}</span><span class="code-text">${content}</span></span>`;
      });
    return `<div data-morph="code-${esc(key || a.id || title || a.label || a.language || "source")}" class="code-frame ${compact ? "compact" : ""}"><div class="code-title">${esc(title || a.label || a.language || "Actual source")}</div><pre class="highlight">${body.join("")}</pre></div>`;
  }
  const focus = (a, needle, before = 1) =>
    Math.max(
      0,
      (a?.code?.split("\n").findIndex((s) => s.includes(needle)) ?? 0) - before,
    );
  const flatten = window.MQSF_CIRCUIT.flatten;
  const circuit = window.MQSF_CIRCUIT.render;
  const appStage = (id) => {
    const v = targets[0]?.compilation || {};
    return [...(v.stages || []), ...(v.exports || [])].find((a) => a.id === id);
  };
  const stagesFor = (target) => [
    ...(target?.compilation?.stages || []),
    ...(target?.compilation?.exports || []),
  ];
  const targetStage = (target, id) =>
    stagesFor(target).find((a) => a.id === id);
  function recordedPosition(times, elapsed) {
    if (!times.length || elapsed <= times[0]) return 0;
    const next = times.findIndex((time) => time > elapsed);
    if (next < 0) return times.length - 1;
    return (
      next - 1 + (elapsed - times[next - 1]) / (times[next] - times[next - 1])
    );
  }
  // One fixed contrast domain across both trials and the complete recorded replay.
  const relativeWeightMax = modernLayout ? Math.max(1,
    ...(app.propagation?.curves || []).flatMap(curve => curve.frames.map(frame => {
      const weights = frame.walkers.map(walker => walker.weight),
        mean = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
      return mean > 0 ? Math.max(...weights) / mean : 0;
    }))) : 1;
  function walkerScene(progress = 1, elapsed = null, trial = 0) {
    const frames = app.propagation?.curves?.[trial]?.frames || [];
    if (!frames.length) return "";
    const awaiting = elapsed !== null && elapsed < Math.max(...frames[0].walkers.map(w => w.completed_ms));
    const index =
        elapsed === null
          ? Math.max(
              0,
              Math.min(frames.length - 1, progress * (frames.length - 1)),
            )
          : recordedPosition(
              frames.map((frame) =>
                Math.max(...frame.walkers.map((w) => w.completed_ms)),
              ),
              elapsed,
            ),
      low = Math.floor(index),
      high = Math.min(low + 1, frames.length - 1),
      fraction = index - low,
      current = frames[low],
      next = frames[high],
      tau = current.tau + (next.tau - current.tau) * fraction,
      weights = current.walkers.map(
        (walker, i) =>
          walker.weight + (next.walkers[i].weight - walker.weight) * fraction,
      ),
      max = Math.max(...weights),
      mean = weights.reduce((sum, weight) => sum + weight, 0) / weights.length,
      color = trial ? "#778899" : "#2f70b8",
      columns = modernLayout && elapsed !== null ? 16 : 32;
    // Rings retain every walker identity, even when its measured weight approaches zero.
    let body = current.walkers
      .map((walker, i) => {
        const x = (modernLayout ? 22 : 48) + (i % columns) * 34,
          y = (modernLayout ? 22 : 30) + Math.floor(i / columns) * 34,
          area = modernLayout
            ? Math.pow(mean > 0 ? weights[i] / mean / relativeWeightMax : 0, 4)
            : weights[i] / max,
          radius = awaiting ? 0 : 14 * Math.sqrt(area);
        return `<g data-morph="walker-${trial}-${walker.id}" data-trial="${trial}" data-walker-id="${walker.id}" data-weight="${awaiting ? "" : weights[i]}"><circle cx="${x}" cy="${y}" r="14" fill="none" stroke="#cbd9e6" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${awaiting ? 0 : 1}"/></g>`;
      })
      .join("");
    if (modernLayout) return `<div class="walker-field">${svg(body, columns === 16 ? "0 0 554 282" : "0 0 1098 146", `${trial ? "Hartree–Fock" : "Quantum"} trial: ${awaiting ? "awaiting propagation; " : ""}recorded walker weights with enhanced relative-weight contrast`)}</div>`;
    body += text(
      580,
      195,
      awaiting ? "Awaiting First Recorded Reduction" : `τ = ${fmt(tau, 2)} Ha⁻¹ · ${modernLayout ? "relative weights · enhanced contrast" : "filled area ∝ weight"}`,
      30,
      color,
    );
    return svg(
      body,
      "0 0 1160 220",
      `${trial ? "Hartree–Fock" : "Quantum-assisted"} trial: interpolated recorded walker states${modernLayout ? "; filled area uses relative weight to the fourth power, with one fixed scale across both trials and all frames" : ""}`,
    );
  }

  function deviceView(
    target = targets[0],
    activeSites = [],
    layout = null,
    blend = null,
    activeEdges = null,
  ) {
    const meta = target?.metadata || data.device,
      sites = meta.sites || [],
      edges = meta.edges || [];
    const full = edges.length > sites.length * 5,
      points = new Map();
    if (full)
      sites.forEach((s, i) =>
        points.set(s.id, {
          x: 410 + 245 * Math.cos((i * 2 * Math.PI) / sites.length),
          y: 310 + 245 * Math.sin((i * 2 * Math.PI) / sites.length),
        }),
      );
    else {
      // The full Emerald lattice fixes drawing coordinates; only advertised edges are drawn.
      const geometry = target?.id === "iqm.emerald" ? data.device.edges : edges;
      const graph = new Set(
          geometry.flatMap(([a, b]) => [`${a}:${b}`, `${b}:${a}`]),
        ),
        rows = [];
      [...sites]
        .sort((a, b) => a.id - b.id)
        .forEach((s) => {
          const r = rows.at(-1);
          if (r && graph.has(`${r.at(-1).id}:${s.id}`)) r.push(s);
          else rows.push([s]);
        });
      if (meta.display_rows) {
        rows.splice(0, rows.length, ...meta.display_rows.map(row => row.map(id => ({ id }))));
      }
      rows.forEach((r, y) => {
        let offset = 0;
        const connection = r.flatMap((s, x) =>
          (rows[y - 1] || [])
            .filter((a) => graph.has(`${a.id}:${s.id}`))
            .map((a) => points.get(a.id).x - x),
        )[0];
        if (connection !== undefined) offset = connection;
        r.forEach((s, x) => points.set(s.id, { x: x + offset, y }));
      });
      if (meta.display_positions) meta.display_positions.forEach(([id,x,y]) => points.set(id,{x,y}));
      const xs = [...points.values()].map((p) => p.x),
        minX = Math.min(...xs),
        maxX = Math.max(...xs),
        maxY = Math.max(1, ...[...points.values()].map(p => p.y)),
        scale = Math.min(640 / Math.max(1, maxX - minX), 470 / maxY);
      points.forEach((p) => {
        p.x = 410 + (p.x - (minX + maxX) / 2) * scale;
        p.y = 300 + (p.y - maxY / 2) * scale;
      });
    }
    const active = new Set(activeSites),
      colors = [
        "#2f70b8",
        "#087d92",
        "#8864bd",
        "#dd8d23",
        "#d46172",
        "#5b83a1",
      ];
    const fidelities = new Map(
      (target?.compiler_model?.operations || [])
        .filter((o) => o.numQubits === 2)
        .flatMap((o) =>
          (o.siteOverrides || [])
            .filter((v) => v.sites?.length === 2 && Number.isFinite(v.fidelity))
            .map((v) => [
              v.sites
                .slice()
                .sort((a, b) => a - b)
                .join(":"),
              v.fidelity,
            ]),
        ),
    );
    const fidelityColor = (f) =>
      f === undefined
        ? "#b8cee2"
        : f < 0.98
          ? "#ce9152"
          : f < 0.995
            ? "#54a0b2"
            : "#2f70b8";
    let body = edges
      .map(([a, b]) => {
        const p = points.get(a),
          q = points.get(b);
        if (!p || !q) return "";
        const f = fidelities.get([a, b].sort((x, y) => x - y).join(":")),
          hot =
            activeEdges === null
              ? active.has(a) && active.has(b)
              : activeEdges.has([a, b].sort((x, y) => x - y).join(":"));
        return `<line data-morph="device-edge-${a}-${b}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${hot ? "#087d92" : fidelityColor(f)}" stroke-width="${hot ? 6 : full ? 1 : 3.5}" opacity="${full ? 0.22 : 1}"><title>${a}–${b}${f === undefined ? "" : `: reported fidelity ${fmt(f * 100, 3)}%`}</title></line>`;
      })
      .join("");
    body += text(
      410,
      620,
      full ? "All-to-all connectivity" : "",
      24,
      "#526d88",
    );
    const r = sites.length > 80 ? 12 : sites.length > 40 ? 17 : 20;
    const tokens = (layout || [])
      .slice(0, 6)
      .map((site, i) => {
        const destination = points.get(site),
          origin = points.get(blend?.before?.[i]) || destination;
        if (!destination) return null;
        const t = blend?.fraction ?? 1,
          dx = destination.x - origin.x,
          dy = destination.y - origin.y,
          distance = Math.hypot(dx, dy),
          // Opposing exchanges take opposite arcs; recorded endpoints stay exact.
          arc = distance
            ? (Math.min(45, distance / 4) * Math.sin(Math.PI * t)) / distance
            : 0;
        return {
          x: origin.x + dx * t - dy * arc,
          y: origin.y + dy * t + dx * arc,
          i,
        };
      })
      .filter(Boolean);
    // Keep labels apart during schematic movement, never change recorded placements.
    if (blend?.fraction > 0 && blend.fraction < 1)
      for (let pass = 0; pass < 12; pass++)
        for (let i = 0; i < tokens.length; i++)
          for (let j = i + 1; j < tokens.length; j++) {
            const a = tokens[i],
              b = tokens[j],
              dx = b.x - a.x || 0.001,
              dy = b.y - a.y,
              distance = Math.hypot(dx, dy),
              shift = Math.max(
                0,
                (2 * (r + 5) + 4 - distance) / (2 * distance),
              );
            a.x -= dx * shift;
            a.y -= dy * shift;
            b.x += dx * shift;
            b.y += dy * shift;
          }
    body += sites
      .map((s) => {
        const p = points.get(s.id),
          hot = active.has(s.id);
        const covered = tokens.some(
          (t) => Math.hypot(t.x - p.x, t.y - p.y) < r + 18,
        );
        return `<g data-morph="device-node-${s.id}" transform="translate(${p.x} ${p.y})"><circle r="${r}" fill="${hot ? "#d4e9fa" : "#ecf3fa"}" stroke="${hot ? "#087d92" : "#92b2d0"}" stroke-width="${hot ? 4 : 1.5}"/>${covered ? "" : text(0, 6, meta.resonators?.includes(s.id) ? "R₁" : s.id, r > 15 ? 17 : 12, "#58718b")}</g>`;
      })
      .join("");
    tokens.forEach(({ x, y, i }) => {
      body += `<g data-morph="logical-qubit-${i}" transform="translate(${x} ${y})"><circle r="${r + 5}" fill="${colors[i]}" stroke="white" stroke-width="3"/>${text(0, 7, `q${i}`, 17, "white")}</g>`;
    });
    const xs = [...points.values()].map((p) => p.x),
      ys = [...points.values()].map((p) => p.y),
      left = Math.min(...xs) - r - 10,
      top = Math.min(...ys) - r - 10,
      right = Math.max(...xs) + r + 10,
      bottom = full ? 632 : Math.max(...ys) + r + 10;
    return `<div class="target-map" data-morph="target-map"><svg xmlns="http://www.w3.org/2000/svg" data-morph="target-map-svg" viewBox="${left} ${top} ${right - left} ${bottom - top}" role="img" aria-label="${esc(target?.label || "Emerald")} captured coupling graph">${body}</svg></div>`;
  }
  function programMetrics(target, id) {
    const m = target?.compilation?.metrics?.[id] || {},
      c = targetStage(target, id)?.circuit,
      ops = c ? flatten(c) : [];
    const two =
      m.two_qubit_operations ??
      ops.filter((o) => o.qubits?.length === 2).length;
    return `<div class="program-metrics" data-stage="${id}">${[
      [
        ops.filter(
          (o) =>
            o.qubits?.length === 1 && !["measure", "reset"].includes(o.name),
        ).length,
        "1Q",
      ],
      [two, "2Q"],
      [m.depth ?? 0, "D"],
    ]
      .map(
        ([v, l]) =>
          `<div data-morph="metric-${id}-${l.replaceAll(" ", "-")}"><b>${fmt(v, 0)}</b><span>${l}</span></div>`,
      )
      .join("")}</div>`;
  }
  // Display excerpts without modifying the captured artifact or its line numbers.
  function fullCode(
    a,
    title,
    {
      columns = 1,
      height = 510,
      width = 800,
      hot = null,
      entryOnly = false,
      fontSize = null,
    } = {},
  ) {
    if (!a?.code) return code(a, { title });
    const original = a.code.split("\n");
    const end = entryOnly
      ? original.findIndex(
          (l, i) => l === "}" && original[i - 1]?.includes("ret i64 0"),
        )
      : -1;
    const lines = [];
    original
      .slice(0, end < 0 ? original.length : end + 1)
      .forEach((raw, index) => {
        if (!raw.trim() && (entryOnly || index === original.length - 1)) return;
        lines.push({ raw, index });
      });
    const rows = Math.ceil(lines.length / columns);
    const longest = Math.max(...lines.map((l) => l.raw.length), 1);
    const font = fontSize ?? Math.min(
      23,
      height / rows / 1.18,
      (width / columns - 40) /
        (entryOnly ? Math.min(longest, 80) : longest) /
        0.61,
    );
    const effect = (l) =>
      /reset/.test(l)
        ? "reset"
        : /phi |add |icmp.*slt|for |while |loop/.test(l)
          ? "loop"
          : /if |br |read_result|measure|__mz__/.test(l)
            ? "branch"
            : "gate";
    const parts = Array.from(
      { length: columns },
      (_, c) =>
        `<pre class="highlight">${lines
          .slice(c * rows, (c + 1) * rows)
          .map(
            ({ raw, index }) =>
              `<span class="code-line ${hot && effect(raw) === hot ? "hot" : ""}" data-effect="${effect(raw)}"><span class="line-no">${index + 1}</span><span class="code-text">${a.lines_html?.[index] ?? esc(raw)}</span></span>`,
          )
          .join("")}</pre>`,
    ).join("");
    return `<div class="code-frame full-code" data-morph="full-${esc(title)}" data-complete-lines="${original.length}"><div class="code-title">${esc(title)}</div><div class="complete-code" style="--code-columns:${columns};--code-font:${font}px">${parts}</div></div>`;
  }
  const totalTime = (capture) => {
    const end = Math.max(
      0,
      ...(capture.events || []).map((e) => e.time_ms + (e.duration_ms || 0)),
      ...(capture.lifecycle || []).map((e) => e.time_ms),
    );
    return capture.program_completions
      ? end
      : Math.max(end, capture.completed_ms || 0, capture.duration_ms || 0);
  };
  const qdmiStart = (capture) =>
    capture.submission_started_ms ??
    capture.events?.find((e) => /try_submit_job|job_submit/.test(e.operation))
      ?.time_ms ??
    0;
  const interpolateTime = (capture, progress) =>
    qdmiStart(capture) + progress * (totalTime(capture) - qdmiStart(capture));
  const icon = (name, cls = "pictogram") =>
    `<span class="${cls}">${svg(viz.icon(name, 0, 0, 100), "0 0 100 100", name)}</span>`;
  const badge = (brand, label) =>
    `<div class="product-badge">${logo(brand)}<span>${label}</span></div>`;
  function runtimeSequence(capture, elapsed) {
    const batched = Array.isArray(capture.collections),
      adapter = batched || capture.trace_kind === "python-adapter-and-native-program-completions";
    const events = [
      ...(capture.events || []),
      ...(capture.runtime_events || []),
      ...(capture.lifecycle || []),
    ].sort((a, b) => a.time_ms - b.time_ms);
    const first = (predicate) => events.find(predicate);
    const links = batched
      ? [
          [0, 1, phaseTime("prepared") ? "Prepared OpenQASM 3" : "Compile Batch → OpenQASM 3", first(e => e.state === "compiling")],
          [1, 2, "Submit Program Batch", first(e => e.operation === "submission_end")],
          [2, 2, "Execute Programs", first(e => e.operation === "collection_start")],
          [2, 1, "Collect Batch Results", first(e => e.operation === "collection_end")],
          [1, 0, "Return Logical Samples", first(e => e.state === "done")],
        ]
      : adapter
      ? [
          [
            0,
            1,
            presentation.deployment ? "Compile → OpenQASM 3" : "Compile for IQM → QIR",
            first((e) => e.state === "compiling"),
          ],
          [
            1,
            2,
            "Submit One Program Batch",
            first((e) => /try_submit_job/.test(e.operation)),
          ],
          [2, 2, "Execute Programs", first((e) => e.state === "running")],
          [
            2,
            1,
            "Retrieve Indexed Results",
            first((e) => Number.isInteger(e.program_index)),
          ],
          [1, 0, "Return Samples", first((e) => e.state === "done")],
        ]
      : [
          [
            0,
            1,
            "Submit Adaptive QIR",
            first((e) => /job_submit/.test(e.operation)),
          ],
          [
            1,
            2,
            "Compile and Initialize JIT",
            first((e) => e.operation === "JIT compilation begins"),
          ],
          [
            2,
            2,
            "Execute Adaptive Shots",
            first((e) => e.operation.startsWith("Adaptive sampling begins")),
          ],
          [
            1,
            0,
            "Retrieve Results",
            first((e) => /get_results/.test(e.operation)),
          ],
        ];
    if (modernLayout && adapter) {
      const xs = [45, 220, 395], labels = ["Compile", "Submit Batch", "Execute", "Retrieve", "Samples"];
      let body = ["App", "MQT Core", "Execution"].map((name, i) => text(xs[i], 25, name, 26) + (i === 1 ? text(xs[i], 54, "QDMI", 20, "#5b7088") : "") + line(xs[i], 70, xs[i], 282, "#cbdced", 2)).join("");
      links.forEach(([a, b, , event], i) => {
        const y = 102 + i * 40, on = !!event && elapsed >= event.time_ms;
        body += `<g data-morph="sequence-${i}" opacity="${on ? 1 : .16}">${a === b ? `<path d="M${xs[a]} ${y - 7}h28v30h-28m7 -6l-7 6 7 6" fill="none" stroke="#2f70b8" stroke-width="4"/>` : line(xs[a], y, xs[b], y)}${a !== b ? `<path d="M${xs[b] + (b > a ? -7 : 7)} ${y - 5}L${xs[b]} ${y}L${xs[b] + (b > a ? -7 : 7)} ${y + 5}" fill="none" stroke="#2f70b8" stroke-width="2"/>` : ""}${text(a === b ? xs[a] + 42 : (xs[a] + xs[b]) / 2, a === b ? y + 16 : y - 11, labels[i], 26, "#142b45", a === b ? "start" : "middle")}</g>`;
      });
      return `<div class="sequence-svg">${svg(body, "0 0 560 290", "Recorded compilation, batch submission, DDSIM execution, indexed retrieval, and logical sample return")}</div>`;
    }
    const names = adapter
        ? ["Application", "Core / QDMI", modernLayout ? "Execution" : "IQM / DDSIM"]
        : ["QDMI", "DDSIM", "LLVM JIT"],
      xs = [82, 320, 558];
    let body = names
      .map(
        (n, i) =>
          text(xs[i], 30, n, adapter ? 24 : 27) +
          line(xs[i], 53, xs[i], adapter ? 430 : 275, "#cbdced", 2),
      )
      .join("");
    links.forEach(([a, b, label, e], i) => {
      const on = !!e && elapsed >= e.time_ms,
        y = adapter ? 105 + i * 72 : 90 + i * 50;
      body += `<g data-morph="sequence-${i}" opacity="${on ? 1 : 0.12}">${a === b ? `<path d="M${xs[a]} ${y - 10}h34v26h-34" fill="none" stroke="#2f70b8" stroke-width="4"/>` : line(xs[a], y, xs[b], y)}${a !== b ? `<path d="M${xs[b] + (b > a ? -7 : 7)} ${y - 5}L${xs[b]} ${y}L${xs[b] + (b > a ? -7 : 7)} ${y + 5}" fill="none" stroke="#2f70b8" stroke-width="2"/>` : ""}${text(a === b ? xs[a] - 20 : (xs[a] + xs[b]) / 2, a === b ? y + 7 : y - 17, label, adapter ? 18 : 22, "#142b45", a === b ? "end" : "middle")}</g>`;
    });
    return `<div class="sequence-svg">${svg(body, adapter ? "0 0 640 450" : "0 0 640 290", "Timestamped QDMI workflow")}</div>`;
  }
  function energyChart(progress = 1, compare = true, elapsed = null, legend = true) {
    const p = app.propagation;
    if (!p) return "";
    const curves = p.curves,
      ref = app.chemistry.fci_energy;
    const values = curves
      .flatMap((c) =>
        c.energy.flatMap((e, i) => [
          e - c.stderr[i] - ref,
          e + c.stderr[i] - ref,
        ]),
      )
      .map((e) => e * 1000);
    const padding = Math.max(
      1,
      (Math.max(...values) - Math.min(...values)) * 0.08,
    );
    const plotExtra = modernLayout && legend ? 25 : 0;
    const legendY = modernLayout ? 344 : 311;
    const low = Math.min(0, ...values) - padding,
      high = Math.max(Math.abs(low) * 1.8, ...values) + padding;
    const x = (t) => 78 + (t / p.tau.at(-1)) * 540,
      y = (e) => 190 + plotExtra - ((e - low) / (high - low)) * (135 + plotExtra);
    let body = text(
      78,
      29,
      "ΔE to exact (mHa)",
      32,
      "#142b45",
      "start",
    );
    body += text(618, 29, "Walker ±1 SE", 32, "#5b7088", "end");
    for (let i = 0; i <= 4; i++) {
      const value = low + ((high - low) * i) / 4,
        yy = y(value);
      body +=
        line(78, yy, 618, yy, "#e1eaf2", 1) +
        (Math.abs(yy - y(0)) > 38
          ? text(66, yy + 9, fmt(value, 0), 30, "#5b7088", "end")
          : "");
      body += text(
        78 + i * 135,
        226 + plotExtra,
        fmt((p.tau.at(-1) * i) / 4, 1),
        30,
        "#5b7088",
      );
    }
    body +=
      line(78, y(0), 618, y(0), "#d6882f", 2) +
      text(66, y(0) + 9, "0", 30, "#a96916", "end") +
      text(350, 269 + plotExtra, "Imaginary Time τ (Ha⁻¹)", 32);
    curves.forEach((c, j) => {
      if (j && !compare) return;
      const position =
        elapsed === null
          ? Math.max(
              0,
              Math.min(p.tau.length - 1, progress * (p.tau.length - 1)),
            )
          : recordedPosition(c.step_completed_ms || [], elapsed);
      const count =
        elapsed === null
          ? Math.floor(position) + 1
          : (c.step_completed_ms || []).filter((time) => time <= elapsed)
              .length;
      const coords = (sign = 0) => {
        const points = c.energy
          .slice(0, count)
          .map(
            (e, i) =>
              `${x(p.tau[i])},${y((e - ref + sign * c.stderr[i]) * 1000)}`,
          );
        if (count > 0 && count < p.tau.length) {
          const low = Math.floor(position),
            high = Math.min(low + 1, p.tau.length - 1),
            fraction = position - low,
            energy =
              c.energy[low] + (c.energy[high] - c.energy[low]) * fraction,
            error = c.stderr[low] + (c.stderr[high] - c.stderr[low]) * fraction,
            tau = p.tau[low] + (p.tau[high] - p.tau[low]) * fraction;
          points.push(`${x(tau)},${y((energy - ref + sign * error) * 1000)}`);
        }
        return points;
      };
      body += `<polygon data-morph="energy-band-${j}" points="${[...coords(1), ...coords(-1).reverse()].join(" ")}" fill="${j ? "#5b7088" : "#2f70b8"}" opacity="${j ? ".10" : ".16"}"/>`;
      body += `<polyline data-morph="energy-${j}" data-points="${count}" points="${coords().join(" ")}" stroke="${j ? "#5b7088" : "#2f70b8"}" stroke-width="${j ? 3 : 4}" fill="none" ${j ? 'stroke-dasharray="8 5"' : ""}/>`;
    });
    if (legend) body +=
      line(24, legendY, 57, legendY, "#2f70b8", 4) +
      text(69, legendY + 9, "Quantum Trial", 31, "#2f70b8", "start") +
      (compare
        ? `<path d="M317 ${legendY}h33" stroke="#5b7088" stroke-width="3" stroke-dasharray="8 5"/>` +
          text(363, legendY + 9, "Hartree–Fock", 31, "#5b7088", "start")
        : "");
    return `<div class="energy-chart">${svg(body, `0 0 640 ${legend ? legendY + 29 : 285}`, "Measured energy convergence with pointwise walker standard errors for both trials, conditional on one shadow trial")}</div>`;
  }
  function batchState(elapsed) {
    const capture = app.execution || {};
    const complete = (rows) =>
      new Set(
        (rows || [])
          .filter((e) => e.time_ms + (e.duration_ms || 0) <= elapsed)
          .map((e) => e.program_index),
      );
    // A collection boundary proves the entire batch has returned; it does not
    // supply individual remote completion times.
    const collected = capture.collections
      ? new Set(capture.collections.filter(e => e.time_ms <= elapsed).flatMap(e =>
          Array.from({length: e.num_programs}, (_, i) => e.first_program + i)))
      : null;
    return {
      prepared: complete(capture.preparation),
      compiled: complete(capture.compilation),
      done: capture.program_completions ? complete(capture.program_completions) : (collected ?? new Set()),
      retrieved: capture.retrievals ? complete(capture.retrievals) : (collected ?? complete(
        capture.events?.filter((e) => Number.isInteger(e.program_index)),
      )),
    };
  }

  function batchMatrix(elapsed, preparing = false) {
    const { prepared, compiled, done, retrieved } = batchState(elapsed),
      n = app.workload?.snapshots || 0,
      ready = (presentation.deployment || phaseTime("prepared")) ? new Set([...prepared].filter(index => compiled.has(index))) : prepared;
    // One cell per actual program; group no unrelated events into synthetic jobs.
    const cols = preparing || modernLayout ? 128 : 64,
      cell = 9,
      gap = 2,
      rows = Math.ceil(n / cols);
    const paths = ["", "", "", ""];
    for (let i = 0; i < n; i++) {
      const color = preparing
        ? (modernLayout ? ready : prepared).has(i)
          ? 3
          : 0
        : retrieved.has(i)
          ? 3
          : done.has(i)
            ? 2
            : compiled.has(i)
              ? 1
              : 0;
      paths[color] +=
        `M${(i % cols) * (cell + gap)} ${Math.floor(i / cols) * (cell + gap)}h${cell}v${cell}h-${cell}z`;
    }
    // Each program retains its own cell; four paths avoid thousands of DOM updates per frame.
    const body = paths
      .map(
        (path, i) =>
          `<path d="${path}" fill="${["#edf2f7", "#bbd1e8", "#d6882f", "#2f70b8"][i]}"/>`,
      )
      .join("");
    const counter = (value, label) => `<span${label === "Completed" ? ' class="completed"' : ""}${label === "Samples Ready" ? ' aria-label="Frontend processing complete; recorded samples and counts available"' : ""}><b class="batch-count" style="width:${fmt(n, 0).length}ch">${fmt(value, 0)}</b> <span class="count-label">${label}</span></span>`;
    return `<div class="batch-grid ${preparing ? "preparation-grid" : ""}" data-morph="${preparing ? "preparation" : "execution"}-grid" data-prepared="${prepared.size}" data-programs="${retrieved.size}" data-completed="${done.size}" data-compiled="${compiled.size}" data-elapsed-ms="${elapsed}">${svg(body, `0 0 ${cols * (cell + gap)} ${rows * (cell + gap)}`, preparing ? "One cell per prepared OpenQASM program" : "One cell per program: compiled, completed, retrieved").replace("<svg ", `<svg data-morph="${preparing ? "preparation" : "execution"}-inventory" `)}<div class="batch-counts" data-morph="${preparing ? "preparation" : "execution"}-counts">${preparing ? (modernLayout ? counter(ready.size, (presentation.deployment || phaseTime("prepared")) ? "Prepared and Compiled" : "Prepared") : `<span>${fmt(prepared.size, 0)} / ${fmt(n, 0)} Programs Prepared</span>`) : `${modernLayout ? "" : counter(compiled.size, "Compiled")}${counter(done.size, "Completed")}${counter(retrieved.size, modernLayout ? "Samples Ready" : "Retrieved")}`}</div></div>`;
  }
  function shadowBatchDrawing() {
    let body = [2, 1, 0].map(i => `<rect x="${24 + i * 12}" y="${28 - i * 9}" width="480" height="148" rx="12" fill="white" stroke="#a9bfd4" stroke-width="2"/>`).join("");
    body += [0, 1, 2, 3].map(i => line(42, 53 + i * 34, 485, 53 + i * 34, "#a0b9d1", 2)).join("");
    body += `<rect x="48" y="35" width="36" height="36" rx="5" fill="#eaf2fa" stroke="#2f70b8" stroke-width="2"/>${text(66, 63, "H", 29)}${line(109, 53, 109, 87)}<circle cx="109" cy="53" r="6" fill="#2f70b8"/><circle cx="109" cy="87" r="13" fill="white" stroke="#2f70b8" stroke-width="2"/>${line(109, 75, 109, 99)}${line(97, 87, 121, 87)}<rect x="146" y="35" width="140" height="138" rx="8" fill="#eaf2fa" stroke="#2f70b8" stroke-width="2"/><rect x="310" y="35" width="124" height="138" rx="8" fill="#fff4e5" stroke="#d6882f" stroke-width="2"/><text x="216" y="117" font-family="Inter,Arial,sans-serif" font-size="43" fill="#142b45" text-anchor="middle">U<tspan baseline-shift="sub" font-size="25">trial</tspan></text>${text(372, 117, "U(Qₖ)", 36, "#a96916")}`;
    body += [0, 1, 2, 3].map(i => `<rect x="449" y="${39 + i * 34}" width="29" height="27" rx="4" fill="white" stroke="#7fa8cb"/><path d="M455 ${58 + i * 34}a9 9 0 0 1 17 0M463 ${57 + i * 34}l6 -10" fill="none" stroke="#2f70b8" stroke-width="1.5"/>`).join("");
    return body;
  }
  function compactShadowBatch(progress = 1) {
    const p = Math.max(0, Math.min(1, progress));
    return `<div class="compact-shadow-batch" style="opacity:${p}">${svg(shadowBatchDrawing(), "0 0 540 185", "Four-wire shadow circuit: Hadamard and CNOT, trial preparation, random basis, and measurement")}</div>`;
  }
  function preparationSketch(progress = 1, compact = false) {
    const p = Math.max(0, Math.min(1, progress));
    if (compact && modernLayout) {
      const body = viz.icon("molecule", 8, 5, 100) + `<path d="M108 51H125V30H142M243 52V67M243 111V133H180V149" fill="none" stroke="#86aaca" stroke-width="2.5"/><rect x="142" y="8" width="202" height="44" rx="9" fill="#eaf2fa" stroke="#a9c6e1"/>${text(243, 39, "Trial State", 27)}<rect x="142" y="67" width="202" height="44" rx="9" fill="#fff4e5" stroke="#dfb579"/>${text(243, 97, "Random Basis", 25, "#a96916")}<g transform="translate(0 143) scale(.667)">${shadowBatchDrawing()}</g>`;
      return `<div class="preparation-sketch compact">${svg(body, "0 0 360 270", "Molecule, trial state, random basis, and generated quantum circuit")}</div>`;
    }
    let body = viz.icon("molecule", 28, 0, 110) + text(330, 56, "Molecular Hamiltonian", 28);
    body += `<g opacity="${Math.min(1, p * 3)}"><path d="M82 112V132" stroke="#86aaca" stroke-width="3"/><rect x="18" y="132" width="285" height="92" rx="13" fill="#eaf2fa" stroke="#a9c6e1"/><text x="160" y="165" font-family="Inter,Arial,sans-serif" font-size="29" fill="#142b45" text-anchor="middle">|Ψ<tspan baseline-shift="sub" font-size="19">trial</tspan>⟩ = U<tspan baseline-shift="sub" font-size="19">trial</tspan>|HF⟩</text>${text(160, 218, "Trial State", 28, "#5b7088")}</g>`;
    body += `<g opacity="${Math.max(0, Math.min(1, p * 3 - 1))}">${line(303, 178, 334, 178)}<rect x="334" y="132" width="190" height="92" rx="13" fill="#fff4e5" stroke="#dfb579"/>${text(429, 171, "U(Qₖ)", 32, "#a96916")}${text(429, 207, "Random Basis", 27)}</g>`;
    body += `<g opacity="${Math.max(0, Math.min(1, p * 3 - 2))}"><path d="M429 224V248H270V265" fill="none" stroke="#86aaca" stroke-width="3"/><g transform="translate(0 255)">${shadowBatchDrawing()}</g></g>`;
    return `<div class="preparation-sketch">${svg(body, "0 0 540 440", "Molecule and trial-state preparation connected through a random measurement basis to the circuit batch")}</div>`;
  }
  function sampleStream(progress = 1) {
    const preview = app.shadow_preview || [],
      shown = Math.ceil(progress * preview.length);
    return `<div class="sample-stream">${preview
      .slice(0, shown)
      .map(
        (sample, i) =>
          `<div data-morph="shadow-sample-${i}" style="opacity:${Math.min(1, progress * preview.length - i)}"><small>Circuit ${sample.program_index}</small><strong>${(sample.shots || []).map(esc).join("<br>")}<span>⋮</span></strong></div>`,
      )
      .join(
        "",
      )}<span class="sample-continuation" style="opacity:${progress}" aria-label="More program outputs">…</span></div>`;
  }
  const appHeading = "Quantum-Classical Auxiliary-Field Quantum Monte Carlo";
  const applicationHeading = () =>
    `<h2 class="application-heading" data-morph="heading">${appHeading}${modernLayout ? "" : "<small>QC-AFQMC</small>"}</h2>`;
  const appReference = () =>
    `<div class="application-paper-reference" data-morph="application-paper-reference">${qr("afqmc-paper", "arxiv.org/abs/2506.22408", "QC-AFQMC · Algorithm and Analysis")}</div><div class="application-reference" data-morph="application-reference">${logo("aws")}${qr("afqmc", "github.com/amazon-braket/amazon-braket-examples", "Amazon Braket · Public AFQMC Example", false)}</div>`;
  function appPanel(i, body) {
    return `<section data-morph="app-pillar-${i}" class="app-panel"><h3>${icon(["workstation", "cryostat", "server"][i])}<span>${[modernLayout ? "Prepare the Ansatz" : "Circuit Generation", "Quantum Shadow Collection", "Classical Monte Carlo"][i]}</span></h3><div class="app-panel-body">${body}</div><div class="app-badges">${i === 0 ? badge("pennylane", "") + (modernLayout ? badge("mqt", "") : "") : i === 1 ? badge("mqt", modernLayout ? "" : "Compiler Collection") + badge("qdmi", "") + (presentation.deployment && (app.execution?.backend !== "ddsim" || app.execution?.compilation_target) ? badge("braket", "Amazon<br>Braket") : "") : badge(modernLayout ? "orchestrator" : "mqsc", modernLayout ? "" : "Orchestrator") + (modernLayout ? badge("slurm", "") + (presentation.deployment ? badge("pcs", "AWS Parallel<br>Computing Service") : "") : "")}</div></section>`;
  }
  function appBody(i, progress = 1) {
    if (i === 0) return preparationSketch(progress);
    if (i === 1)
      return `<p class="panel-kicker">${fmt(app.workload?.snapshots, 0)} Circuits × ${fmt(app.workload?.shots_per_snapshot, 0)} Shots</p>${compactShadowBatch()}${sampleStream(progress)}${modernLayout ? '<small class="sample-selection">Selected observed shots</small>' : ""}`;
    return `${modernLayout ? "" : '<p class="panel-kicker">Walker Weights</p>'}${walkerScene(progress)}${modernLayout ? "" : `<div class="equation-caption"><img src="${assets["eq-afqmc-mean"]}" alt="Weighted local energy"/><span>Weighted Mean</span></div>`}${energyChart(progress)}`;
  }
  function applicationScene(step, progress = 1) {
    return `<div class="app-panels intro">${[0, 1, 2].map((i) => `<div class="${i > step ? "future" : ""}">${appPanel(i, appBody(i, i === step ? progress : 1))}</div>`).join("")}</div>${appReference()}`;
  }
  function preparationTrace(elapsed) {
    const rows = app.execution?.preprocessing || [],
      events = [...(app.execution?.preparation || []), ...(app.execution?.compilation || [])],
      first = Math.min(...events.map(e => e.time_ms)),
      conversion = {
        id: "payloads",
        label: "Prepare and Compile Programs",
        code: "PennyLane → MQT Core → OpenQASM 3",
        time_ms: first,
        duration_ms: preparationEnd() - first,
      };
    return `<div class="preprocessing-trace" data-morph="preprocessing-trace">${[
      ...rows,
      ...(conversion.duration_ms > 0 ? [conversion] : []),
    ]
      .map((row) => {
        const end = row.time_ms + row.duration_ms,
          active = elapsed >= row.time_ms && elapsed < end,
          done = elapsed >= end;
        return `<div data-morph="preprocessing-${row.id}" data-start-ms="${row.time_ms}" data-end-ms="${end}" class="${active ? "active" : done ? "done" : "pending"}"><div><b>${esc(row.id === "validation" ? "Capture Check: Majorana Convention" : row.label)}</b><time>${fmt(row.time_ms / 1000, 2)}–${fmt(end / 1000, 2)} s</time></div><code title="${esc(row.code)}">${esc(row.code.split("\n")[0])}</code></div>`;
      })
      .join("")}</div>`;
  }
  function preparationCode(elapsed, trace = false) {
    const definitions = app.source_definitions || {};
    // The build supplies verbatim executable lines with docstrings omitted for display.
    const left =
        app.presentation_source?.left ||
        [definitions.hydrogen_trial, definitions.apply_gaussian_givens]
          .filter(Boolean)
          .join("\n"),
      right =
        app.presentation_source?.right ||
        [definitions.apply_pauli_layer, app.source, app.batch_source]
          .filter(Boolean)
          .join("\n");
    const sources = [left, right],
      fontSize = modernLayout ? Math.min(18,
        285 / Math.max(...sources.map(s => s.split("\n").length)) / 1.18,
        ...sources.map((source, i) => (i ? 1040 : 570) / Math.max(...source.split("\n").map(line => line.length), 1) / .61)) : null;
    return `<div class="preparation-code">${[left, right].map((source, i) => `<div>${trace && !i && !modernLayout ? preparationTrace(elapsed) : fullCode({ code: source, lines_html: app.presentation_source?.[i ? "right_lines_html" : "left_lines_html"] }, modernLayout ? (i ? "Prepare and Execute the Batch" : "Shadow Circuit") : (i ? "Shadow Circuit and Batch" : "Trial State and Gaussian Rotations"), { height: i ? 400 : 255, width: 825, fontSize })}${i ? "" : batchMatrix(elapsed, true)}</div>`).join("")}</div>`;
  }
  const phaseTime = (name) =>
    app.execution?.lifecycle?.find((e) => e.state === name)?.time_ms || 0;
  const preparationEnd = () => phaseTime("prepared") || phaseTime("compiling");
  function preparationTime(progress) {
    const phases = app.execution?.preprocessing || [],
      ends = [0, ...phases.map(phase => phase.time_ms + phase.duration_ms), preparationEnd()],
      position = Math.max(0, Math.min(1, progress)) * (ends.length - 1),
      segment = Math.min(Math.floor(position), ends.length - 2),
      fraction = position - segment;
    return ends[segment] + fraction * (ends[segment + 1] - ends[segment]);
  }
  const quantumPlayback = {
    duration: 4000 + 13000 / 2.25 + 1500,
    transition: 850,
  };
  function quantumTime(progress) {
    const capture = app.execution;
    if (capture.collections) {
      const start = preparationEnd();
      const end = totalTime(capture), retrieval = capture.retrievals?.[0]?.time_ms ?? end;
      if (retrieval <= start || retrieval >= end) return start + progress * (end - start);
      const fraction = (retrieval - start) / (end - start), split = fraction / (fraction + (1 - fraction) / 1.75);
      return progress < split
        ? start + progress / split * (retrieval - start)
        : retrieval + (progress - split) / (1 - split) * (end - retrieval);
    }
    const breaks = [
      phaseTime("compiling"),
      qdmiStart(capture),
      capture.retrievals?.[0]?.time_ms || phaseTime("extracting-results"),
      totalTime(capture),
    ];
    const stops = [
      0,
      4000 / quantumPlayback.duration,
      1 - 1500 / quantumPlayback.duration,
      1,
    ];
    const segment = progress < stops[1] ? 0 : progress < stops[2] ? 1 : 2;
    const fraction =
      (progress - stops[segment]) / (stops[segment + 1] - stops[segment]);
    return breaks[segment] + fraction * (breaks[segment + 1] - breaks[segment]);
  }
  function propagationTime(progress) {
    const start = totalTime(app.execution),
      end = app.timeline?.completed_ms || start,
      origin = app.timeline?.propagation_started_ms || start,
      curves = app.propagation?.curves || [],
      first = origin + Math.min(...curves.map(c => c.step_completed_ms[0])),
      last = origin + Math.max(...curves.map(c => c.step_completed_ms.at(-1)));
    if (app.propagation?.initialization?.length) return start + (end - start) * progress;
    // Both ensembles advance together; retain the actual reduction times and skip empty startup.
    return progress < .96
      ? first + (last - first) * progress / .96
      : last + (end - last) * (progress - .96) / .04;
  }
  function workflowClock(step, progress = 1) {
    const finish = totalTime(app.execution),
      complete = app.timeline?.completed_ms || finish;

    const elapsed =
      step === 0
        ? 0
        : step === 1
          ? preparationTime(progress)
          : step === 2
            ? quantumTime(progress)
            : step === 3
              ? propagationTime(progress)
              : complete;
    const clock = `${fmt(elapsed / 1000, 2)} s · ${modernLayout ? "Replay Clock" : "Recorded Application Clock"}`;
    return `<div class="workflow-clock" data-morph="workflow-clock" data-elapsed-ms="${elapsed}"><div class="clock-stages"><span class="${step <= 1 ? "active" : ""}">${phaseTime("prepared") ? "Prepare · Compile" : "Prepare"}</span><span class="${step === 2 ? "active" : ""}">${phaseTime("prepared") ? (modernLayout ? "Run · Process Results" : "Run · Retrieve") : "Compile · Run · Retrieve"}</span><span class="${step >= 3 ? "active" : ""}">${modernLayout ? "Propagate" : "Propagate on Slurm"}</span><b>${clock}</b></div><div class="clock-line"><div style="width:${(100 * elapsed) / Math.max(1, complete)}%"></div></div></div>`;
  }
  function hybridExecution(step, progress = 1) {
    const focused = step < 2 ? 0 : step === 2 ? 1 : step === 3 ? 2 : -1;
    const elapsed =
      step === 2 ? quantumTime(progress) : step > 2 ? Infinity : 0;
    const quantum = `<div class="quantum-batch"><div data-morph="quantum-sequence" class="quantum-sequence"><p class="panel-kicker">${app.execution?.submitted_qdmi_jobs > 1 ? `${fmt(app.execution.submitted_qdmi_jobs, 0)} QDMI Jobs` : "One QDMI Job"} · <span class="program-total">${fmt(app.workload?.snapshots, 0)} Programs</span></p>${runtimeSequence(app.execution, elapsed)}</div>${batchMatrix(elapsed)}</div>`;
    const workers = app.propagation?.workers || [],
      nodes = new Set(workers.map((w) => w.node)).size;
    const propagationElapsed =
      step === 3
        ? propagationTime(progress) -
          (app.timeline?.propagation_started_ms || Infinity)
        : Infinity;
    const classical = `${modernLayout ? "" : `<div class="slurm-allocation">${logo("slurm")}<span>${nodes} Compute Nodes · ${workers.length} Slurm Ranks</span></div>`}<div class="walker-comparison">${[0, 1].map((trial) => `<div><b>${trial ? "Hartree–Fock Trial" : "Quantum Trial"}</b>${walkerScene(1, propagationElapsed, trial)}</div>`).join("")}</div>${energyChart(1, true, propagationElapsed, !modernLayout)}`;
    const bodies = [
      step < 2
        ? preparationCode(
            step === 0 ? 0 : preparationTime(progress),
            step === 1,
          )
        : preparationSketch(1, true) + (modernLayout ? batchMatrix(Math.min(elapsed, totalTime(app.execution)), true) : ""),
      step >= 2 ? quantum : appBody(1),
      step >= 3 ? classical : modernLayout ? "" : appBody(2),
    ];
    return `<div class="app-panels execution focus-${focused}">${bodies.map((body, i) => modernLayout && step === 2 && i === 2 ? "" : appPanel(i, body)).join("")}</div>${workflowClock(step, progress)}<div class="workflow-foot" data-morph="workflow-foot"><span>${fmt(app.workload?.snapshots, 0)} Programs · ${fmt(app.workload?.total_shots, 0)} Shots · ${app.propagation?.walkers} Walkers per Trial</span><span class="execution-target">${presentation.deployment ? (app.execution?.backend === "ddsim" ? `${app.execution.compilation_target ? `${logo("braket")}${logo("qdmi")} ${esc(app.execution.compilation_target)} · ` : logo("qdmi")}${logo("mqt")} DDSIM Execution` : `${logo("braket")}${logo("qdmi")} amazon.braket.iqm.emerald · ${logo("mqt")} Execution`) : (modernLayout ? `${logo("iqm")}${logo("qdmi")} IQM Emerald Target · ${logo("mqt")} DDSIM Execution` : "IQM Mock Target · Ideal DDSIM")}</span></div>`;
  }
  const compilerLabels = [
    "Input Program",
    "Optimization",
    "Device Specification",
    "Placement & Routing",
    "Native Synthesis",
    "Executable",
  ];
  function compilerFlow(active, content, { complete = false } = {}) {
    return `<div class="compiler-tiles">${compilerLabels.map((label, i) => `<div data-morph="compile-tile-${i}" class="compile-tile ${active === i ? "selected" : ""} ${complete || i < active ? "complete" : ""}"><span>${i + 1}</span><b>${label}</b></div>`).join("")}</div>${content}`;
  }
  function deviceCard(
    target,
    { layout = null, activeSites = [], blend = null } = {},
  ) {
    const brand = target.brand ?? ((presentation.modernLayout || presentation.deployment) ? null : "iqm"), repository = target.repository || "iqm-finland/QDMI-on-IQM", reference = target.reference || "iqm";
    if ((presentation.modernLayout || presentation.deployment)) return `<div class="spec-card" data-morph="device-card" data-target="${esc(target.id)}"><div class="spec-step" data-morph="device-heading"><b>3 · Device Specification</b>${logo("qdmi")}</div><div class="spec-identity">${brand ? logo(brand === "rigetti" ? "rigetti-wordmark" : brand) : ""}<b>${esc(target.short_label)}</b>${target.access_brand === null ? "" : logo(target.access_brand || "braket")}</div><div class="spec-facts"><span>${target.metadata.qubits} Qubits${target.metadata.resonators?.length ? " + 1 Resonator" : ""}</span><span>${target.metadata.native_gates.filter(g => !g.startsWith("measure") && !g.endsWith("_12")).join(" · ").toUpperCase()}</span></div>${deviceView(target, activeSites, layout, blend)}<a class="spec-repository" href="https://github.com/${repository}"><img src="${assets[`qr-${reference}`]}" alt="QDMI implementation QR code"/><span>${logo("github")}<span>${repository.replace("/", "/<wbr>")}</span></span></a></div>`;
    return `<div class="spec-card" data-morph="device-card" data-target="${esc(target.id)}"><div class="spec-step" data-morph="device-heading"><b>3 · Device Specification</b><span>Powered by ${logo("qdmi")}</span></div><div class="spec-brand">${(presentation.modernLayout || presentation.deployment) ? logo("braket") : ""}${brand ? logo(brand) : `<strong>${esc(target.provider_label)}</strong>`}</div>${deviceView(target, activeSites, layout, blend)}<div class="spec-details"><b>${target.short_label || "Emerald"}</b><span>${target.metadata.qubits} Qubits</span><span>${(presentation.modernLayout || presentation.deployment) ? "QASM 3" : "QIR · IQM-JSON"}</span><span>${(presentation.modernLayout || presentation.deployment) ? target.metadata.native_gates.join(" · ").toUpperCase() : "R · CZ"}</span></div><a class="spec-repository" href="https://github.com/${repository}"><img src="${assets[`qr-${reference}`]}" alt="QDMI implementation QR code"/><span>${logo("github")}<span>${repository.replace("/", "/<wbr>")}</span></span></a></div>`;
  }
  function routingFrame(target, progress) {
    const sweep = target.compilation.routing_trace?.find(
      (e) => e.phase === "final-routing",
    );
    const initial = target.compilation.layout?.initial || [];
    if (!sweep?.steps?.length)
      return {
        c: targetStage(target, "place-and-route")?.circuit,
        layout: initial,
        active: -1,
        sites: [],
        swaps: 0,
      };
    const steps = sweep.steps,
      weights = steps.map((e) => (e.operation === "qco.swap" ? 5 : 1)),
      total = weights.reduce((a, b) => a + b, 0);
    let consumed = 0,
      index = steps.length - 1,
      fraction = 1;
    for (let i = 0; i < steps.length; i++) {
      if (consumed + weights[i] > progress * total) {
        index = i;
        fraction = (progress * total - consumed) / weights[i];
        break;
      }
      consumed += weights[i];
    }
    let layout = sweep.before.slice(0, initial.length),
      before = [...layout],
      swaps = 0;
    steps.slice(0, index + 1).forEach((e, i) => {
      if (i === index) before = [...layout];
      if (e.operation === "qco.swap") {
        const [a, b] = e.sites;
        layout = layout.map((p) => (p === a ? b : p === b ? a : p));
        swaps++;
      }
    });
    const sites = [...new Set(steps.flatMap((e) => e.sites))].sort(
      (a, b) => a - b,
    );
    const c = {
      qubits: sites.map((id) => ({ id, site: id, label: `${id}` })),
      operations: steps.map((e, i) => ({
        id: `route-${i}`,
        name: e.controls
          ? "c".repeat(e.controls) + (e.base_gate || "").replace(/^qco\./, "")
          : (e.base_gate || e.operation).replace(/^qco\./, ""),
        qubits: e.sites,
        parameters: e.parameters || [],
        num_controls: e.controls || 0,
      })),
    };
    return {
      c,
      layout,
      active: progress >= 1 ? -1 : index,
      reveal: progress >= 1 ? Infinity : index + 1,
      sites: progress >= 1 ? [] : steps[index].sites,
      blend: { before, fraction: progress >= 1 ? 1 : fraction },
      swaps,
    };
  }
  function stageCard(target, id, title, options = {}) {
    return `<section class="compiled-stage stage-${id}" data-target="${esc(target.id)}"><div class="stage-shell" data-morph="stage-${id}" aria-hidden="true"></div><h3 data-morph="stage-title-${id}">${title}</h3>${circuit(options.c || targetStage(target, id)?.circuit, { full: true, key: id, ...options })}${options.metrics === false ? "" : programMetrics(target, id)}</section>`;
  }
  function compilationScene(step, progress = 1, targetIndex = 0) {
    const foldColumns = (c, rows) => Math.ceil((1 + Math.max(0, ...window.MQSF_CIRCUIT.schedule(c).map(op => op.column))) / rows);
    const target = targets[targetIndex],
      stage = Math.min(step, 6),
      route =
        stage >= 3
          ? routingFrame(target, stage === 3 ? 0 : stage === 4 ? progress : 1)
          : null;
    const input = stageCard(targets[0], "source", "1 · Input Program"),
      optimized =
        stage >= 1
          ? stageCard(targets[0], "optimized", "2 · Optimization")
          : "";
    let routed = "",
      native = "",
      executable = "";
    if (route)
      routed = stageCard(target, "place-and-route", "4 · Placement & Routing", {
        c: route.c,
        active: stage === 3 ? -1 : route.active,
        reveal:
          stage === 3 ? 0 : stage === 4 && progress === 0 ? 0 : route.reveal,
        layout: target.compilation.layout.initial,
        metrics: stage > 4 || (stage === 4 && progress >= 1),
        fold: (presentation.modernLayout || presentation.deployment) && stage < 5 ? foldColumns(route.c, 2) : null,
      });
    if (stage >= 5)
      native = stageCard(
        target,
        "target-native-synthesis",
        "5 · Native Synthesis",
        {
          layout: target.compilation.layout.initial,
          fold: (presentation.modernLayout || presentation.deployment)
            ? foldColumns(targetStage(target, "target-native-synthesis").circuit, targetIndex ? 3 : 2)
            : stage >= 6 ? 12 : null,
        },
      );
    if (stage >= 6) {
      const format = target.compilation.display_export || (presentation.deployment ? "braket-verbatim" : "qir-base");
      const artifact = targetStage(target, format);
      let count = 10;
      if ((presentation.modernLayout || presentation.deployment)) {
        count = 0;
        let rows = 0;
        for (const line of artifact.code.split("\n")) {
          rows += Math.max(1, Math.ceil(line.length / 56));
          if (rows > 20) break;
          count++;
        }
      }
      const output = `${code(artifact, { start: (presentation.modernLayout || presentation.deployment) ? 0 : focus(artifact, "define", 0), count, title: "6 · " + (artifact.label || format) + ((presentation.modernLayout || presentation.deployment) ? " · Excerpt" : ""), key: "compiler-output" })}${(presentation.modernLayout || presentation.deployment) ? "" : '<p class="code-continuation">⋮ Continued in the complete file</p>'}`;
      executable = `<section class="compiler-output output-${format}" data-morph="compiler-output" data-target="${esc(target.id)}" data-format="${format}">${output}</section>`;
    }
    return compilerFlow(
      stage <= 2 ? stage : stage <= 4 ? 3 : stage === 5 ? 4 : 5,
      `<div class="compiler-workbench phase-${stage} ${stage >= 6 ? "with-output" : ""}"><div class="compiler-invariants">${input}${optimized}</div><div class="compiler-device" data-morph="compiler-device">${stage >= 2 ? deviceCard(target, { layout: route?.layout, activeSites: stage === 4 ? route?.sites : [], blend: stage === 4 ? route?.blend : null }) : ""}</div><div class="compiler-stages">${routed}${native}</div>${executable}</div>`,
    );
  }
  function separator(title, subtitle, brand) {
    const brandAbove =
      brand === "mqt" ? logo("mqt", "chapter-brand") : esc(subtitle);
    return `<div class="chapter-separator" data-morph="chapter"><p>${brandAbove}</p><h1>${title}</h1><div class="chapter-rule"></div></div>`;
  }
  const slides = [];
  function add(id, section, title, builds, render, playbacks = {}) {
    slides.push({ id, section, title, builds, render, playbacks });
  }
  const opening = window.MQSF_OPENING;
  function registerSC26Slides() {
    add(
      "title",
      "SC26 · Chicago · 15–20 November 2026",
      "Practical HPCQC Integration with QDMI",
      0,
      window.SC26.title,
    );
    for (const [mode, title] of [
      [
        "problem",
        "Connecting the Quantum Ecosystem",
      ],
      [
        "stack",
        "A Shared Software Stack",
      ],
      [
        "detail",
        "The MQSC Approach: From the Metal to the User",
      ],
    ]) {
      add(
        mode,
        "01 · System Software",
        title,
        opening.phases[mode].length - 1,
        (s, t) => opening.render(mode, s, t ?? 1),
        opening.playbacks[mode],
      );
    }
    add("qdmi-interface", "02 · The Device Interface", "The Quantum Device Management Interface", 3,
      (s,t) => window.SC26.qdmi(s,t ?? 1),
      {0:{duration:1600,transition:700},1:{duration:2600},2:{duration:3200},3:{duration:4200}});
    add("iqm-device", "03 · QDMI on IQM", "Connecting QDMI to IQM Systems", 0,
      (s,t) => window.SC26.iqm(s,t ?? 1),
      {0:{duration:3000}});
    add(
      "hybrid-chapter",
      "04 · A Practical Hybrid Application",
      "A Classical–Quantum Workflow",
      0,
      (s,t) => `<h2 data-morph="heading">A Classical–Quantum Workflow</h2><p class="sc-workflow-subtitle">Quantum-Classical Auxiliary-Field Quantum Monte Carlo · QC-AFQMC</p>${window.SC26.workflowIntro(t ?? 1)}`,
      {0:{duration:6500,transition:700}},
    );
    add(
      "hybrid-algorithm",
      "04 · A Practical Hybrid Application",
      appHeading,
      2,
      (s, t) => applicationHeading() + applicationScene(s, t ?? 1),
      {
        0: { duration: 2200, transition: 900 },
        1: { duration: 3000, transition: 700 },
        2: { duration: 3500, transition: 700 },
      },
    );
    add(
      "afqmc-execution",
      "04 · A Practical Hybrid Application",
      appHeading,
      4,
      (s, t) => applicationHeading() + hybridExecution(s, t ?? 1),
      {
        1: { duration: 6500, transition: 0 },
        2: quantumPlayback,
        3: { duration: 6000, transition: 500 },
      },
    );
    add(
      "compile-chapter",
      "05 · Compilation",
      "From Quantum Program to Executable",
      0,
      () =>
        separator(
          "From Quantum Program<br>to Executable",
          "Targeting a Quantum Device",
          "compiler",
        ),
    );
    add(
      "routing",
      "05 · Compiling for a Device",
      "From Quantum Program to Executable",
      6,
      (s, t) =>
        heading("From Quantum Program to Executable") +
        compilationScene(s, t ?? 1),
      {
        4: { duration: 6500, transition: 800 },
      },
    );
    add("slurm-chapter", "06 · Try It on a Cluster", "From a Workflow to a Cluster", 0,
      () => separator("From a Workflow<br>to a Cluster", "Explore HPCQC Integration with Slurm", "server"),
    );
    add("slurm-playground", "06 · Try It on a Cluster", "Explore HPCQC Integration with Slurm", 4,
      (s,t) => window.SC26.slurm(s,t ?? 1),
      {1:{duration:6500},2:{duration:7000},3:{duration:6500}});
    add("conclusion", "SC26 · Practical HPCQC Integration", "From Interface to Integration", 0,
      window.SC26.conclusion,
    );
  }
  const booth = window.MQSC_AWS_BOOTH;
  if (booth) {
    booth.register({ add, opening, heading, logo, qr, code, esc, applicationHeading,
      applicationScene, hybridExecution, quantumPlayback, compilationScene, separator });
  } else {
    registerSC26Slides();
  }

  function resize() {
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(innerWidth / 1920, innerHeight / 1080),
    );
  }
  function render(progress = null, transition = 0) {
    state.token++;
    state.animation?.cancel();
    state.animation = null;
    if (progress !== null && !transition) window.MQSF_MOTION.finish();
    draw(progress, progress === null ? 950 : transition);
    const slide = slides[state.slide];
    $("section-label").textContent = slide.section;
    $("deck").classList.toggle("title-slide", state.slide === 0);
    $("slide-number").innerHTML =
      `${String(state.slide + 1)} / ${slides.length}<span class="build-dots" aria-label="Build ${state.step + 1} of ${slide.builds + 1}">${Array.from({ length: slide.builds + 1 }, (_, i) => (i === state.step ? "<b>•</b>" : "•")).join("")}</span>`;
    $("build-progress").style.width =
      `${((state.slide + (state.step + 1) / (slide.builds + 1)) / slides.length) * 100}%`;
    history.replaceState(null, "", `#${state.slide + 1}.${state.step}`);
  }
  function draw(progress = null, morph = 0) {
    const html = slides[state.slide].render(state.step, progress);
    if (morph) window.MQSF_MOTION.replace($("slide"), html, morph);
    else window.MQSF_MOTION.update($("slide"), html);
    $("slide").dataset.slide = String(state.slide + 1);
    $("slide").dataset.step = String(state.step);
    $("slide").dataset.progress = progress === null ? "" : String(progress);
  }
  function animateTimeline(playback) {
    const token = state.token,
      duration = playback.duration;
    let begin, pending;
    let transitioning = !!playback.transition;
    const cancel = () => cancelAnimationFrame(pending);
    const end = () => {
      if (token !== state.token) return;
      cancel();
      window.MQSF_MOTION.finish();
      state.animation = null;
      draw();
    };
    state.animation = { end, cancel, loop: !!playback.loop };
    function frame(now) {
      if (token !== state.token || !state.animation) return;
      // RAF timestamps share a frame clock; performance.now() may be ahead of it.
      begin ??= now;
      if (transitioning) {
        // Let shared geometry reach the initial frame before replay updates it.
        if (now - begin < playback.transition) {
          pending = requestAnimationFrame(frame);
          return;
        }
        window.MQSF_MOTION.finish();
        transitioning = false;
        begin = now;
      }
      const elapsed = Math.max(0, now - begin),
        cycle = playback.loop ? elapsed % (duration + 2400) : elapsed;
      draw(Math.min(1, cycle / duration));
      if (playback.loop || elapsed < duration)
        pending = requestAnimationFrame(frame);
      else end();
    }
    pending = requestAnimationFrame(frame);
  }
  function play(playback) {
    if (!playback || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render();
      return;
    }
    render(0, playback.transition || 0);
    animateTimeline(playback);
  }
  function go(slide, step = 0, forward = false) {
    state.slide = Math.max(0, Math.min(slide, slides.length - 1));
    state.step = Math.max(0, Math.min(step, slides[state.slide].builds));
    play(forward ? slides[state.slide].playbacks[state.step] : null);
  }
  function next() {
    if (state.animation) {
      state.animation.end();
    }
    const current = slides[state.slide];
    if (state.step < current.builds) {
      state.step++;
      play(current.playbacks[state.step]);
    } else if (state.slide < slides.length - 1) go(state.slide + 1, 0, true);
  }
  function previous() {
    if (state.step > 0) go(state.slide, state.step - 1);
    else if (state.slide > 0)
      go(state.slide - 1, slides[state.slide - 1].builds);
  }
  function overview(open) {
    const d = $("overview");
    if (!open) {
      d.close();
      $("deck").focus();
      return;
    }
    state.animation?.end();
    state.overview = state.slide;
    $("slide-grid").innerHTML = slides
      .map(
        (s, i) =>
          `<button data-slide="${i}" class="${i === state.overview ? "selected" : ""}"><b>${i + 1}</b>${esc(s.title)}</button>`,
      )
      .join("");
    $("slide-grid")
      .querySelectorAll("button")
      .forEach((b) =>
        b.addEventListener("click", () => {
          go(Number(b.dataset.slide));
          overview(false);
        }),
      );
    d.showModal();
    $("slide-grid").children[state.overview].focus();
  }
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if ($("overview").open) {
      if (e.key === "Escape") {
        e.preventDefault();
        overview(false);
        return;
      }
      const offset = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -5,
        ArrowDown: 5,
      }[e.key];
      if (offset) {
        e.preventDefault();
        state.overview = Math.max(
          0,
          Math.min(slides.length - 1, state.overview + offset),
        );
        $("slide-grid")
          .querySelectorAll("button")
          .forEach((b, i) =>
            b.classList.toggle("selected", i === state.overview),
          );
        $("slide-grid").children[state.overview].focus();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        go(state.overview);
        overview(false);
      }
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      state.jump = (state.jump + e.key).slice(-2);
      $("jump-indicator").textContent = `Go to ${state.jump} ↵`;
      $("jump-indicator").hidden = false;
      return;
    }
    if (e.key === "Enter" && state.jump) {
      e.preventDefault();
      go(Number(state.jump) - 1);
      state.jump = "";
      $("jump-indicator").hidden = true;
      return;
    }
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
      e.preventDefault();
      next();
    }
    if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
      e.preventDefault();
      previous();
    }
    if (e.key === "Home") {
      e.preventDefault();
      go(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1, slides.at(-1).builds);
    }
    if (e.key === "Escape" || e.key.toLowerCase() === "g") {
      e.preventDefault();
      state.jump = "";
      $("jump-indicator").hidden = true;
      overview(true);
    }
    if (e.key.toLowerCase() === "b")
      $("blackout").hidden = !$("blackout").hidden;
    if (e.key.toLowerCase() === "f")
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
  });
  let touchX = 0;
  document.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 80) dx < 0 ? next() : previous();
    },
    { passive: true },
  );
  addEventListener("resize", resize);
  addEventListener("beforeprint", () => {
    state.animation?.end();
    $("print-deck").innerHTML = slides
      .map((s, i) => {
        const footer = document
          .querySelector("#deck > .slide-footer")
          .cloneNode(true);
        const number = footer.querySelector("#slide-number");
        number.removeAttribute("id");
        number.className = "print-slide-number";
        number.textContent = `${i + 1} / ${slides.length}`;
        return `<section class="print-slide"><header class="slide-header"><span>${esc(s.section)}</span><div class="brand-pair">${logo(booth?.partner || "iqm")}${logo("mqsc")}</div></header><article data-slide="${i + 1}" data-step="${s.builds}">${s.render(s.builds)}</article>${footer.outerHTML}</section>`;
      })
      .join("");
  });
  addEventListener("afterprint", () => {
    $("print-deck").replaceChildren();
  });
  window.MQSF_DECK = {
    renderSlide: (index, step, progress = 1) => slides[index].render(step, progress),
    slides: slides.map((s) => ({
      id: s.id,
      title: s.title,
      playbacks: s.playbacks,
      builds: s.builds,
    })),
    getState: () => ({
      slide: state.slide,
      step: state.step,
      animating: !!state.animation,
    }),
    go,
    next,
    previous,
    finishAnimation: () => state.animation?.end(),
    finishMotion: () => window.MQSF_MOTION.finish(),
  };
  $("mqsc-logo").src = assets.mqsc;
  $("iqm-logo").src = assets[booth?.partner || "iqm"];
  resize();
  const hash = location.hash.match(/^#(\d+)(?:\.(\d+))?$/);
  go(hash ? Number(hash[1]) - 1 : 0, hash ? Number(hash[2] || 0) : 0);
  $("deck").focus();
})();
