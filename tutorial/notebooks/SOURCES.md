# Notebook foundation and documentation comparison

The four compiler notebooks originate in
`munich-quantum-toolkit/qce26-mlir-tutorial`, branch `update-mqt-core-4.1`,
commit `98a1c40` (Update MQT Core to 4.1). The original checkout had local
executed outputs and one experimental edit; it was read but not modified. This
tutorial imports the committed foundation and keeps its example sequence,
exercises, diagrams and independent-notebook structure.

Those four notebooks and the two documentation extensions were compared with
`core/docs/tutorials/` at MQT Core `v4.2.0`. Those source files also match the
local MQT Core checkout at
`7fd535c68bb81de822dc9143acdf2ade202847e0 Fix ty errors`. Exact source paths and
the release commit are recorded in each notebook's `sc26_sources` metadata.

| Notebook                   | Changes from the QCE foundation                                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compiler_representations` | Use `simplify-quantum` for quantum cancellation; retain `canonicalize` for classical/structural cleanup; use QCO's direct gate inspection. Preserve full-matrix and ownership checks.                                        |
| `control_flow`             | Bring source prose and imports into alignment. Preserve registers, carried quantum values, explicit unrolling and feedback experiments.                                                                                      |
| `hardware_compilation`     | Align with the source documentation while retaining the triangle/line comparison, native gate checks, logical result checks and explicit QDMI submission.                                                                    |
| `qir_execution`            | Replace `llvm_ir` with `to_llvm_ir(copy=True)`; capture inspection text before consuming serialization; select Base output through `output`; catch the release's compilation error type. Refresh output-capture explanation. |
| `qdmi_execution`           | Added from the documentation: discovery, capabilities, compilation, jobs, histogram/shot consistency, NumPy state results, reuse and format comparison.                                                                      |
| `jeff_exchange`            | Added from the documentation: binary serialization, full-unitary phase checks, file handoff to a fresh process, structured feedback and later device compilation.                                                            |

The QDMI documentation assumes the automatic format in its last comparison is
QIR. MQT Core 4.2.0 selects QASM3 for the supplied source in the verified run.
This notebook labels the actual automatic format and explicitly submits QIR Base
for the second execution path. The changed code is intentional and avoids
comparing two OpenQASM executions under different labels.

The surrounding teaching prose follows the MQT Core 4.2 tutorial pages. The SC26
additions are the three session timing paragraphs and their checkpoints, plus
the QDMI format clarification above. QDMI reuse precedes optional state
extraction so the live route can stop after the device/job workflow.

All page references use full URLs under
`https://mqt.readthedocs.io/projects/core/en/stable/`; original external links
are retained. Descriptive link titles replace MyST roles. Dropdown answers use
HTML `<details>` and `<summary>` elements with blank lines around their Markdown
content. The two original SVG teaching diagrams remain local under `_static/`.
The four original code-cell sequences are preserved.

For inspiration, the SC24 and SC25 notebooks on their `.github` tutorial
branches were inspected. Their small Bell/GHZ starting points, target
comparisons, prediction questions and matrix-based checks are retained through
the QCE foundation. Their separate MQT Bench/QMAP/QCEC dependencies and runtime
comparisons are outside this compilation/QDMI session.

`circuit_basics.ipynb` is a separate SC26 introduction. It uses Qiskit's
`QuantumCircuit` and `Statevector` for circuit construction, exact
probabilities, shots, bit order, and phase. It concludes with
`QCProgram.from_qiskit` to connect to the existing QCE sequence. No QCE code
cells were changed by this addition. Its GHZ exercise includes a collapsed
solution and a conditional checker.

Validation: the six compiler/execution notebooks are executed with local DDSIM
in the tutorial's Python 3.15.1 / MQT Core 4.2.0 / Qiskit 2.6.2 environment.
Outputs are kept in the notebooks for offline reference. This does not validate
a cluster, an external provider, or another operating system. The new Qiskit
notebook was executed separately with the same versions, including its supplied
GHZ solution.

The standalone setup also passed in a clean Python 3.15.1 virtual environment
created with `venv` and populated with
`python -m pip install -r requirements.txt`. `pip check`, all seven notebooks,
and the supplied GHZ solution passed. JupyterLab 4.6.6 rendered and toggled all
nine HTML answer dropdowns. All 29 documentation links, including section
anchors, were checked against the published stable documentation. The QCE-style
uv command also resolved and launched JupyterLab 4.6.6. No packages were
installed globally.

## SC26 session route revision

The separate QCE checkout and its committed `98a1c40` foundation were compared
again with these notebooks. The four foundation notebooks retain their original
code-cell sequences with the MQT Core 4.2 API changes listed above. The six
owning Markdown tutorial sources in the local MQT Core checkout still match
`v4.2.0`. The QCE PowerPoint's `canonicalize` cancellation example is superseded
by `simplify-quantum` in the released documentation. The current QIR
serialization and NumPy result APIs are retained here.

The 40/40/30-minute route adds planning text and checkpoints to the four core
notebooks. In `qdmi_execution`, compiled-artifact reuse now precedes optional
simulator-state extraction. Its short QDMI imports are combined on one line. The
example programs and assertions are unchanged. Control flow, QIR and jeff remain
optional follow-up notebooks. The introductory notebook can use saved simulation
outputs while attendees focus on circuit construction and prediction.
