<p align="center">
  <a href="https://mqt.readthedocs.io">
   <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cda-tum/mqt/main/docs/_static/mqt_light.png" width="50%">
     <img src="https://raw.githubusercontent.com/cda-tum/mqt/main/docs/_static/mqt_dark.png" width="50%" alt="MQT Logo">
   </picture>
  </a>

  <img src="sc24_logo.png" width="45%" alt="SC24 Logo">
</p>

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

The hands on demonstrations will use Jupyter notebooks.
The easiest way to follow along (without even having to have Python installed) is to use [uv](https://docs.astral.sh/uv/), which is an extremely fast Python package and project manager, written in Rust.

To install `uv`, run the following command:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

or

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

if you are on Windows.

After installing `uv`, you can straight-up start jupyter with:

```bash
uv run --with jupyter jupyter lab
```

If you prefer the old fashioned way (how boring 🤪), you can set up a Python (3.10-3.12) virtual environment and install the required packages with:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
pip install jupyter
python -m ipykernel install --sys-prefix
jupyter lab
```
