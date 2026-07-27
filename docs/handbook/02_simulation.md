---
file_format: mystnb
kernelspec:
  name: python3
mystnb:
  number_source_lines: true
---

# Classical Simulation of Quantum Circuits

Performing a quantum computation (commonly described as a quantum circuit)
entails evolving an initial quantum state by applying a sequence of operations
(also called gates) and measuring the resulting system. Eventually, the goal
should obviously be to do that on a real device. However, there are several
important reasons for simulating the corresponding computations on a classical
machine, particularly in the early stages of the design: As long as no suitable
devices are available (e.g., in terms of scale, feasible computation depth, or
accuracy), classical simulations of quantum circuits still allow one to explore
and test quantum applications, even if only on a limited scale. However, also
with further progress in the capabilities of the hardware platforms, classical
simulation will remain an essential part of the quantum computing design
process, since it additionally allows access to _all_ amplitudes of a resulting
quantum state in contrast to a real device that only probabilistically returns
measurement results. Moreover, classical simulation provides means to study
quantum error correction as well as a baseline to estimate the advantage of
quantum computers over classical computers.

The classical simulation of quantum circuits is commonly conducted by performing
consecutive matrix-vector multiplication, which many simulators realize by
storing a dense representation of the complete state vector in memory and
evolving it correspondingly (see, e.g.,
{cite:p}`hanerPetabyteSimulation45Qubit2017,doiQuantumComputingSimulator2019,jonesQuESTHighPerformance2018,guerreschiIntelQuantumSimulator2020, wuFullstateQuantumCircuit2019`) <!-- rumdl-disable-line MD013 -->
or by relying on tensor network methods (see, e.g.,
{cite:p}`markovSimulatingQuantumComputation2008,villalongaFlexibleHighperformanceSimulator2019,brennanTensorNetworkCircuit2021,vincentJetFastQuantum2022`).
This approach quickly becomes intractable due to the exponential growth of the
quantum state with respect to the number of qubits---quickly rendering such
simulations infeasible even on supercomputer clusters. Simulation methodologies
based on decision diagrams
{cite:p}`viamontesImprovingGatelevelSimulation2003,willeToolsQuantumComputing2022,willeDecisionDiagramsQuantum2023,willeVisualizingDecisionDiagrams2021`
are a promising complementary approach that frequently allows reducing the
required memory by exploiting redundancies in the simulated quantum state.

The _MQT_ offers the classical quantum circuit simulator _DDSIM_ that can be
used to perform various quantum circuit simulation tasks based on using decision
diagrams as a data structure. This includes strong and weak simulation
{cite:p}`zulehnerAdvancedSimulationQuantum2019,zulehnerMatrixVectorVsMatrixMatrix2019,hillmichJustRealThing2020`,
approximation techniques
{cite:p}`hillmichAccurateNeededEfficient2020,hillmichApproximatingDecisionDiagrams2022`,
noise-aware simulation
{cite:p}`grurlConsideringDecoherenceErrors2020,grurlStochasticQuantumCircuit2021,grurlNoiseawareQuantumCircuit2023`,
hybrid Schrödinger-Feynman techniques
{cite:p}`burgholzerHybridSchrodingerFeynmanSimulation2021`, support for dynamic
circuits, the computation of expectation values
{cite:p}`sanderHamiltonianSimulationDecision2023`, the simulation of
mixed-dimensional systems {cite:p}`matoMixeddimensionalQuantumCircuit2023`, and
more
{cite:p}`hillmichConcurrencyDDbasedQuantum2020,grurlArraysVsDecision2020,burgholzerExploitingArbitraryPaths2022,burgholzerSimulationPathsQuantum2022,burgholzerEfficientConstructionFunctional2021,hillmichReorderingDecisionDiagrams2022,jiangFlatDDHighPerformanceQuantum2024,sanderStrippingQuantumDecision2024`.

```{raw} latex
\begin{example}
```

```{code-cell} ipython3
:tags: [remove-cell]
%config InlineBackend.figure_formats = ['svg']
```

Consider the following listing that describes the quantum circuit for generating
a four-qubit GHZ state (also shown in {numref}`fig-ghz-circuit`):

```{code-cell} ipython3
:tags: [remove-output]
from qiskit import QuantumCircuit

circ = QuantumCircuit(4)
circ.h(3)
circ.cx(3, 2)
circ.cx(2, 1)
circ.cx(1, 0)
circ.measure_all()
```

```{code-cell} ipython3
---
tags: [remove-input]
mystnb:
  image:
    width: 50%
  figure:
    align: center
    caption: "Quantum circuit for generating a four-qubit GHZ state."
    name: fig-ghz-circuit
---
circ.draw(output="mpl", style="iqp")
```

This circuit can be classically simulated using DDSIM as a backend for IBM
Qiskit:

```{code-cell} ipython3
from mqt.ddsim import DDSIMProvider

provider = DDSIMProvider()
backend = provider.get_backend("qasm_simulator")
result = backend.run(circ, shots=10000).result()
result.get_counts()
```

```{raw} latex
\end{example}
```

```{raw} latex
\begin{minipage}[t]{0.76\linewidth}
\textbf{MQT DDSIM}\newline
\emph{Code:} \href{https://github.com/cda-tum/mqt-ddsim}{cda-tum/mqt-ddsim}\newline
\emph{Python Package:} \href{https://pypi.org/p/mqt.ddsim}{pypi.org/p/mqt.ddsim}\newline
\emph{Documentation:} \href{https://mqt.readthedocs.io/projects/ddsim}{mqt.rtfd.io/projects/ddsim}
\end{minipage}%
\hspace{1em}%
\begin{minipage}[t]{0.15\linewidth}
\raisebox{2mm -\dimexpr\depth}{%
\qrcode[height=1.75cm]{https://github.com/cda-tum/mqt-ddsim}
}
\end{minipage}
```

````{only} html
::::{grid} 1
:::{grid-item-card} MQT DDSIM
:text-align: center
```bash
uv pip install mqt.ddsim
```
+++
[{fab}`github` GitHub](https://github.com/cda-tum/mqt-ddsim) | [{fab}`python` PyPI](https://pypi.org/project/mqt.ddsim/) | {fa}`fa-thin fa-book` {doc}` Documentation <ddsim:index>`
:::
::::
````
