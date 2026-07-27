# Overview of Tools

The following gives an overview of all repositories, ordered along the quantum
software stack from high-level Applications to Physical Design.

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
uv pip install mqt.bench
```

+++
[{fa}`fa-thin fa-desktop` Application](https://www.cda.cit.tum.de/mqtbench/) | [{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/bench) | [{fab}`python` PyPI](https://pypi.org/project/mqt.bench/) | {fa}`fa-thin fa-book` {doc}` Documentation <bench:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT ProblemSolver
:text-align: center
A Tool for Solving Problems Using Quantum Computing

```bash
uv pip install mqt.problemsolver
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/problemsolver) | [{fab}`python` PyPI](https://pypi.org/project/mqt.problemsolver/) | {fa}`fa-thin fa-book` {doc}` Documentation <problemsolver:index>` <!-- rumdl-disable-line MD013 -->
:::

::::

## Simulation

::::{grid} 2

:::{grid-item-card} MQT DDSIM
:text-align: center
A Tool for Classical Quantum Circuit Simulation based on Decision Diagrams

```bash
uv pip install mqt.ddsim
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ddsim) | [{fab}`python` PyPI](https://pypi.org/project/mqt.ddsim/) | {fa}`fa-thin fa-book` {doc}` Documentation <ddsim:index>` | [More ...](https://www.cda.cit.tum.de/research/quantum_simulation/) <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT YAQS
:text-align: center
A Tool for Simulating Open Quantum Systems, Noisy Quantum Circuits, and
Realistic Quantum Hardware

```bash
uv pip install mqt.yaqs
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/yaqs) | [{fab}`python` PyPI](https://pypi.org/project/mqt.yaqs/) | {fa}`fa-thin fa-book` {doc}` Documentation <yaqs:index>` <!-- rumdl-disable-line MD013 -->
:::

::::

## Compilation

::::{grid} 2

:::{grid-item-card} MQT Predictor
:text-align: center
A Tool for Determining Good Quantum Circuit Compilation Options

```bash
uv pip install mqt.predictor
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/predictor) | [{fab}`python` PyPI](https://pypi.org/project/mqt.predictor/) | {fa}`fa-thin fa-book` {doc}` Documentation <predictor:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT SyReC Synthesizer
:text-align: center
A Tool for the Synthesis of Reversible Circuits/Quantum Computing Oracles

```bash
uv pip install mqt.syrec
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/syrec) | [{fab}`python` PyPI](https://pypi.org/project/mqt.syrec/) | {fa}`fa-thin fa-book` {doc}` Documentation <syrec:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT QMAP
:text-align: center
A Tool for Quantum Circuit Mapping

```bash
uv pip install mqt.qmap
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qmap) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qmap/) | {fa}`fa-thin fa-book` {doc}` Documentation <qmap:index>` | [More ...](https://www.cda.cit.tum.de/research/ibm_qx_mapping/) <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT NAViz
:text-align: center
An Application to Visualize Compilation Output for Neutral Atom Quantum
Computers

```bash
uv pip install mqt.naviz
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/naviz) | [{fab}`python` PyPI](https://pypi.org/project/mqt.naviz/) | {fa}`fa-thin fa-book` {doc}` Documentation <naviz:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT IonShuttler
:text-align: center
A Tool for Generating Shuttling Schedules for QCCD Architectures

```bash
uv pip install mqt.ionshuttler
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ionshuttler) | [{fab}`python` PyPI](https://pypi.org/project/mqt.ionshuttler/) | {fa}`fa-thin fa-book` {doc}` Documentation <ionshuttler:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT Qudits
:text-align: center
A Framework For Mixed-Dimensional Qudit Quantum Computing

```bash
uv pip install mqt.qudits
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qudits) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qudits/) | {fa}`fa-thin fa-book` {doc}` Documentation <qudits:index>` <!-- rumdl-disable-line MD013 -->
:::

::::

## Verification

::::{grid} 2

:::{grid-item-card} MQT Debugger
:text-align: center
A Quantum Circuit Debugging Tool

```bash
uv pip install mqt.debugger
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/debugger) | [{fab}`python` PyPI](https://pypi.org/project/mqt.debugger/) | {fa}`fa-thin fa-book` {doc}` Documentation <debugger:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT QCEC
:text-align: center
A Tool for Quantum Circuit Equivalence Checking

```bash
uv pip install mqt.qcec
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qcec) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qcec/) | {fa}`fa-thin fa-book` {doc}` Documentation <qcec:index>` | [More ...](https://www.cda.cit.tum.de/research/quantum_verification/) <!-- rumdl-disable-line MD013 -->
:::

::::

## Quantum Error Correction

::::{grid} 2

:::{grid-item-card} MQT QECC
:text-align: center
A Tool for Quantum Error Correcting Codes

```bash
uv pip install mqt.qecc
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qecc) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qecc/) | {fa}`fa-thin fa-book` {doc}` Documentation <qecc:index>` <!-- rumdl-disable-line MD013 -->
:::

::::

## Data Structures and Core Methods

::::{grid} 2

:::{grid-item-card} MQT DDVis
:text-align: center
A Web-Application Visualizing Decision Diagrams for Quantum Computing +++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/ddvis) | [{fa}`fa-thin fa-desktop` Application](https://www.cda.cit.tum.de/app/ddvis/) | [More ...](https://www.cda.cit.tum.de/research/quantum_dd/)
:::

:::{grid-item-card} MQT Core
:text-align: center
The Backbone of the Munich Quantum Toolkit.

Quantum IR | DD Package | ZX Package

```bash
uv pip install mqt.core
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/core) | [{fab}`python` PyPI](https://pypi.org/project/mqt.core/) | {fa}`fa-thin fa-book` {doc}` Documentation <core:index>` <!-- rumdl-disable-line MD013 -->
:::

:::{grid-item-card} MQT QuSAT
:text-align: center
A Tool for Encoding Quantum Computing using Satisfiability Testing (SAT)
Techniques

```bash
uv pip install mqt.qusat
```

+++
[{fab}`github` GitHub](https://github.com/munich-quantum-toolkit/qusat) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qusat/) | {fa}`fa-thin fa-book` {doc}` Documentation <qusat:index>` <!-- rumdl-disable-line MD013 -->
:::

::::
