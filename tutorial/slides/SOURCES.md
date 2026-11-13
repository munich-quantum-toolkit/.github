# SC26 tutorial sources and attribution

## Content

- The supplied SC26 proposal, *Connecting the Quantum and HPC Communities: A
  Tutorial on High-Performance Software for Quantum Computing*, pages 1–4:
  title, audience and learning goals. The revised narrative no longer follows
  its 20/70/70/20-minute structure. Its CVs, personal contact details and
  administrative sections are not included.
- SC24 tutorial deck at `.github` branch `tutorial-SC24`, revision
  `77e35202757cdf8b188e3f4163665e20cfd450f5`: quantum introduction, compilation
  and verification teaching sequence. Pages 18–21 inform the revised
  program/execution/results and state-evolution teaching route.
- SC25 tutorial deck at `.github` branch `tutorial-SC25`, revision
  `db750f07054e0bb2c934b1928e15d3c5b7ba7bd6`: continuation into MLIR and QDMI,
  consulted during the first draft. Pages 13–16 were inspected again for the
  Quantum 101 revision. The opening still uses the merged IQM source scenes.
- Supplied `2026-09_QCE_MLIR_Tutorial.pptx`, SHA-256
  `a1473fe4a30c75b82f860b9c930ae041d909fa795d50203ae3feca6e6f1b052e`: slide 30's
  compiler overview informed the QC/QCO conversion and jeff exchange route. Its
  earlier SVG export remains in the assets, with its source title/footer
  removed. The current overview is redrawn in the tutorial style. The NVIDIA
  pixels are extracted from that retained export without redrawing the mark.
  Slide 14 informs the classical MLIR example, slide 23 the QCO DAG, and slide
  29 the three-column representation comparison. Those teaching examples are
  adapted, not verbatim slide copies.
- Supplied `2026-09_QCE_Braket_QDMI.pptx`: integration architecture, sessions,
  jobs and scheduler context. AWS workshop access instructions, event access
  codes, credentials, old surveys and application performance claims are not
  included. No source PowerPoint or its media archive is embedded.
