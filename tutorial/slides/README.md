# SC26 HTML tutorial

The 23 slides have 72 click states. The IQM opening, openQSE compilation
walkthrough, MQSF structured-program sequence, QDMI explanation, QC-AFQMC
workflow and Slurm example use the original reference renderers, styles and
continuous animations. The added technical slides introduce the circuit
behavior, MLIR notation and Python calls used in the notebooks.

## Teaching route

| Session | Slides | Topic                                                                     | Notebook time                                                           |
| ------- | ------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1       | 1–4    | Title with simplified source overview and three copied IQM opening slides |                                                                         |
| 1       | 5–6    | Animated sampling experiment and dark handoff                             | `circuit_basics.ipynb` · 40 min                                         |
| 1       | 7–11   | Copied openQSE demo, three teaching slides and compiler overview          |                                                                         |
| Break   | 12     | Break before the compilation notebook                                     |                                                                         |
| 2       | 13     | Dark handoff to inspection, optimization and target compilation           | `compiler_representations.ipynb`, `hardware_compilation.ipynb` · 40 min |
| 2       | 14–19  | Copied QC-AFQMC, QDMI and Slurm scenes, Python execution and dark handoff | `qdmi_execution.ipynb` · 30 min                                         |
| 2       | 20–22  | Copied MQSF unrolling, structured compilation and adaptive runtime        |                                                                         |
| 2       | 23     | Conclusions with QR codes for tutorial materials, MQT Core, QDMI and MQSC |                                                                         |

Each session is 90 minutes. Notebooks get 110 of the 180 teaching minutes, about
61%, excluding the break. The notebook checkpoints define the live route.
`control_flow.ipynb`, `qir_execution.ipynb`, `jeff_exchange.ipynb`, and the
sections after each checkpoint remain extensions. See [brief.md](brief.md) for
minute-by-minute pacing.

## Build and present

From the presentations repository, use its root uv project and committed
lockfile:

```sh
uv sync --locked
uv run --locked python /Users/daniel/mqt/.github-SC26/tutorial/slides/build.py
uv run --locked python -m http.server 8766 --bind 127.0.0.1 \
  --directory /Users/daniel/mqt/.github-SC26/tutorial/slides/build
```

Open <http://127.0.0.1:8766/sc26-tutorial.html>. The standalone HTML also opens
from disk and can be copied or renamed. Fonts, artwork, code, retained data and
KaTeX are embedded. Python, OpenQASM and MLIR are highlighted at build time
using Pygments, openqasm-pygments and mlir-pygments from the locked environment.
All code blocks use bundled Fira Code with programming ligatures, plus the
source deck's gray background and line-number gutter. The compiler overview uses
the same Inter typography, pale panels and blue connectors as the teaching
slides. Projected text URLs are omitted except for the unchanged paper
references on the MQSF copies. The header uses TUM, MQSC and MQV, with white
artwork on notebook handoffs. MQT logos remain in the original slide content.
Copied project, provider and paper QR codes remain visible.

Controls are the original deck's: arrow keys, Space, Enter or Page Down/Page Up
step through builds. Home/End jump to the ends. G or Escape opens the overview.
Type a slide number and Enter to jump directly. F toggles fullscreen and B
blanks the screen. Touch swipes work. URL fragments retain the slide and build,
for example `#9.0`. Reduced-motion preferences show settled states. No presenter
notes or notes shortcut are included.

## Edit

- `slides.js`: slide order, supplementary technical slides and notebook
  handoffs.
- `reference/`: original source files from merged main and display data, with
  revision and SHA-256 checks in `manifest.json`. The build rejects changes to
  these copies.
- `examples/reuse_reference.py`: copies source and imports display data from the
  built IQM, openQSE and MQSF reference decks. The original files remain
  unmodified.
- `snippets.json`: authored Python/MLIR snippets, highlighted during packaging.
  OpenQASM and QC/QCO snippets come directly from the retained representations.
- `reference/afqmc.json.gz`: the IQM deck's exact accepted AFQMC display data.
- `reference/structured.json.gz`: exact MQSF Grover-size, syndrome-extraction
  and iterative-QPE display data.
- `presentation.css`: scoped tutorial styles and dark notebook handoffs.
- `index.html`: event identity and the original navigation shell.
- `captures/walkthrough.json`: retained MQT Core 4.2 compiler/simulator
  evidence.
- `examples/walkthrough.py`: source for that local evidence.
- `captures/bell-replay.json`: one retained DDSIM histogram for both sampling
  and execution slides, with an illustrative shot order for the opening replay.
- `captures/sampling.json`: preserved earlier Qiskit sampling evidence.
- `captures/representations.json`: compact, validated compiler examples.
- `examples/teaching_examples.py`: recaptures these into ignored
  `build/teaching-captures/` using the separate Python 3.15 notebook
  environment. Compare and validate before deliberately promoting captures.
- `assets/qce-compiler-overview.svg`: retained earlier QCE slide 30 export. The
  current overview is editable SVG in `compilerMap`, with the MQT Core 4.2
  formats, QC/CBit, QCO/QTensor/CBit and jeff exchange.
- `assets/quera.svg`: the supplied QuEra artwork, copied without edits.
  `qce-nvidia.svg` preserves the QCE NVIDIA pixels. Quantinuum uses the
  unchanged shared logo.
- `SOURCES.md`: attribution, source revisions and evidence limitations.

`presentationCopy` applies the requested presentation edits when an IQM or
openQSE reference scene is rendered: omit projected text URLs and download/star
badges, and capitalize after separators. Content logos, QR artwork and source
subtitles remain intact. The copied IQM and openQSE deck configurations and
`talks.js` register the source slides directly. Local technical styles are
scoped so they do not restyle copied diagrams. The MQSF copies bypass those text
edits. Their original registrations and renderers are exported before the
standalone MQSF navigation setup, then run through the tutorial shell. The
chapter label is STRUCTURED PROGRAMS. `structuredCopy` applies the requested
LaTeX typesetting to the Grover equation and iterative-QPE circuit and makes the
runtime arrows consistently thin, with an arrowhead on the self-call. Source
typography is restored where another deck's styles would override it, keeping
the shared (80, 152) title anchor. Fifteen JavaScript/CSS files and the imported
SVG assets are byte-for-byte copies, protected by the manifest and excluded from
formatters.

The build uses Python's standard library and the installed Pygments lexers. It
does not import MQT Core or call a provider. Generated output is ignored by Git.

## Verify

Use the presentations repository's locked authoring environment, which includes
Playwright, to run:

```sh
uv run --locked python /Users/daniel/mqt/.github-SC26/tutorial/slides/check_browser.py
```

The check uses installed Google Chrome on macOS by default. Use `--browser` for
another Chromium executable and `--output` for review images. It checks settled
states offline, navigation, direct jumps, interrupted animations, reduced
motion, asset loading and projected links. It also checks the sampling replay's
counts and real histogram scale, and the unchanged QCO panel carried into the
optimization slide. Screenshots are retained for visual review.

The seven notebooks were executed on Python 3.15.1 with MQT Core 4.2.0. Their
locked environment is in the parent tutorial project. The revised notebook route
was re-executed locally, including the GHZ solution. Unchanged notebooks need
not be rerun for subsequent slide-only edits. The displayed compiler carousel
replays the reference capture, whose exact stack and limits are recorded in
SOURCES.md. No cluster deployment, cloud task or hardware execution is claimed.
