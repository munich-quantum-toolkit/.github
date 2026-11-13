# SC26 tutorial brief

Sunday, 15 November 2026. SC attendees learn to create, compile and execute
quantum programs, and see how QDMI connects that work to HPC. Assume basic
Python and general technical competence without prior knowledge of the MQT APIs.

Use the presentations repository's root guidance and three design guides. The
material formerly in PR #4 is merged. Preserve the reference layouts and motion,
the existing title, and relevant MQT logos in slide content. Only the header
omits MQT. Avoid projected text links and URLs, except for the unchanged paper
references on the MQSF copies. QR codes may be used when useful. Use explicit
dark slides for all three notebook handoffs.

## Two 90-minute sessions

Times below are elapsed minutes within each session. The break is additional.

| Session | Minutes | Slides | Activity                                                                    |
| ------- | ------- | ------ | --------------------------------------------------------------------------- |
| 1       | 0–10    | 1–4    | Title and copied IQM ecosystem, stack and MQSC approach                     |
| 1       | 10–25   | 5      | Write a Bell program, reveal its circuit, measure and accumulate samples    |
| 1       | 25–65   | 6      | Notebook 01: build Bell/GHZ circuits and compare probabilities with samples |
| 1       | 65–75   | 7      | Copied openQSE compilation replay                                           |
| 1       | 75–90   | 8–11   | MLIR, OpenQASM/QC/QCO representations, optimization and compiler overview   |
| Break   | —       | 12     | Break before the compilation exercise                                       |
| 2       | 0–40    | 13     | Notebook 02: representations (20 min), hardware constraints (20 min)        |
| 2       | 40–50   | 14–18  | QC-AFQMC workflow, QDMI, Slurm deployment and Python calls                  |
| 2       | 50–80   | 19     | Notebook 03: discover, compile, submit, retrieve and reuse                  |
| 2       | 80–85   | 20–22  | MQSF unrolling, structured compilation and adaptive runtime                 |
| 2       | 85–90   | 23     | Conclusions and follow-up resources                                         |

Notebook time is 110 of 180 minutes, approximately 61%. The 23 actual slides
have 72 click states. Continuous animations stay within those states. The
compiler primer gets 15 minutes, and the native-gate replay gets 10 minutes.
Allow 5 minutes for the copied structured-program sequence. Use the readable
highlighted QIR excerpts rather than walking through every entry-point line.
During the HPC integration explanation, allow 3 minutes for QDMI, 3 for the
QC-AFQMC overview and execution replay, 2 for Slurm and 2 for Python.

Quantum 101 uses one sampling experiment. Show the Qiskit program first, then
the Bell circuit. The next three clicks measure `00`, `00`, and `11`, followed
by a replay of the remaining samples. The histogram retains a fixed 0–100% axis
and shows observed frequencies, with counts above the bars. The sequence is a
replay of retained local DDSIM counts, not hardware execution. Shot order and
animation timing are illustrative. The QDMI execution slide reuses these counts.
Use the same circuit in the notebook. There are no separate
amplitude-interference or joint-state slides.

Introduce MLIR with classical addition, then build OpenQASM, QC and QCO in three
columns. Reveal Python below a dividing line on the fourth build. Carry the
unchanged QCO panel to the left of the optimization slide, reveal the optimized
program, then reveal its Python calls. Keep code, DAGs and panel geometry
consistent across these two slides. Follow the worked example with the compiler
overview redrawn in the tutorial style. Show external input/output formats with
logo-led entries and small OpenQASM 3.1/QIR 2.1 badges. Keep QC/CBit and
QCO/QTensor/CBit within the compiler, plus the separate jeff exchange route to
Catalyst, Quantinuum, NVIDIA and QuEra.

Top-left chapter labels progress through System software, Quantum programming,
Quantum compilation, HPC integration and STRUCTURED PROGRAMS, ending with
CONCLUSIONS. YOUR TURN marks notebook handoffs. The title and break have no
chapter label. Source provenance stays in this brief and SOURCES.md, not in
chapter labels.

Remove filler subtitles from supplementary teaching slides. Preserve subtitles,
labels, typography and animation in copied reference scenes. QR codes remain
visible. The three MQSF content slides retain their layouts, evidence,
animations and paper references. Use LaTeX for the Grover equation and QPE
notation. Match the runtime message arrows to the thin self-call stroke and add
its arrowhead. Use the shared black-title anchor and omit the original chapter
separators. This is a short lecture sequence after the final notebook, with no
additional notebook handoff.

Each core notebook has an explicit route and stopping point. Keep the original
QCE exercises available as extensions. Ownership details, control flow, QIR,
simulator state extraction and jeff need not fit into the live exercises. Do not
add standalone error-reporting or deployment-quiz slides. Prefer attendee
questions and useful experiments to covering every retained cell.

## Evidence and delivery

Notebook execution is local simulation on Python 3.15.1 and MQT Core 4.2.0. The
compilation carousel and Slurm diagram are reference material, not a new
hardware run or a cluster exercise. Preserve exact provenance in SOURCES.md. The
compiler replay includes the source's CZ frame-order fix.

Deliver one offline HTML with embedded assets and fonts, companion notebooks,
and notices. Keep the preview URL stable and serve only generated delivery
files. Review every click state, both browser theme preferences, all notebook
handoffs, and intermediate animation frames. No presenter notes.
