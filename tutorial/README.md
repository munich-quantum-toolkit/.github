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

This branch contains the tutorial setup. Slides and notebooks will be added
later.

## Setup

Run the following commands from the `tutorial/` directory. The dependency
declarations are retained from SC25; the SC26 lockfile will be added with the
notebooks. You can follow along using either `uv` (recommended) or traditional
Python virtual environments.

### Option 1: Using uv (Recommended)

[uv](https://docs.astral.sh/uv/) is an extremely fast Python package and project
manager written in Rust. It handles Python installation, virtual environment
creation, and package management automatically.

**Install uv:**

On macOS/Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows:

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Start Jupyter Lab:**

After installing `uv`, you can create the environment, install all dependencies,
and launch Jupyter Lab with a single command:

```bash
uv run --with jupyter jupyter lab
```

This automatically creates a virtual environment, installs the project
dependencies from `pyproject.toml`, and starts Jupyter Lab.

### Option 2: Using Python Virtual Environments

If you prefer using standard Python tools, you'll need Python 3.10-3.12
installed.

**Create and activate a virtual environment:**

On macOS/Linux:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

**Install dependencies and start Jupyter Lab:**

```bash
pip install -e .
pip install jupyter
jupyter lab
```
