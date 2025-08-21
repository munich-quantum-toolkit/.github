---
file_format: mystnb
kernelspec:
  name: python3
mystnb:
  number_source_lines: true
---

# Compilation of Quantum Circuits

In today's digital world, creating computer programs has become a crucial element of software development.
With the advent of high-level programming languages such as C++ or Python, the development process has become simpler and more efficient.
These languages enable developers to produce code that is more human-readable and understandable without having to worry about the underlying hardware's low-level features.
But before these programs can be executed on a computer, they must be translated into machine code that the computer can process.
This procedure is known as _compilation_, and it entails converting high-level code into a binary format that the computer's processor can directly execute.
By making it easier for more people to create computer programs, this has enabled the development of complex software applications that can run on many different platforms such as desktops, laptops, mobile phones or embedded devices.

Just as in classical computing, the design of quantum circuits and the development of quantum algorithms are fundamental in the development of quantum computing applications.
Quantum circuits are analogous to classical functions or programs in that they are a sequence of quantum gates that perform specific operations on quantum bits or qubits instead of classical bits.
Similarly to classical processors, quantum processors can only execute a certain set of native instructions, and they might further limit the qubits on which these operations might be applied.
Thus, any high-level quantum circuit (describing a quantum application) must be _compiled_ into a representation that can be executed on the targeted device.
Most importantly, the resulting quantum circuit must only use gates that are native to the device on which it shall be executed.
If the device only has limited connectivity between its qubits, it must only apply gates to qubits that are connected on the device.
Naturally, the efficiency of this compilation process is critical because it can have a significant impact on the performance of the resulting quantum program.
Inefficient compilation can lead to longer execution times, higher error rates, and reduced accuracy in the final result.
Therefore, developing efficient compilation methods for quantum programs is essential to overcome the challenges of quantum computing and realize the potential of this technology.

In the following, we mainly focus on the _quantum circuit mapping_ task.
This is a crucial step in the compilation flow, as it directly affects the feasibility and performance of the quantum circuit on a given device.
It involves finding a way to map the qubits of a quantum circuit to the qubits of a quantum device, while respecting the limited connectivity constraints of the device and minimizing the overhead of additional gates.
In most cases, it is not possible to statically define a mapping of the circuit's qubits to the device's qubits such that all gates of the circuit conform to the connectivity limitations of the device.
Consequently, this mapping has to change dynamically throughout the circuit.
This can be accomplished by using _SWAP_ gates that allow the position of two logical qubits on the architecture to be interchanged.
However, since any additional gate increases the error rate and, hence, reduces the accuracy of the computation, it is vital to keep the number of additionally added gates as low as possible.
It has been shown that even this small part in the compilation flow is an NP-complete problem {cite:p}`boteaComplexityQuantumCircuit2018`.

The _MQT_ offers the quantum circuit mapping tool QMAP {cite:p}`willeMQTQMAPEfficient2023` that allows one to generate circuits which satisfy all constraints given by the targeted architecture and, at the same time, keep the overhead in terms of additionally required quantum gates as low as possible.
More precisely, different approaches based on design automation techniques are provided, which are generic and can be easily configured for future architectures.
Among them is a heuristic, scalable solution for arbitrary circuits based on informed-search algorithms {cite:p}`zulehnerEfficientMethodologyMapping2019,hillmichExploitingQuantumTeleportation2021,zulehnerCompilingSUQuantum2019` as well as a solution for obtaining mappings ensuring minimal overhead with respect to SWAP gate insertions {cite:p}`willeMappingQuantumCircuits2019,burgholzerLimitingSearchSpace2022`.