- [MQT Core documentation](https://mqt.readthedocs.io/projects/core/en/stable/compilation/index.html)
  and the local `core/docs/tutorials/` sources: compiler representations,
  hardware compilation and QDMI execution examples.
- [MLIR IR structure](https://mlir.llvm.org/docs/Tutorials/UnderstandingTheIRStructure/):
  operations, regions, blocks and values. The official
  [April 2019 introduction](https://llvm.org/devmtg/2019-04/slides/Keynote-ShpeismanLattner-MLIR.pdf)
  and
  [LLVM 2025 retrospective](https://llvm.org/devmtg/2025-04/slides/keynote/zinenko_deep_dive.pdf)
  support the expansion of MLIR and its history. MLIR was open-sourced in April
  2019 and merged into LLVM in December 2019. That history informed an earlier
  build. The current slide keeps the MLIR/LLVM logos and acronym expansion.
- [QDMI specification](https://munich-quantum-software-stack.github.io/QDMI/):
  sessions, queries and jobs.
- [Braket case study](https://arxiv.org/abs/2603.05138) and
  [IQM case study](https://arxiv.org/abs/2604.19869): integration examples.

## Design and assets

Visual reference: the merged
[MQSC presentations repository](https://github.com/munich-quantum-software/presentations),
revision `aa951e888c8e2fc36ebabc893dddd02cfd4ed90b`. The selected renderers and
styles are unchanged from the former PR #4 revision
`e98ae327d2094343762b15e2d9fb3ef157a0925a`. The FullHD white canvas, Inter
typography, navy/blue palette, header/footer geometry and pale outlined diagrams
follow that reference. The tutorial adds only a few technical slides and
notebook handoffs. The original renderers, CSS and motion/navigation engine are
copied byte for byte into `reference/`. Building and presenting do not require
the reference repository. The MIT notice is retained in
`assets/presentation-code-MIT.txt` and in the copied source files.

The 23-slide tutorial has 72 click states and reuses these scenes:

| Source deck                                | Scenes                                              | Tutorial use                                                    |
| ------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------- |
| `2026-11_sc26_iqm_paper`                   | `problem`, `stack`, `detail`                        | Three opening content slides after the retained title           |
| `2026-11_sc26_openqse_doe`                 | `routing`                                           | Original compilation walkthrough, IQM / IonQ / IBM              |
| `2026-10_mqsf_system_software_for_quantum` | `grover-growth`, `structured`, `adaptive-execution` | Original content slides 11, 12 and 14, after the final notebook |
| `2026-11_sc26_iqm_paper`                   | `qdmi-interface`, `slurm-playground`                | QDMI explanation and recorded Slurm deployment                  |
| `2026-11_sc26_iqm_paper`                   | `hybrid-algorithm`, `afqmc-execution`               | QC-AFQMC overview and accepted execution replay before Slurm    |

`reference/manifest.json` records the source revision and hashes of source
files, imported display data and assets. Capture commands and recorder paths
stay in the evidence file and are omitted from the audience HTML.
`examples/reuse_reference.py` imports these from the built reference checkout.
The build verifies the hashes. Fifteen JavaScript/CSS files, including the IQM
deck configuration, original slide registrations in `talks.js`, and full MQSF
`presentation.js`, are copied without edits. Imported SVG assets retain their
exact embedded source bytes. Original geometry, SVGs, continuous playbacks and
interruptible transitions are retained. At render time, the IQM and openQSE
copies omit projected text URLs and star/download badges, and apply
capitalization and punctuation preferences. The MQSF copies bypass these text
edits to preserve the requested source slides, including their paper references.
The packager exports their original slide registrations before the standalone
MQSF navigation setup. The tutorial shell calls the unchanged renderers and
playback settings. The local `structuredCopy` adapter now typesets the Grover
equation and iterative-QPE notation with bundled KaTeX. Automatic `\left` and
`\right` delimiters enclose both floors and the arcsine argument. The runtime
sequence uses 3 px arrow shafts, matching its original self-call, and filled
arrowheads on all four messages. The 9 px heads use base-aligned markers, butt
caps and shafts shortened by 9 px, including the LLVM JIT self-call, so no shaft
protrudes beyond its head. Math output is cached during animation. A scoped
style restores the original MQSF heading and code-title typography where the
other decks would override it. The black titles retain the common (80, 152)
anchor. Their chapter label is STRUCTURED PROGRAMS. Relevant MQT logos remain in
the content. The header contains TUM, MQSC and MQV. Project, provider and paper
QR codes remain visible except for the shared-stack paper reference, MQSS logo
and acknowledgement block removed from slide 3. Source subtitles and diagram
labels remain unchanged except for the requested mathematical typesetting. Event
identity and the header are local.

The presentations repository was reviewed first for the compiler revision,
including the openQSE Compiler Working Group pair and the MQSF compiler,
structured-program and capability scenes. The working-group pair repeats the
stack and native-gate demonstration already present in this tutorial. The three
MQSF structured-program content slides now follow the final notebook as a short
lecture sequence, without the original chapter separators or another notebook
handoff. They are separate from the earlier worked dialect primer.

The repository was searched across all presentation and shared visual modules,
including occurrences of jeff and both dialects. Its general compiler overview
is the stack scene already used here. The supplied QCE slide 30 provides the
more specific QC/QCO conversion and jeff exchange route, now redrawn with the
tutorial's panels, typography and arrows. The title thumbnail also reuses the
opening architecture, with QR codes and surrounding labels removed, box labels
retained, and the viewBox expanded to include the top provider card.

The revised compiler overview was checked against MQT Core 4.2.0, commit
`d76be496512c8707f165e18f152bd5f11b8a5665`, using the compiler guide, MLIR
dialect index and `python/mqt/core/mlir/__init__.pyi`. It shows OpenQASM 2/3,
Qiskit and preprocessed PennyLane tapes as input formats. Output formats are
OpenQASM 2/3, Qiskit circuits/QPY, Base/Adaptive QIR in LLVM text/bitcode and
IQM JSON. QC/QCO MLIR is shown only inside the compiler. The format panels use
logos without explanatory labels, except for Qiskit and OpenQASM. Small version
badges mark OpenQASM 3.1 and QIR 2.1 support, checked in the same 4.2.0 tag
against `docs/mlir/OpenQASM.md` and
`mlir/unittests/Compiler/test_compiler_pipeline.cpp` (the minimum-QIR-version
and receiver-range tests). jeff import/export is shown separately through QCO.
CBit is shared by QC and QCO; QTensor belongs with QCO. Format-specific program
restrictions remain in the linked documentation. The external-tool group shows
Catalyst, Quantinuum, NVIDIA and QuEra. The original Quantinuum logo replaces
the earlier TKET mark. NVIDIA and jeff use their logos without duplicate labels.
This diagram is an interoperability overview, not a new end-to-end integration
test.

The supplied `Desktop/logos/quera.svg` is copied byte for byte, SHA-256
`6c6914db91e4213524b636a85166b68b7402465f9157687fa7fd389321965a83`. QuEra
retains rights to its mark. The Quantinuum logo is the unchanged shared
`pr-quantinuum.svg`. `qce-nvidia.svg` retains the exact embedded PNG bytes
inside a viewport cropped to the visible NVIDIA mark. Quantinuum and NVIDIA
retain rights to these marks. The previous QCE overview asset remains intact.
The now-unused TKET extraction is omitted from the delivery. Compiler arrows use
butt-capped shafts shortened by the 14 px head length, with filled, base-aligned
markers. The optimization loop is narrower, with its label on the right.

The three authored compiler slides introduce MLIR through `arith.addi`, compare
OpenQASM/QC/QCO, and continue the same QCO program through optimization. The
representation and optimization slides share panel, code and DAG styles. Python
calls are revealed below a dividing line. The QCO panel moves unchanged from the
right column to the left on the next slide. Full function bodies come from the
retained MQT Core 4.2 capture, with short SSA names and a qubit type alias. All
three displayed IR programs parse and match the full matrix of the original
OpenQASM. No claim is made that these authored slides are copies.

The openQSE compilation header's “MQT Core” text and QR artwork are the original
source card. The source card does not contain an additional MQT logo. Its text
URL is omitted by the same projection adapter used elsewhere. Other source
images remain present. The comparison against the source renderer checks this
card along with every build of the full scene.

The Braket/QDMI material (slides 9, 16–17 and 36–39) supplies the distinction
between resource scheduling, device capabilities and job execution. Historical
AWS access instructions and performance numbers are not copied. The Python
execution slide connects the QDMI overview to the local DDSIM notebook.

- `inter-latin.woff2`: Inter variable font from the reference asset pool, under
  the SIL Open Font License in `assets/Inter-LICENSE.txt`.
- `FiraCode-VF.woff2`: unchanged Fira Code 6.2 variable WOFF2 from the local
  Homebrew installation, SHA-256
  `408e876a202f15ea6ee307a70a65cf40ceb222c589a0b17e0a3a371db96dd49f`. The
  [upstream SIL Open Font License](https://github.com/tonsky/FiraCode/blob/6.2/LICENSE)
  is retained in `assets/FiraCode-LICENSE.txt` and the delivery notices. The
  tutorial's stylesheet applies this font and programming ligatures to code in
  authored and copied scenes, without modifying the reference files.
- MQSC SVGs: existing `.github` and reference assets. The white variant comes
  from `docs/_static/logo-mqsc-all-white.svg`. MQT logos in slide content come
  from the shared reference pool. Their respective organizations retain rights
  to their marks.
- TUM SVG: supplied `Desktop/logos/tum.svg`, used without altering its paths or
  proportions. The artwork fills its viewBox.
- QDMI, Qiskit, QIR, jeff, Slurm, IQM and Braket SVGs: existing reference
  `brand/` assets used to identify the corresponding projects and systems. Their
  owners retain rights to their marks; supplied AWS, Slurm and jeff notices are
  retained.
- `pr-*.svg`: marks embedded by the reused scenes, including MQT, MLIR, LLVM,
  PennyLane, IBM, IonQ, Pasqal, MQSS, LRZ, MQV, MQSC Orchestrator, Oxford,
  Quantinuum, UBC, Xanadu and Unitary Foundation. These are copied from the same
  reference asset pool. Rights remain with their owners.
- [KaTeX 0.19.1](https://github.com/KaTeX/KaTeX/releases/tag/v0.19.1): the
  bundled renderer, stylesheet and WOFF2 fonts render LaTeX offline. The
  upstream MIT license is retained in `vendor/katex/LICENSE` and the delivery
  notices.
- SC26 PNG: existing `tutorial/sc26_logo.png` on the SC26 branch. Conference
  identity is used to identify this event.
- Sampling circuit and QCO DAGs: supplementary SVG/HTML authored for this
  tutorial. The earlier interference and joint-state slides have been removed.
  The sampling histogram shows a retained ordered local simulation, with a fixed
  0–100% axis and exact sample frequencies. The compilation demo continues to
  use the original evidence-driven renderer.

## Captured evidence

`examples/walkthrough.py` was executed locally on 13 November 2026 with MQT Core
4.2.0, Qiskit 2.6.2 and NumPy 2.5.4, using Python 3.12.10 on macOS arm64.
Re-execution with Python 3.15.1 produces the identical retained capture. The
tutorial now defaults to Python 3.15, with the six compiler/execution notebooks
and the new Qiskit introduction executed under 3.15.1. Only the bundled DDSIM
execution device was opened. Topology examples use three-site compilation
models, not hardware metadata or hardware jobs.

The capture retains input programs, QC/QCO output, optimized IR, emitted
OpenQASM, gate counts, sampled histograms, versions, seed and a compiled-payload
SHA-256. The complete-matrix comparison checks the small unitary optimization.
Sampling checks for routing establish the expected distribution for the supplied
input, not general equivalence of arbitrary programs. No runtime speedup or
hardware-performance claim is made.

`examples/teaching_examples.py` was run on 14 November 2026 with Python 3.15.1,
Qiskit 2.6.2 and MQT Core 4.2.0. `sampling.json` retains 1,024 ordered samples
from the ideal Bell state with Qiskit's seed 3. The first three are `00`, `00`,
`11`, and the final counts are 515 and 509. It is a separate new capture and
does not replace the older DDSIM evidence. It was used in the earlier version of
the introductory sampling animation and is retained unchanged.

`representations.json` records the compact, parsed IR and the SHA-256 of the
original walkthrough capture. The recapture script checks complete matrices
before and after `simplify-quantum`. Captures are written into ignored build
output for verification before promotion, preserving historical evidence.

The reused openQSE compilation sequence is separate retained evidence. Its
source is
`2026-11_sc26_openqse_doe/captures/compilation-native-refined.json.gz`, SHA-256
`d55434942b8d85bafc3e0e033de66dc224a0275b5b8e39637c3982cd0d250902`, at revision
`e98ae327d2094343762b15e2d9fb3ef157a0925a`. The capture is unchanged in the
merged source revision. The source records MQT Core 4.2.0 with its CZ
frame-order fix, IQM-QDMI 1.6.0, Braket-QDMI 1.4.0 and IBM-QDMI 1.1.0. IQM and
IBM use local device models, and IonQ uses retained capabilities through a
localhost fixture. Its independent probability checks and compilation metrics
are source evidence, not a recapture with this tutorial's stock 4.2.0 notebook
environment. The audience header names the compilation topic. Its provenance
remains recorded here. No new provider query, cloud task or hardware job was run
for this adaptation.

The QC-AFQMC slides use the IQM deck's original renderers, styles and playback
settings. A local projection edit makes the five runtime sequence messages
consistently 2 px wide, including the execution loop. Their filled 8 px heads
use base-aligned markers and butt caps. Shafts end 8 px before their original
destinations, so the tips meet the same lifelines. Captured event timing,
activation opacity, label positions and lifeline strokes are unchanged. The 20
sampled sequence frames across both themes preserve that geometry and
activation, and the other slides match the prior preview in all 130 sampled
frames. `reference/afqmc.json.gz` contains the exact `application` data from
that built deck at the same source revision. The source assembles the accepted
Quantummania measurement capture, `2026-11_sc26_aws_booth/captures/demo.json.gz`
(SHA-256 `c265f3e90fe684323a44e8bbba669512b25f3c8a697413056bd90cd06878cb3e`),
with `standard-propagation.json` in the same capture directory (SHA-256
`a6c32b018a851b79229d7b1a875e2e88e3d823b0a31a22adc5401f3e717c9da4`). It retains
4,096 programs, 1,024 shots each, and both 240-step trajectories with 128
walkers per trial. Propagation is the accepted uncached local MPI continuation
of retained Slurm/DDSIM measurements, using OS entropy per rank. It is not a new
Slurm or hardware run. The source's timing transformations, uncertainty bands,
DDSIM label and replay clock remain unchanged.

The three MQSF slides preserve their historical evidence. The source
`2026-10_mqsf_system_software_for_quantum/captures/demo.json.gz` has SHA-256
`a46785e05205dbc98aac1c36a5178d437ded34bd96e0a511c4ea18714535d0f2`.
`reference/structured.json.gz` contains the exact browser-data objects for the
Grover-size comparison, syndrome extraction and iterative QPE. The measured
Grover chart compares emitted OpenQASM bytes for 2–22 qubits. The adaptive QIR
runtime replays 8,192 DDSIM shots on four workers, including retained runtime
calls and the outcome histogram. These are local simulation observations with
instrumented timing, not hardware results or a throughput benchmark. Their
native implementation context is archived at MQT Core commit
`8382b24d19aa3b1a84144fd7524c162d165c6392`; individual captures retain their own
revisions and timings. They were not recaptured with this tutorial's MQT Core
4.2.0 environment. The source's code highlighting, paper footer, logos, QR code,
playback durations and transitions are unchanged. Mathematical labels and
runtime arrow styling have the presentation-only changes described above.

Both histogram slides now reuse the same existing `walkthrough.json` DDSIM
counts: `00: 528`, `11: 496`, from 1,024 shots with seed 17 and `bell_source`.
The same Bell preparation is shown in Qiskit on the first slide and OpenQASM in
the capture. The local DDSIM call was rechecked and reproduced these counts.
`bell-replay.json` binds the display sequence to that capture's SHA-256. QDMI
shot order is unspecified, so the teaching replay arranges the same outcomes as
`00`, `00`, `11`, then the remainder in a fixed shuffled order. This is an
illustrative order, not measured chronology. Both final histograms are computed
from that same sequence, with a fixed 0–100% axis and counts above the bars. The
earlier Qiskit trace in `sampling.json` remains unchanged as historical
evidence. The API excerpt omits the optional simulator seed.

Authored snippets are highlighted during packaging with Pygments 2.21.0,
openqasm-pygments 0.2.0 and mlir-pygments 1.0.0 from the root authoring
lockfile. The original reference snippets retain their highlighted markup. The
shared Pygments `friendly` style supplies the same token colors for all
snippets. Build assertions and browser checks verify that highlighting preserves
the source text. Authored examples also reuse the reference `.code-line`,
`.line-no` and `.code-text` structure and Pygments gray background. Their gutter
is nonselectable and hidden from screen readers. Compact compiler examples keep
their existing line spacing and all short calls remain on one line. No
highlighting runtime or network request is needed to present.

The sample code and conceptual excerpts are distinguished on the slides. The
Slurm and provider diagrams illustrate deployments, not a newly validated SC26
cluster setup. Full references remain in this source file. The unchanged MQSF
paper references are the only projected text URLs. Captured examples remain tied
to the versions above.

## Revision validation

The revised live route places the break before Notebook 02 and budgets two
90-minute sessions with 110 notebook minutes. The earlier notebook validation
executed all seven notebooks and the GHZ solution in the locked Python 3.15.1
environment using local simulation only. Slide changes remain in the
presentation commit, separate from the notebook iteration commit. The new
sampling trace and the compact compiler examples were executed locally. Rendered
checks cover 23 slides and 72 click states in both browser theme preferences,
plus intermediate animation frames. The TUM artwork matches the supplied
`Desktop/logos/tum.svg` apart from a final newline. Its paths and viewBox are
unchanged.

The source comparison checks the imported JavaScript/CSS bytes, then compares
copied slide markup after the documented projection edits and element geometry
at all settled builds and the beginning, midpoint and end of continuous
playbacks in both theme preferences. The Placement & Routing title is at the
same position as the openQSE source, including the routing animation. The
previous adaptation had omitted QR artwork. That omission is corrected.

The IQM/openQSE comparison passed for 194 source states with no geometry
differences. The initial MQSF import comparison covered 32 source states,
including quarter-step frames of both continuous playbacks, with identical
rendered markup, element geometry and typography in both themes. The subsequent
math/arrow revision keeps the retained evidence and copied source files intact.
Its comparison confirms unchanged chart, footer, structured-program and runtime
geometry and data across the same 32 states. All 15 imported JavaScript/CSS
files and 45 SVG assets match the source bytes.

The title overview retains the source labels inside frontend, compiler,
orchestrator, QDMI and device boxes. Surrounding labels and QR/link groups are
omitted. The sampling slide omits duplicate circuit readouts and its caption.
Notebook handoffs show their number, title, filenames and an unlabeled QR code
for the tutorial materials. The existing `qr-tutorial.svg` is displayed in white
on navy, with its quiet zone intact, at 360 × 360 px in the lower-right corner.
The original QR asset and destination remain unchanged. All three white-on-navy
QR codes decode directly from rendered screenshots in both themes. Existing
handoff text and geometry remain unchanged. The shared compiler story uses a
narrower circuit, boxed Python calls and two centered QCO panels for
optimization. Imported reference files and retained captures are unchanged.

The compiler overview follows the worked MLIR/representation/optimization
sequence. The MLIR slide centers its two logos, addition example and compact
operation annotation. The circuit sits above OpenQASM, and the footer omits the
import. Optimization now shows `qco.run_pass_pipeline("simplify-quantum")`,
which modifies the existing program in place. This exact call was checked in
Python 3.15.1 with MQT Core 4.2.0: four gates become two, and the full matrix is
unchanged. A copy is only needed when the caller wants to retain the input.

Chapter headers use five content topics, with YOUR TURN for notebook handoffs.
The title and break slides omit chapter labels. The final slide uses
CONCLUSIONS. Source-deck names and source section numbering remain absent.
Notebook pacing stays in the brief. The break slide has no next-session
subtitle.

All content-slide headings use the source layout's (80, 152) FullHD anchor.
Removing a tutorial-only 18 px offset aligns authored headings with the copied
scenes without modifying those scenes. Break is centered at (960, 540),
independently of its decorative rule. Browser checks cover these positions in
every build and the transition from the compilation demo to MLIR.

## Closing resources and reordered second session

After Notebook 02, the unchanged scenes now run QC-AFQMC overview/execution,
QDMI, Slurm, the Python execution example and Notebook 03. The three structured
program slides follow that final notebook. The slide content and build counts
are unchanged by this reordering.

The final Conclusions slide adapts the IQM resource-card layout and MQSC
logo-led closing style into four large QR cards, without projected text URLs:

| Resource           | Encoded destination                                                             | Artwork                                                          |
| ------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Tutorial materials | <https://github.com/munich-quantum-toolkit/.github/tree/tutorial-SC26/tutorial> | `qr-tutorial.svg`                                                |
| MQT Core           | <https://github.com/munich-quantum-toolkit/core>                                | Unchanged `pr-qr-core-repo.svg`                                  |
| QDMI               | <https://github.com/Munich-Quantum-Software-Stack/QDMI>                         | Unchanged `pr-qr-qdmi-repo.svg`                                  |
| MQSC               | <https://mq.sc>                                                                 | Unchanged shared `brand/qr-company.svg`, copied as `qr-mqsc.svg` |

The tutorial code uses macOS Core Image's `CIQRCodeGenerator`, correction level
M, with four additional quiet-zone modules and navy SVG paths on transparency.
The MQSC code is copied byte for byte from the presentations repository's
`brand/qr-company.svg` at revision `aa951e888c8e2fc36ebabc893dddd02cfd4ed90b`,
SHA-256 `54fcd7b20be1798bc1308db2e3f112750f4fd43d47c8c4a2a17a377a6ace86a8`. No
generation dependency is needed when building or presenting the retained
artwork. The tutorial link points to the existing branch, not the local preview.

The reordered deck passes all 72 click states in both themes, with no console
errors, external requests or overflow. A before/after comparison matches all 139
sampled existing render frames exactly. All four closing QR codes decode to the
destinations above from rendered screenshots in both themes. The stable HTTP
preview matches the offline HTML, including interruptible motion into and out of
the relocated structured-program sequence.

The final compiler-format revision passes the same 72-state browser checks in
both themes. Its nine arrow tips and the reverse exchange tip meet their panel
boundaries, with butt caps and base-aligned filled heads. The other 22 slides
match the preceding preview across 139 sampled frames. Notebook files remain
unchanged.

The format badges use gold fills, bold navy version numbers and a small shadow,
tilted 20 degrees clockwise at the upper-right corners of the OpenQASM labels
and QIR logo. The external-tool group now uses the
[official PennyLane Catalyst wordmark](https://github.com/PennyLaneAI/catalyst/blob/6039d1257e63dd6a4dc489dc377795572a9b503a/doc/_static/pl-catalyst-logo-lightmode.png)
from revision `6039d1257e63dd6a4dc489dc377795572a9b503a`. `assets/catalyst.png`
is an unchanged copy, SHA-256
`2e5861812142cfe0878d200cc849e0fd7d447dbac8823b43c13b4548155190f4`. An SVG
viewport crops only the surrounding blank margins, preserving the source
proportions and pixels. PennyLane/Xanadu retain rights to the artwork.

The latest runtime-arrow revision checks all four tips against their original
lifelines over 12 sampled frames in both themes. Other slide frames remain
unchanged apart from the requested version badges and closing MQSC card. All 72
click states pass the offline browser checks. The rendered closing codes decode
directly in both themes, including the MQSC destination `https://mq.sc`.

## Header logos and slide 3 reference removal

Only the three header marks are affected by this logo revision. TUM and MQSC are
approximately 13% smaller, and MQV is placed to their right. Slide 3's entire
`opening-paper` block is removed by the local display adapter. Its architecture,
title and animation are unchanged. Content logos on other slides are untouched.

`mqv-header-blue.svg` is an unchanged copy of the tutorial repository's
`docs/_static/logo-mqv-light.svg`, SHA-256
`10abd92b99183dd89fa422491f2a69b3e6375337e9fd4a47e279a42ec208d985`. The dark
notebook handoffs use `mqv-header-white.svg`, derived from the same blue SVG by
replacing only the blue stroke and black fill with white. Paths, stroke widths
and the viewBox are identical, preserving logo geometry across the light and
dark slides. The earlier PNG variant is no longer used. MQV retains rights to
its marks. The header arrangement also applies to the existing print view.

All 140 sampled content frames match the preceding preview after removing only
the requested slide 3 reference block. Its diagram and title geometry remain
identical in every build and theme. All 72 click states pass the offline browser
checks, and both header variants and the print header are verified.

The sampling slide's shot count uses the same regular weight as the word
“shots”. Only the count's bold wrapper was removed, preserving the captured
counts and replay.
