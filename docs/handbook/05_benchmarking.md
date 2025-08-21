---
file_format: mystnb
kernelspec:
  name: python3
mystnb:
  number_source_lines: true
---

# Benchmarking Software and Design Automation Tools for Quantum Computing

Tools like the ones proposed above are key in order to support end users in the realization of their quantum computing applications.
And, thankfully, a huge variety of tools has been proposed in the past—with many more to come.
However, whenever such a quantum software tool is proposed, it is important to empirically evaluate its performance and to compare it to the state of the art.
For that purpose, proper benchmarks are needed.
To provide those, MQT Bench is proposed {cite:p}`quetschlichMQTBenchBenchmarking2023`, which offers over $70,000$ benchmarks on various abstraction levels (depending on what level the to-be-evaluated software tool operates on).
Having all those benchmarks in a single repository enables an increased comparability, reproducibility, and transparency.
To make the benchmarks as accessible as possible, MQT Bench comes as an easy-to-use website that is hosted at [www.cda.cit.tum.de/mqtbench/](https://www.cda.cit.tum.de/mqtbench/) and as a Python package available on [PyPI](https://pypi.org/project/mqt.bench/).

```{raw} latex
\begin{example}
```

```{code-cell} ipython3
:tags: [remove-cell]
%config InlineBackend.figure_formats = ['svg']
```

A larger version of the quantum circuit from {numref}`fig-ghz-circuit` can easily be obtained programmatically from the MQT Bench Python package as follows:

```{code-cell} ipython3
from mqt.bench import BenchmarkLevel, get_benchmark

circ = get_benchmark("ghz", level=BenchmarkLevel.ALG, circuit_size=8)
```

```{code-cell} ipython3
---
tags: [remove-input]
mystnb:
  image:
    width: 50%
  figure:
    align: center
    caption: "Larger version of the circuit from {numref}`fig-ghz-circuit` obtained via MQT Bench."
    name: fig-ghz-circuit-bench
---
circ.draw(output='mpl', style='iqp')
```

This gives the circuit shown in {numref}`fig-ghz-circuit-bench`, which can then be used to evaluate the performance of a quantum software tool, e.g., to test how well the tool can simulate the circuit or how well it can compile it to a given architecture.

```{raw} latex
\end{example}
```

```{raw} latex
\begin{minipage}[t]{0.76\linewidth}
\textbf{MQT Bench}\newline
\emph{Code:} \href{https://github.com/cda-tum/mqt-bench}{cda-tum/mqt-bench}\newline
\emph{Python Package:} \href{https://pypi.org/p/mqt.bench}{pypi.org/p/mqt.bench}\newline
\emph{Documentation:} \href{https://mqt.readthedocs.io/projects/bench}{mqt.rtfd.io/projects/bench}
\end{minipage}%
\hspace{1em}%
\begin{minipage}[t]{0.15\linewidth}
\raisebox{2mm -\dimexpr\depth}{%
\qrcode[height=1.75cm]{https://github.com/cda-tum/mqt-bench}
}
\end{minipage}
```

````{only} html
::::{grid} 1
:::{grid-item-card} MQT Bench
:text-align: center
```bash
(venv) $ pip install mqt.bench
```
+++
[{fab}`github` GitHub](https://github.com/cda-tum/mqt-bench) | [{fab}`python` PyPI](https://pypi.org/project/mqt.bench/) | {fa}`fa-thin fa-book` {doc}` Documentation <bench:index>`
:::
::::
````
