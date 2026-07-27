# Open-Source Implementations

All tools that have been developed as part of the _MQT_ are publicly available
on
[github.com/munich-quantum-toolkit](https://github.com/munich-quantum-toolkit).
Many of these tools are powered by MQT Core, which forms the backbone of the
entire toolkit. It features a comprehensive intermediate representation for
quantum computations as well as a state-of-the-art decision diagram package for
quantum computing and a dedicated ZX-calculus library.

All tools have been mainly implemented in C++, but strive to be as user-friendly
as possible for the community. Hence, push-button solutions are provided through
Python bindings, pre-built Python wheels are available for all major platforms
and Python versions, and all tools integrate natively with IBM's Qiskit. All
tools are actively maintained and well documented.

```{raw} latex
\begin{minipage}[t]{0.76\linewidth}
\textbf{MQT Core}\newline
\emph{Code:} \href{https://github.com/cda-tum/mqt-core}{cda-tum/mqt-core}\newline
\emph{Python Package:} \href{https://pypi.org/p/mqt.core}{pypi.org/p/mqt.core}\newline
\emph{Documentation:} \href{https://mqt.readthedocs.io/projects/core}{mqt.rtfd.io/projects/core}
\end{minipage}%
\hspace{1em}%
\begin{minipage}[t]{0.15\linewidth}
\raisebox{2mm -\dimexpr\depth}{%
\qrcode[height=1.75cm]{https://github.com/cda-tum/mqt-core}
}
\end{minipage}
```

````{only} html
::::{grid} 1
:::{grid-item-card} MQT Core
:text-align: center
```bash
uv pip install mqt.core
```
+++
[{fab}`github` GitHub](https://github.com/cda-tum/mqt-core) | [{fab}`python` PyPI](https://pypi.org/project/mqt.core/) | {fa}`fa-thin fa-book` {doc}` Documentation <core:index>`
:::
::::
````
