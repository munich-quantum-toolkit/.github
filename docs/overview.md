# Overview of Tools

The following gives an overview of all repositories, ordered along the quantum software stack from high-level Applications to Physical Design.

- [Application](#application)
- [Simulation](#simulation)
- [Compilation](#compilation)
- [Verification](#verification)
- [Quantum Error Correction](#quantum-error-correction)
- [Data Structures and Core Methods](#data-structures-and-core-methods)

---

## Application

::::{grid} 2

:::{grid-item-card} MQT Bench
:text-align: center
A Quantum Circuit Benchmark Suite

```bash
(.venv) $ pip install mqt.bench
```

+++
[{fa}`fa-thin fa-desktop` Application](https://www.cda.cit.tum.de/mqtbench/) | [{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/bench) | [{fab}`python` PyPI](https://pypi.org/project/mqt.bench/) | {fa}`fa-thin fa-book` {doc}` Documentation <bench:index>`
:::

:::{grid-item-card} MQT ProblemSolver
:text-align: center
A Tool for Solving Problems Using Quantum Computing

```bash
(.venv) $ pip install mqt.problemsolver
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/problemsolver) | [{fab}`python` PyPI](https://pypi.org/project/mqt.problemsolver/) | {fa}`fa-thin fa-book` {doc}` Documentation <problemsolver:index>`
:::

::::

## Simulation

::::{grid} 2

:::{grid-item-card} MQT DDSIM
:text-align: center
A Tool for Classical Quantum Circuit Simulation based on Decision Diagrams

```bash
(.venv) $ pip install mqt.ddsim
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ddsim) | [{fab}`python` PyPI](https://pypi.org/project/mqt.ddsim/) | {fa}`fa-thin fa-book` {doc}` Documentation <ddsim:index>` | [More ...](https://www.cda.cit.tum.de/research/quantum_simulation/)
:::

:::{grid-item-card} MQT YAQS
:text-align: center
A Tool for Simulating Open Quantum Systems, Noisy Quantum Circuits, and Realistic Quantum Hardware

```bash
(.venv) $ pip install mqt.yaqs
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/yaqs) | [{fab}`python` PyPI](https://pypi.org/project/mqt.yaqs/) | {fa}`fa-thin fa-book` {doc}` Documentation <yaqs:index>`
:::

::::

## Compilation

::::{grid} 2

:::{grid-item-card} MQT Predictor
:text-align: center
A Tool for Determining Good Quantum Circuit Compilation Options

```bash
(.venv) $ pip install mqt.predictor
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/predictor) | [{fab}`python` PyPI](https://pypi.org/project/mqt.predictor/) | {fa}`fa-thin fa-book` {doc}` Documentation <predictor:index>`
:::

:::{grid-item-card} MQT SyReC Synthesizer
:text-align: center
A Tool for the Synthesis of Reversible Circuits/Quantum Computing Oracles

```bash
(.venv) $ pip install mqt.syrec
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/syrec) | [{fab}`python` PyPI](https://pypi.org/project/mqt.syrec/) | {fa}`fa-thin fa-book` {doc}` Documentation <syrec:index>`
:::

:::{grid-item-card} MQT QMAP
:text-align: center
A Tool for Quantum Circuit Mapping

```bash
(.venv) $ pip install mqt.qmap
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qmap) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qmap/) | {fa}`fa-thin fa-book` {doc}` Documentation <qmap:index>` | [More ...](https://www.cda.cit.tum.de/research/ibm_qx_mapping/)
:::

:::{grid-item-card} MQT NAViz
:text-align: center
An Application to Visualize Compilation Output for Neutral Atom Quantum Computers

```bash
(.venv) $ pip install mqt.naviz
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/naviz) | [{fab}`python` PyPI](https://pypi.org/project/mqt.naviz/) | {fa}`fa-thin fa-book` {doc}` Documentation <naviz:index>`
:::

:::{grid-item-card} MQT IonShuttler
:text-align: center
A Tool for Generating Shuttling Schedules for QCCD Architectures

```bash
(.venv) $ pip install mqt.ionshuttler
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ionshuttler) | [{fab}`python` PyPI](https://pypi.org/project/mqt.ionshuttler/) | {fa}`fa-thin fa-book` {doc}` Documentation <ionshuttler:index>`
:::

:::{grid-item-card} MQT Qudits
:text-align: center
A Framework For Mixed-Dimensional Qudit Quantum Computing

```bash
(.venv) $ pip install mqt.qudits
```

+++
[{fab}`github` GitHub](https://github/com/munich-quantum-toolkit/qudits) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qudits/) | {fa}`fa-thin fa-book` {doc}` Documentation <qudits:index>`
:::

::::

## Verification

::::{grid} 2

:::{grid-item-card} MQT Debugger
:text-align: center
A Quantum Circuit Debugging Tool

```bash
(.venv) $ pip install mqt.debugger
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/debugger) | [{fab}`python` PyPI](https://pypi.org/project/mqt.debugger/) | {fa}`fa-thin fa-book` {doc}` Documentation <debugger:index>`
:::

:::{grid-item-card} MQT QCEC
:text-align: center
A Tool for Quantum Circuit Equivalence Checking

```bash
(.venv) $ pip install mqt.qcec
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qcec) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qcec/) | {fa}`fa-thin fa-book` {doc}` Documentation <qcec:index>` | [More ...](https://www.cda.cit.tum.de/research/quantum_verification/)
:::

::::

## Quantum Error Correction

::::{grid} 2

:::{grid-item-card} MQT QECC
:text-align: center
A Tool for Quantum Error Correcting Codes

```bash
(.venv) $ pip install mqt.qecc
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qecc) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qecc/) | {fa}`fa-thin fa-book` {doc}` Documentation <qecc:index>`
:::

::::

## Data Structures and Core Methods

::::{grid} 2

:::{grid-item-card} MQT DDVis
:text-align: center
A Web-Application Visualizing Decision Diagrams for Quantum Computing
+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ddvis) | [{fa}`fa-thin fa-desktop` Application](https://www.cda.cit.tum.de/app/ddvis/) | [More ...](https://www.cda.cit.tum.de/research/quantum_dd/)
:::

:::{grid-item-card} MQT Core
:text-align: center
The Backbone of the Munich Quantum Toolkit.

Quantum IR | DD Package | ZX Package

```bash
(.venv) $ pip install mqt.core
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/core) | [{fab}`python` PyPI](https://pypi.org/project/mqt.core/) | {fa}`fa-thin fa-book` {doc}` Documentation <core:index>`
:::

:::{grid-item-card} MQT QuSAT
:text-align: center
A Tool for Encoding Quantum Computing using Satisfiability Testing (SAT) Techniques

```bash
(.venv) $ pip install mqt.qusat
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qusat) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qusat/) | {fa}`fa-thin fa-book` {doc}` Documentation <qusat:index>`
:::

::::
