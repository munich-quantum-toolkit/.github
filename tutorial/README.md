<table>
<tr>
<td width="60%">
  <a href="https://mqt.readthedocs.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/logo-mqt-dark.svg" width="100%">
      <img src="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/logo-mqt-light.svg" width="100%" alt="MQT Logo">
    </picture>
  </a>
</td>
<td width="40%" align="right">
  <img src="sc26_logo.png" width="100%" alt="SC26 Logo">
</td>
</tr>
</table>

# Connecting the Quantum and HPC Communities

A Tutorial on High-Performance Software for Quantum Computing · SC26

## Introduction

The HTML tutorial starts with the IQM presentation's software-stack overview,
then moves through quantum circuits, MLIR-based compilation, QDMI and HPC
integration. Two 90-minute sessions include 110 minutes of notebook work. The
break follows the compiler primer, before the compilation notebook. The IQM and
openQSE presentations guide the story, complemented by the QCE tutorial's
compiler and QDMI material.

Build the offline slides using the presentations repository’s locked authoring
environment and open `slides/build/sc26-tutorial.html`. See
[slide authoring and validation](slides/README.md) for navigation, preview,
editing, and the local DDSIM examples.

The [seven notebooks](notebooks/README.md) begin with a Qiskit circuit exercise,
then reuse the QCE26 MLIR tutorial and the QDMI and jeff extensions from the MQT
Core documentation. They use MQT Core 4.2.0 and include executed outputs from
local simulation.

## Setup

Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then run
these commands from the `tutorial/` directory:

```sh
cd notebooks
uv run --no-project --python 3.15 --with-requirements requirements.txt jupyter lab
```

This uses the QCE tutorial's standalone setup with Python 3.15. See the
[notebook instructions](notebooks/README.md#run-the-notebooks) for the
alternative using Python's `venv` and `pip`, and for reproducing the locked
environment.
