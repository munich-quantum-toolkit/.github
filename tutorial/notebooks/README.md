# SC26 notebooks

These notebooks reuse the QCE26 MLIR tutorial for MQT Core 4.2.0. A new Qiskit
circuit introduction comes first. The compiler examples come from QCE, and the
QDMI notebook comes from MQT Core's documentation. Each notebook runs
independently, using Qiskit's statevector simulator or local DDSIM.

## Run the notebooks

Install [uv](https://docs.astral.sh/uv/getting-started/installation/).

In this directory (`tutorial/notebooks/`), start JupyterLab with all tutorial
dependencies:

```sh
uv run --no-project --python 3.15 --with-requirements requirements.txt jupyter lab
```

This follows the QCE tutorial's setup command and selects Python 3.15. Start
each notebook with a fresh Python 3 kernel and run the cells from top to bottom.

### Without uv

Use an installed Python 3.15 interpreter to create a virtual environment in this
directory.

On macOS or Linux:

```sh
python3.15 -m venv .venv
source .venv/bin/activate
```

On Windows, in PowerShell:

```powershell
py -3.15 -m venv .venv
.venv\Scripts\Activate.ps1
```

With the virtual environment active, install the dependencies and start
JupyterLab:

```sh
python -m pip install -r requirements.txt
python -m jupyterlab
```

Packages are installed only in `.venv`. Run `deactivate` when you are done.

### Reproduce the locked environment

The requirements pin MQT Core 4.2.0, Qiskit 2.6.2, and the other direct
dependencies. The parent project's lockfile also freezes their transitive
dependencies. From `tutorial/`, use:

```sh
uv run --locked jupyter lab notebooks
```

## Suggested route

| Notebook                                                   | Topic                                                       | Use during the tutorial |
| ---------------------------------------------------------- | ----------------------------------------------------------- | ----------------------- |
| [Build a circuit](circuit_basics.ipynb)                    | Qiskit, Bell/GHZ circuits, probabilities, shots, phase      | Notebook session 1      |
| [Compiler representations](compiler_representations.ipynb) | QC/QCO, simplification, matrix checks, ownership            | Notebook session 2      |
| [Control flow](control_flow.ipynb)                         | Registers, loops, feedback, static versus executed work     | Optional extension      |
| [Hardware compilation](hardware_compilation.ipynb)         | Placement, routing, synthesis, target limits and QDMI       | Notebook session 3      |
| [QDMI execution](qdmi_execution.ipynb)                     | Capabilities, jobs, shots, counts, state and artifact reuse | Notebook session 4      |

The live route uses **30 + 20 + 25 + 35 minutes** across two 90-minute sessions:

1. **Session 1, Notebook 01 (30 min):** build Bell and GHZ circuits, predict
   measurements and phase effects, and import the Bell circuit into MQT Core.
   Simulation is optional. Saved outputs support discussion without rerunning
   it.
2. **Session 1, Notebook 02 (20 min):** inspect and optimize compiler
   representations through the checkpoint, then take the break.
3. **After the break, Notebook 03 (25 min):** work through hardware compilation
   and the logical result checks. Return to the slides before the optional
   target experiments and QDMI submission section.
4. **Session 2, Notebook 04 (35 min):** discover DDSIM, inspect formats,
   compile, submit, compare counts and shots, and reuse the compiled artifact.
   Stop at the checkpoint before simulator-state and program-format extensions.

All five notebooks include executed outputs as a fallback. The first notebook
leaves its GHZ exercise cell for attendees to complete and supplies a collapsed
solution. Its checker runs once a circuit is provided. The default examples need
no hardware account, cloud service or separately installed MLIR SDK. The two
topology targets are models; their programs execute only on DDSIM.

The QCE notebooks keep their existing examples, exercises and sequence, with the
MQT Core 4.2 API and documentation updates recorded in `SOURCES.md`.

## Re-execute

From `tutorial/`:

```sh
uv run --locked jupyter nbconvert --execute --to notebook --inplace notebooks/*.ipynb
```

This refreshes outputs. The notebooks include checks for operation counts,
unitaries, topology constraints, output distributions and result consistency.
Review regenerated results before committing. See
[source comparison](SOURCES.md) for changes relative to QCE and the
documentation.
