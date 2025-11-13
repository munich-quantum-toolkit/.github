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
  <img src="sc25_logo.png" width="100%" alt="SC25 Logo">
</td>
</tr>
</table>

# Connecting the HPC and the Quantum Computing Community

## Introduction

Quantum computing has the potential to revolutionize many fields in the 21st century.
Over the past decade, numerous quantum computers have been made publicly available.
However, the effectiveness of the hardware is heavily reliant on the software ecosystem---a lesson drawn from classical computing's evolution.
Unlike classical systems, which benefit from mature Electronic Design Automation (EDA) and High-Performance Computing (HPC) tools for handling complexity and optimizing performance, quantum software is still in its infancy.

One of the goals of this tutorial is to educate the HPC community on quantum computing and to bring these two communities closer together.
To this end, the tutorial intends to cover topics such as high-level support for users in realizing applications as well as efficient methods for the classical simulation, compilation, and verification of quantum circuits.
Furthermore, the tutorial showcases how expertise in classical HPC can address key challenges in the quantum software stack, enhancing efficiency, scalability, and reliability.

The following hands-on demonstrations based on the Munich Quantum Toolkit (MQT) will provide participants with a practical understanding of quantum computing software and where it intersects with HPC.

## Setup

The hands-on demonstrations will use Jupyter notebooks.
You can follow along using either `uv` (recommended) or traditional Python virtual environments.

### Option 1: Using uv (Recommended)

[uv](https://docs.astral.sh/uv/) is an extremely fast Python package and project manager written in Rust.
It handles Python installation, virtual environment creation, and package management automatically.

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

After installing `uv`, you can create the environment, install all dependencies, and launch Jupyter Lab with a single command:

```bash
uv run --with jupyter jupyter lab
```

This automatically creates a virtual environment, installs the project dependencies from `pyproject.toml`, and starts Jupyter Lab.

### Option 2: Using Python Virtual Environments

If you prefer using standard Python tools, you'll need Python 3.10-3.12 installed.

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