Additionally, the _MQT_ offers many more methods for various compilation tasks, such as Clifford circuit synthesis {cite:p}`pehamDepthoptimalSynthesisClifford2023, schneiderSATEncodingOptimal2023`, determining optimal sub-architectures {cite:p}`pehamOptimalSubarchitecturesQuantum2023`, compiler optimization {cite:p}`quetschlichMQTPredictorAutomatic2024,quetschlichCompilerOptimizationQuantum2023,quetschlichReducingCompilationTime2023`, and compilation techniques for neutral atom technologies {cite:p}`schmidHybridCircuitMapping2024,schmidComputationalCapabilitiesCompiler2024,stadeAbstractModelEfficient2024,stadeOptimalStatePreparation2025`, ion-trap shuttling {cite:p}`schoenbergerUsingBooleanSatisfiability2024,schoenbergerCyclebasedShuttlingTrappedIon2024,schoenbergerShuttlingScalableTrappedIon2024`, or multi-level quantum systems {cite:p}`matoAdaptiveCompilationMultilevel2022,matoCompilationEntanglingGates2023,matoCompressionQubitCircuits2023,matoMixeddimensionalQuditState2024,matoMQTQuditsSoftware2024`.
Furthermore, it provides first automated methods regarding _Fault-Tolerant Quantum Computing_ (FTQC) such as automatic circuit generation and evaluation for error-correcting codes {cite:p}`grurlAutomaticImplementationEvaluation2023`.

```{raw} latex
\begin{example}
```

Assume we want to perform the computation from {numref}`fig-ghz-circuit` on a five-qubit IBM quantum computer described by the coupling map shown in {numref}`fig-device`.

```{code-cell} ipython3
---
tags: [remove-input]
mystnb:
  image:
    width: 30%
  figure:
    align: center
    caption: "Coupling map of a generic five-qubit device."
    name: fig-device
---
%config InlineBackend.figure_formats = ['svg']

from qiskit import QuantumCircuit
from qiskit.providers.fake_provider import GenericBackendV2
from qiskit.visualization import plot_gate_map

circ = QuantumCircuit(4)
circ.h(3)
circ.cx(3, 2)
circ.cx(2, 1)
circ.cx(1, 0)
circ.measure_all()

backend = GenericBackendV2(num_qubits=5, coupling_map=[[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 0], [0, 4], [4, 0]])
plot_gate_map(backend)
```

Then, mapping the circuit to that device merely requires the following lines of Python and results in the circuit shown in {numref}`fig-ghz-circuit-mapped`.

```{code-cell} ipython3
from mqt.qmap.plugins.qiskit.sc import compile
from qiskit.providers.fake_provider import GenericBackendV2

backend = GenericBackendV2(
    num_qubits=5,
    coupling_map=[[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 0], [0, 4], [4, 0]]
)

circ_mapped, results = compile(circ, backend)
```

```{code-cell} ipython3
---
tags: [remove-input]
mystnb:
  image:
    width: 50%
  figure:
    align: center
    caption: "Quantum circuit from {numref}`fig-ghz-circuit` mapped to the five-qubit device shown in {numref}`fig-device`."
    name: fig-ghz-circuit-mapped
---
circ_mapped.draw(output='mpl', style='iqp')
```

```{raw} latex
\end{example}
```

```{raw} latex
\begin{minipage}[t]{0.76\linewidth}
\textbf{MQT QMAP}\newline
\emph{Code:} \href{https://github.com/cda-tum/mqt-qmap}{cda-tum/mqt-qmap}\newline
\emph{Python Package:} \href{https://pypi.org/p/mqt.qmap}{pypi.org/p/mqt.qmap}\newline
\emph{Documentation:} \href{https://mqt.readthedocs.io/projects/qmap}{mqt.rtfd.io/projects/qmap}
\end{minipage}%
\hspace{1em}%
\begin{minipage}[t]{0.15\linewidth}
\raisebox{2mm -\dimexpr\depth}{%
\qrcode[height=1.75cm]{https://github.com/cda-tum/mqt-qmap}
}
\end{minipage}
```

````{only} html
::::{grid} 1
:::{grid-item-card} MQT QMAP
:text-align: center
```bash
(venv) $ pip install mqt.qmap
```
+++
[{fab}`github` GitHub](https://github.com/cda-tum/mqt-qmap) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qmap/) | {fa}`fa-thin fa-book` {doc}` Documentation <qmap:index>`
:::
::::
````
