```{only} html
<div style="margin-top: 0.5em">
<div class="only-light" align="center">
  <img src="_static/logo-mqt-light.svg" width="60%" alt="MQT Logo">
</div>
<div class="only-dark" align="center">
  <img src="_static/logo-mqt-dark.svg" width="60%" alt="MQT Logo">
</div>
</div>
```

# The MQT Handbook

```{raw} latex
\begin{abstract}
```

Quantum computers are becoming a reality and numerous quantum computing applications with a near-term perspective (e.g., for finance, chemistry, machine learning, and optimization) and with a long-term perspective (e.g., for cryptography or unstructured search) are currently being investigated.
However, designing and realizing potential applications for these devices in a scalable fashion requires automated, efficient, and user-friendly software tools that cater to the needs of end users, engineers, and physicists at every level of the entire quantum software stack.
Many of the problems to be tackled in that regard are similar to design problems from the classical realm for which sophisticated design automation tools have been developed in the previous decades.

The _[Munich Quantum Toolkit (MQT)](https://mqt.readthedocs.io)_ is a collection of software tools for quantum computing that explicitly utilizes this design automation expertise.
Our overarching objective is to provide solutions for design tasks across the entire quantum software stack.
This entails high-level support for end users in realizing their _applications_, efficient methods for the _classical simulation_, _compilation_, and _verification_ of quantum circuits, tools for _quantum error correction_, support for _physical design_, and more.
These methods are supported by corresponding _data structures_ (such as decision diagrams or the ZX-calculus) and _core methods_ (such as SAT encodings/solvers).
All of the developed tools are available as open-source implementations and are hosted on [github.com/munich-quantum-toolkit](https://github.com/munich-quantum-toolkit).

````{only} latex
```{note}
A live version of this document is available at [mqt.readthedocs.io](https://mqt.readthedocs.io).
```
````

```{raw} latex
\end{abstract}

\sphinxtableofcontents
```

```{only} html
For a comprehensive visual depiction of the MQT tools, we invite you to download our <a href="_static/flyers/mqt_flyer.pdf" title="Link to MQT flyer">MQT Flyer</a>.

<div style="float: right; margin-top:0em; margin-bottom:3em;">
    <a href="_static/flyers/mqt_flyer.pdf" title="Link to MQT flyer">
        <figure style="display: inline-block;">
            <img style="float: right;display: inline-block; max-height:12em; max-width:100%" src="_static/flyers/mqt_flyer.png" alt="MQT Overview Flyer"/>
            <figcaption style="text-align: center;">MQT Overview Flyer</figcaption>
        </figure>
    </a>
</div>
```

```{toctree}
:caption: The MQT Handbook

handbook/01_intro
handbook/02_simulation
handbook/03_compilation
handbook/04_verification
handbook/05_benchmarking
handbook/06_implementations
handbook/07_conclusions
handbook/references
```

```{only} html
## Contributors and Supporters

The _[Munich Quantum Toolkit (MQT)](https://mqt.readthedocs.io)_ is developed by the [Chair for Design Automation](https://www.cda.cit.tum.de/) at the [Technical University of Munich](https://www.tum.de/)
and supported by the [Munich Quantum Software Company (MQSC)](https://munichquantum.software).
Among others, it is part of the [Munich Quantum Software Stack (MQSS)](https://www.munich-quantum-valley.de/research/research-areas/mqss) ecosystem,
which is being developed as part of the [Munich Quantum Valley (MQV)](https://www.munich-quantum-valley.de) initiative.

<div style="margin-top: 0.5em">
<div class="only-light" align="center">
  <img src="_static/mqt-logo-banner-light.svg" width="90%" alt="MQT Banner">
</div>
<div class="only-dark" align="center">
  <img src="_static/mqt-logo-banner-dark.svg" width="90%" alt="MQT Banner">
</div>
</div>

Thank you to all the contributors who have helped make the MQT a reality!

The MQT will remain free, open-source, and permissively licensed—now and in the future.
We are firmly committed to keeping it open and actively maintained for the quantum computing community.

To support this endeavor, please consider:

- Starring and sharing our repositories: [https://github.com/munich-quantum-toolkit](https://github.com/munich-quantum-toolkit)
- Contributing code, documentation, tests, or examples via issues and pull requests
- Citing the MQT in your publications (see {doc}`References <handbook/references>`)
- Using the MQT in research and teaching, and sharing feedback and use cases
- Sponsoring us on GitHub: [https://github.com/sponsors/munich-quantum-toolkit](https://github.com/sponsors/munich-quantum-toolkit)

<p align="center">
<iframe src="https://github.com/sponsors/munich-quantum-toolkit/button" title="Sponsor munich-quantum-toolkit" height="32" width="114" style="border: 0; border-radius: 6px;"></iframe>
</p>
```

````{only} html
```{toctree}
:caption: Tool Overview and Statistics
:hidden:

overview
stats
```
````

```{toctree}
:hidden:
:caption: Tool Documentation

MQT Core <https://mqt.readthedocs.io/projects/core/en/latest>
MQT DDSIM <https://mqt.readthedocs.io/projects/ddsim/en/latest>
MQT QMAP <https://mqt.readthedocs.io/projects/qmap/en/latest>
MQT QCEC <https://mqt.readthedocs.io/projects/qcec/en/latest>
MQT QECC <https://mqt.readthedocs.io/projects/qecc/en/latest>
MQT Bench <https://mqt.readthedocs.io/projects/bench/en/latest>
MQT Predictor <https://mqt.readthedocs.io/projects/predictor/en/latest>
MQT Qudits <https://mqt.readthedocs.io/projects/qudits/en/latest>
MQT SyReC Synthesizer <https://mqt.readthedocs.io/projects/syrec/en/latest>
MQT YAQS <https://mqt.readthedocs.io/projects/yaqs/en/latest>
MQT Debugger <https://mqt.readthedocs.io/projects/debugger/en/latest>
MQT NAViz <https://mqt.readthedocs.io/projects/naviz/en/latest>
MQT ProblemSolver <https://mqt.readthedocs.io/projects/problemsolver/en/latest>
MQT IonShuttler <https://mqt.readthedocs.io/projects/ionshuttler/en/latest>
MQT QuSAT <https://mqt.readthedocs.io/projects/qusat/en/latest>
```

````{only} html
```{toctree}
:caption: Developers
:hidden:

support
```
````
