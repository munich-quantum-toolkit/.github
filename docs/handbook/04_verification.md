---
file_format: mystnb
kernelspec:
  name: python3
mystnb:
  number_source_lines: true
---

# Verification of Quantum Circuits

Compiling quantum algorithms results in different representations of the considered functionality, which significantly differ in their basis operations and structure but are still supposed to be functionally equivalent.
As described in the previous section, even individual compilation tasks can be highly complex.
Consequently, checking whether the original functionality is indeed maintained throughout all these different abstractions becomes increasingly relevant in order to guarantee a consistent and error-free compilation flow.
This is similar to the classical realm, where descriptions at various levels of abstraction also exist.
These descriptions are verified using design automation expertise---resulting in efficient methods for verification to ensure the correctness of the design across different levels of abstraction {cite:p}`drechslerAdvancedFormalVerification2004`.
However, since quantum circuits additionally employ quantum-physical effects such as superposition and entanglement, these methods cannot be used out of the box in the quantum realm.
Accordingly, verification of quantum circuits must be approached from a different perspective.
At first glance, these characteristics of quantum computing make verification much harder as for classical circuits and systems.
In fact, equivalence checking of quantum circuits has been proven to be a computationally hard problem {cite:p}`janzingNonidentityCheckQMAcomplete2005`.

At the same time, quantum circuits possess certain characteristics that offer remarkable potential for efficient equivalence checking that is not available in classical computing.
More precisely, consider two quantum circuits $G=g_1,\dots,g_m$ and $G'=g'_1,\dots,g'_n$ whose equivalence shall be checked.
Due to the inherent reversibility of quantum operations, the inverse of a quantum circuit can easily be computed by taking the complex conjugate of every gate and reversing the sequence of the gates in the circuit, i.e., $G^{\prime -1}= (g'_n)^\dagger,\dots,(g'_1)^\dagger$.
If two circuits are equivalent, this allows for the conclusion that $G\cdot G^{\prime -1} = I$, where $I$ is the identity function.
Since the identity has the most compact representation for most data structures representing quantum functionality (e.g., linear with respect to the number of qubits in case of decision diagrams), the equivalence check can be simplified considerably.
Even complex circuits can be verified efficiently, if one manages to apply the gates of both circuits in a sequence that keeps the intermediate representation "close to the identity".
Within the MQT, several methods and strategies were proposed that utilize this characteristic of quantum computations.
Eventually, this led to solutions that can verify the results of whole quantum compilation flows (such as IBM's Qiskit) in negligible runtime---something we never managed for classical circuits and systems.

The _MQT_ offers the quantum circuit equivalence checking tool QCEC {cite:p}`burgholzerQCECJKQTool2021` which encompasses a comprehensive suite of efficient methods and automated tools for the verification of quantum circuits based on the ideas outlined in {cite:p}`burgholzerAdvancedEquivalenceChecking2021,burgholzerImprovedDDbasedEquivalence2020, burgholzerPowerSimulationEquivalence2020,burgholzerRandomStimuliGeneration2021, burgholzerVerifyingResultsIBM2020,pehamEquivalenceCheckingParameterized2023,pehamEquivalenceCheckingQuantum2022,pehamEquivalenceCheckingParadigms2022,willeVerificationQuantumCircuits2022,sanderEquivalenceCheckingQuantum2024`.
By this, an important step towards avoiding or substantially mitigating the emerge of a verification gap for quantum circuits is taken, i.e., a situation where the physical development of a technology substantially outperforms our ability to design suitable applications for it or to verify it.

```{raw} latex
\begin{example}
```

Verifying that the quantum circuit from {numref}`fig-ghz-circuit-mapped` has been correctly compiled to the architecture from {numref}`fig-device`, i.e., checking whether it still implements the functionality of the circuit shown in {numref}`fig-ghz-circuit`, merely requires the following lines of Python:

```{code-cell} ipython3
:tags: [remove-cell]
%config InlineBackend.figure_formats = ['svg']

from qiskit import QuantumCircuit
from qiskit.providers.fake_provider import GenericBackendV2
from mqt.qmap.plugins.qiskit.sc import compile

circ = QuantumCircuit(4)
circ.h(3)
circ.cx(3, 2)
circ.cx(2, 1)
circ.cx(1, 0)
circ.measure_all()

backend = GenericBackendV2(num_qubits=5, coupling_map=[[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 0], [0, 4], [4, 0]])

circ_mapped, _ = compile(circ, backend)
```

```{code-cell} ipython3
from mqt.qcec import verify

result = verify(circ, circ_mapped)
print(result.equivalence)
```

```{raw} latex
\end{example}
```

```{raw} latex
\begin{minipage}[t]{0.76\linewidth}
\textbf{MQT QCEC}\newline
\emph{Code:} \href{https://github.com/cda-tum/mqt-qcec}{cda-tum/mqt-qcec}\newline
\emph{Python Package:} \href{https://pypi.org/p/mqt.qcec}{pypi.org/p/mqt.qcec}\newline
\emph{Documentation:} \href{https://mqt.readthedocs.io/projects/qcec}{mqt.rtfd.io/projects/qcec}
\end{minipage}%
\hspace{1em}%
\begin{minipage}[t]{0.15\linewidth}
\raisebox{2mm -\dimexpr\depth}{%
\qrcode[height=1.75cm]{https://github.com/cda-tum/mqt-qcec}
}
\end{minipage}
```

````{only} html
::::{grid} 1
:::{grid-item-card} MQT QCEC
:text-align: center
```bash
(venv) $ pip install mqt.qcec
```
+++
[{fab}`github` GitHub](https://github.com/cda-tum/mqt-qcec) | [{fab}`python` PyPI](https://pypi.org/project/mqt.qcec/) | {fa}`fa-thin fa-book` {doc}` Documentation <qcec:index>`
:::
::::
````
