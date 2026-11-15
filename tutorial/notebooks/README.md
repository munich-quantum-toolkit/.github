# SC26 notebooks

We will build a circuit, follow it through compilation, and run it through QDMI.
The exercises use Qiskit and MQT Core 4.2.1 and run locally on simulators. No
quantum hardware account is needed.

## Notebooks

| Notebook                                                      | Topic                                                   | Hands-on block |
| ------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| 1. [Build a circuit](circuit_basics.ipynb)                    | Qiskit, Bell/GHZ circuits, probabilities and shots      | 1              |
| 2. [Compiler representations](compiler_representations.ipynb) | QC/QCO, simplification and simulation                   | 2              |
| 3. [Hardware compilation](hardware_compilation.ipynb)         | Placement, routing, synthesis and target limits         | 3              |
| 4. [QDMI execution](qdmi_execution.ipynb)                     | Device discovery, jobs, counts, shots and program reuse | 4              |
| 5. [Control flow](control_flow.ipynb)                         | Registers, loops and measurement feedback               | Optional       |

During the tutorial, stop at each checkpoint and return to the slides. The
sections that follow are optional.

## Run the notebooks

[Download the notebooks (.zip)](https://github.com/munich-quantum-toolkit/.github/raw/refs/heads/tutorial-SC26/tutorial/_static/sc26-notebooks.zip)
and extract the archive. Open a terminal in the extracted `notebooks` folder,
then choose either option below. Both start JupyterLab with Python 3.15 and the
tutorial dependencies in an isolated environment. The first run downloads Python
and dependencies as needed.

### Option 1: Run uv directly

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) using a
method of your choice, then run:

```sh
uv run --no-project --python 3.15 --with-requirements requirements.txt jupyter lab
```

### Option 2: Use a launcher

On macOS or Linux:

```sh
bash start.sh
```

On Windows, in PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start.ps1
```

The launchers install `uv` for your user if needed, then start JupyterLab in
this directory.

Use JupyterLab to see the **Your turn** prompts and expandable answers. Start
each notebook with a fresh Python 3 kernel and run the cells from top to bottom.
Some plotting cells have collapsed inputs. Run them as usual, and expand the
inputs if you want to inspect their code.

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
