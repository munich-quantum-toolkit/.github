<p align="center">
  <a href="https://mqt.readthedocs.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/logo-mqt-dark.svg" width="60%">
      <img src="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/logo-mqt-light.svg" width="60%" alt="MQT Logo">
    </picture>
  </a>
</p>

# The Munich Quantum Toolkit (MQT)

Quantum computers are becoming a reality and numerous quantum computing applications with a near-term perspective (e.g., for finance, chemistry, machine learning, and optimization) and with a long-term perspective (e.g., for cryptography or unstructured search) are currently being investigated.
However, designing and realizing potential applications for these devices in a scalable fashion requires automated, efficient, and user-friendly software tools that cater to the needs of end users, engineers, and physicists at every level of the entire quantum software stack.
Many of the problems to be tackled in that regard are similar to design problems from the classical realm for which sophisticated design automation tools have been developed in the previous decades.

The _[Munich Quantum Toolkit (MQT)](https://mqt.readthedocs.io)_ is a collection of software tools for quantum computing that explicitly utilizes this design automation expertise.
Our overarching objective is to provide solutions for design tasks across the entire quantum software stack.
This entails high-level support for end users in realizing their _applications_, efficient methods for the _classical simulation_, _compilation_, and _verification_ of quantum circuits, tools for _quantum error correction_, support for _physical design_, and more.
These methods are supported by corresponding _data structures_ (such as decision diagrams or the ZX-calculus) and _core methods_ (such as SAT encodings/solvers).
All of the developed tools are available as open-source implementations and are hosted on [github.com/munich-quantum-toolkit](https://github.com/munich-quantum-toolkit).

<p align="center">
  <a href="https://mqt.readthedocs.io">
  <img width=50% src="https://img.shields.io/badge/%20the%20MQT%20Handbook%20@%20RtD-blue?style=for-the-badge&logo=read%20the%20docs" alt="Documentation" />
  </a>
</p>

## Contributors and Supporters

The _[Munich Quantum Toolkit (MQT)](https://mqt.readthedocs.io)_ is developed by the [Chair for Design Automation](https://www.cda.cit.tum.de/) at the [Technical University of Munich](https://www.tum.de/) and supported by the [Munich Quantum Software Company (MQSC)](https://munichquantum.software).
Among others, it is part of the [Munich Quantum Software Stack (MQSS)](https://www.munich-quantum-valley.de/research/research-areas/mqss) ecosystem, which is being developed as part of the [Munich Quantum Valley (MQV)](https://www.munich-quantum-valley.de) initiative.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/mqt-logo-banner-dark.svg" width="90%">
    <img src="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/mqt-logo-banner-light.svg" width="90%" alt="MQT Partner Logos">
  </picture>
</p>

Thank you to all the contributors who have helped make the MQT a reality!

The MQT will remain free, open-source, and permissively licensed—now and in the future.
We are firmly committed to keeping it open and actively maintained for the quantum computing community.

To support this endeavor, please consider:

- Starring and sharing our repositories: https://github.com/munich-quantum-toolkit
- Contributing code, documentation, tests, or examples via issues and pull requests
- Citing the MQT in your publications (see [Cite This](#cite-this))
- Citing our research in your publications (see [References](https://mqt.readthedocs.io/en/latest/handbook/references.html))
- Using the MQT in research and teaching, and sharing feedback and use cases
- Sponsoring us on GitHub: https://github.com/sponsors/munich-quantum-toolkit

<p align="center">
  <a href="https://github.com/sponsors/munich-quantum-toolkit">
  <img width=20% src="https://img.shields.io/badge/Sponsor-white?style=for-the-badge&logo=githubsponsors&labelColor=black&color=blue" alt="Sponsor the MQT" />
  </a>
</p>

## Cite This

If you want to cite the Munich Quantum Toolkit, please use the following BibTeX entry:

```bibtex
@inproceedings{mqt,
  title        = {The {{MQT}} Handbook: {{A}} Summary of Design Automation Tools and Software for Quantum Computing},
  shorttitle   = {{The MQT Handbook}},
  author       = {Wille, Robert and Berent, Lucas and Forster, Tobias and Kunasaikaran, Jagatheesan and Mato, Kevin and Peham, Tom and Quetschlich, Nils and Rovara, Damian and Sander, Aaron and Schmid, Ludwig and Schoenberger, Daniel and Stade, Yannick and Burgholzer, Lukas},
  year         = 2024,
  booktitle    = {IEEE International Conference on Quantum Software (QSW)},
  doi          = {10.1109/QSW62656.2024.00013},
  eprint       = {2405.17543},
  eprinttype   = {arxiv},
  addendum     = {A live version of this document is available at \url{https://mqt.readthedocs.io}}
}
```

<!-- SPHINX-START -->

## GitHub Information

| GitHub Project        |                    latest version |                           forks |                           stars |
| --------------------- | --------------------------------: | ------------------------------: | ------------------------------: |
| [`mqt-ddsim`]         |         ![gh.mqt.ddsim.release][] |         ![gh.mqt.ddsim.forks][] |         ![gh.mqt.ddsim.stars][] |
| [`mqt-qecc`]          |          ![gh.mqt.qecc.release][] |          ![gh.mqt.qecc.forks][] |          ![gh.mqt.qecc.stars][] |
| [`mqt-qmap`]          |          ![gh.mqt.qmap.release][] |          ![gh.mqt.qmap.forks][] |          ![gh.mqt.qmap.stars][] |
| [`mqt-qcec`]          |          ![gh.mqt.qcec.release][] |          ![gh.mqt.qcec.forks][] |          ![gh.mqt.qcec.stars][] |
| [`mqt-bench`]         |         ![gh.mqt.bench.release][] |         ![gh.mqt.bench.forks][] |         ![gh.mqt.bench.stars][] |
| [`mqt-core`]          |          ![gh.mqt.core.release][] |          ![gh.mqt.core.forks][] |          ![gh.mqt.core.stars][] |
| [`mqt-predictor`]     |     ![gh.mqt.predictor.release][] |     ![gh.mqt.predictor.forks][] |     ![gh.mqt.predictor.stars][] |
| [`mqt-problemsolver`] | ![gh.mqt.problemsolver.release][] | ![gh.mqt.problemsolver.forks][] | ![gh.mqt.problemsolver.stars][] |
| [`mqt-syrec`]         |         ![gh.mqt.syrec.release][] |         ![gh.mqt.syrec.forks][] |         ![gh.mqt.syrec.stars][] |
| [`mqt-ddvis`]         |         ![gh.mqt.ddvis.release][] |         ![gh.mqt.ddvis.forks][] |         ![gh.mqt.ddvis.stars][] |
| [`mqt-qao`]           |           ![gh.mqt.qao.release][] |           ![gh.mqt.qao.forks][] |           ![gh.mqt.qao.stars][] |
| [`mqt-qudits`]        |        ![gh.mqt.qudits.release][] |        ![gh.mqt.qudits.forks][] |        ![gh.mqt.qudits.stars][] |
| [`mqt-qubomaker`]     |     ![gh.mqt.qubomaker.release][] |     ![gh.mqt.qubomaker.forks][] |     ![gh.mqt.qubomaker.stars][] |
| [`mqt-qusat`]         |         ![gh.mqt.qusat.release][] |         ![gh.mqt.qusat.forks][] |         ![gh.mqt.qusat.stars][] |
| [`mqt-debugger`]      |      ![gh.mqt.debugger.release][] |      ![gh.mqt.debugger.forks][] |      ![gh.mqt.debugger.stars][] |
| [`mqt-yaqs`]          |          ![gh.mqt.yaqs.release][] |          ![gh.mqt.yaqs.forks][] |          ![gh.mqt.yaqs.stars][] |
| [`mqt-workflows`]     |     ![gh.mqt.workflows.release][] |     ![gh.mqt.workflows.forks][] |     ![gh.mqt.workflows.stars][] |
| [`mqt-ionshuttler`]   |                                   |   ![gh.mqt.ionshuttler.forks][] |   ![gh.mqt.ionshuttler.stars][] |

[`mqt-ddsim`]: https://github.com/munich-quantum-toolkit/ddsim
[`mqt-qcec`]: https://github.com/munich-quantum-toolkit/qcec
[`mqt-qmap`]: https://github.com/munich-quantum-toolkit/qmap
[`mqt-qecc`]: https://github.com/munich-quantum-toolkit/qecc
[`mqt-bench`]: https://github.com/munich-quantum-toolkit/bench
[`mqt-predictor`]: https://github.com/munich-quantum-toolkit/predictor
[`mqt-core`]: https://github.com/munich-quantum-toolkit/core
[`mqt-problemsolver`]: https://github.com/munich-quantum-toolkit/problemsolver
[`mqt-syrec`]: https://github.com/munich-quantum-toolkit/syrec
[`mqt-ddvis`]: https://github.com/munich-quantum-toolkit/ddvis
[`mqt-qusat`]: https://github.com/munich-quantum-toolkit/qusat
[`mqt-dasqa`]: https://github.com/munich-quantum-toolkit/dasqa
[`mqt-ionshuttler`]: https://github.com/munich-quantum-toolkit/ionshuttler
[`mqt-qubomaker`]: https://github.com/munich-quantum-toolkit/qubomaker
[`mqt-qudits`]: https://github.com/munich-quantum-toolkit/qudits
[`mqt-yaqs`]: https://github.com/munich-quantum-toolkit/yaqs
[`mqt-debugger`]: https://github.com/munich-quantum-toolkit/debugger
[`mqt-workflows`]: https://github.com/munich-quantum-toolkit/workflows
[`mqt-qao`]: https://github.com/munich-quantum-toolkit/qao
[gh.mqt.ddsim.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/ddsim?label=%20&style=flat-square
[gh.mqt.ddsim.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/ddsim?label=%20&style=flat-square
[gh.mqt.ddsim.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/ddsim?label=%20&style=flat-square
[gh.mqt.qmap.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/qmap?label=%20&style=flat-square
[gh.mqt.qmap.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/qmap?label=%20&style=flat-square
[gh.mqt.qmap.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/qmap?label=%20&style=flat-square
[gh.mqt.qcec.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/qcec?label=%20&style=flat-square
[gh.mqt.qcec.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/qcec?label=%20&style=flat-square
[gh.mqt.qcec.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/qcec?label=%20&style=flat-square
[gh.mqt.core.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/core?label=%20&style=flat-square
[gh.mqt.core.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/core?label=%20&style=flat-square
[gh.mqt.core.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/core?label=%20&style=flat-square
[gh.mqt.bench.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/bench?label=%20&style=flat-square
[gh.mqt.bench.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/bench?label=%20&style=flat-square
[gh.mqt.bench.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/bench?label=%20&style=flat-square
[gh.mqt.predictor.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/predictor?label=%20&style=flat-square
[gh.mqt.predictor.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/predictor?label=%20&style=flat-square
[gh.mqt.predictor.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/predictor?label=%20&style=flat-square
[gh.mqt.qecc.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/qecc?label=%20&style=flat-square
[gh.mqt.qecc.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/qecc?label=%20&style=flat-square
[gh.mqt.qecc.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/qecc?label=%20&style=flat-square
[gh.mqt.syrec.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/syrec?label=%20&style=flat-square
[gh.mqt.syrec.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/syrec?label=%20&style=flat-square
[gh.mqt.syrec.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/syrec?label=%20&style=flat-square
[gh.mqt.ddvis.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/ddvis?label=%20&style=flat-square
[gh.mqt.ddvis.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/ddvis?label=%20&style=flat-square
[gh.mqt.ddvis.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/ddvis?label=%20&style=flat-square
[gh.mqt.problemsolver.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/problemsolver?label=%20&style=flat-square
[gh.mqt.problemsolver.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/problemsolver?label=%20&style=flat-square
[gh.mqt.problemsolver.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/problemsolver?label=%20&style=flat-square
[gh.mqt.qusat.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/qusat?label=%20&style=flat-square
[gh.mqt.qusat.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/qusat?label=%20&style=flat-square
[gh.mqt.qusat.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/qusat?label=%20&style=flat-square
[gh.mqt.ionshuttler.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/ionshuttler?label=%20&style=flat-square
[gh.mqt.ionshuttler.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/ionshuttler?label=%20&style=flat-square
[gh.mqt.ionshuttler.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/ionshuttler?label=%20&style=flat-square
[gh.mqt.qudits.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/qudits?label=%20&style=flat-square
[gh.mqt.qudits.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/qudits?label=%20&style=flat-square
[gh.mqt.qudits.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/qudits?label=%20&style=flat-square
[gh.mqt.yaqs.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/yaqs?label=%20&style=flat-square
[gh.mqt.yaqs.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/yaqs?label=%20&style=flat-square
[gh.mqt.yaqs.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/yaqs?label=%20&style=flat-square
[gh.mqt.debugger.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/debugger?label=%20&style=flat-square
[gh.mqt.debugger.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/debugger?label=%20&style=flat-square
[gh.mqt.debugger.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/debugger?label=%20&style=flat-square
[gh.mqt.workflows.release]: https://img.shields.io/github/v/release/munich-quantum-toolkit/workflows?label=%20&style=flat-square
[gh.mqt.workflows.forks]: https://img.shields.io/github/forks/munich-quantum-toolkit/workflows?label=%20&style=flat-square
[gh.mqt.workflows.stars]: https://img.shields.io/github/stars/munich-quantum-toolkit/workflows?label=%20&style=flat-square

## PyPI Downloads

| Projekt                                             |                      latest version |                             weekly |                             monthly |                                                                          total |
| --------------------------------------------------- | ----------------------------------: | ---------------------------------: | ----------------------------------: | -----------------------------------------------------------------------------: |
| [`mqt.qcec`][pypi.mqt.qcec.stats]                   |          ![pypi.mqt.qcec.version][] |          ![pypi.mqt.qcec.weekly][] |          ![pypi.mqt.qcec.monthly][] |                   [![pypi.mqt.qcec.total]](https://pepy.tech/project/mqt.qcec) |
| [`mqt.qmap`][pypi.mqt.qmap.stats]                   |          ![pypi.mqt.qmap.version][] |          ![pypi.mqt.qmap.weekly][] |          ![pypi.mqt.qmap.monthly][] |                   [![pypi.mqt.qmap.total]](https://pepy.tech/project/mqt.qmap) |
| [`mqt.ddsim`][pypi.mqt.ddsim.stats]                 |         ![pypi.mqt.ddsim.version][] |         ![pypi.mqt.ddsim.weekly][] |         ![pypi.mqt.ddsim.monthly][] |                 [![pypi.mqt.ddsim.total]](https://pepy.tech/project/mqt.ddsim) |
| [`mqt.core`][pypi.mqt.core.stats]                   |          ![pypi.mqt.core.version][] |          ![pypi.mqt.core.weekly][] |          ![pypi.mqt.core.monthly][] |                   [![pypi.mqt.core.total]](https://pepy.tech/project/mqt.core) |
| [`mqt.qecc`][pypi.mqt.qecc.stats]                   |          ![pypi.mqt.qecc.version][] |          ![pypi.mqt.qecc.weekly][] |          ![pypi.mqt.qecc.monthly][] |                   [![pypi.mqt.qecc.total]](https://pepy.tech/project/mqt.qecc) |
| [`mqt.syrec`][pypi.mqt.syrec.stats]                 |         ![pypi.mqt.syrec.version][] |         ![pypi.mqt.syrec.weekly][] |         ![pypi.mqt.syrec.monthly][] |                 [![pypi.mqt.syrec.total]](https://pepy.tech/project/mqt.syrec) |
| [`mqt.qusat`][pypi.mqt.qusat.stats]                 |         ![pypi.mqt.qusat.version][] |         ![pypi.mqt.qusat.weekly][] |         ![pypi.mqt.qusat.monthly][] |                 [![pypi.mqt.qusat.total]](https://pepy.tech/project/mqt.qusat) |
| [`mqt.bench`][pypi.mqt.bench.stats]                 |         ![pypi.mqt.bench.version][] |         ![pypi.mqt.bench.weekly][] |         ![pypi.mqt.bench.monthly][] |                 [![pypi.mqt.bench.total]](https://pepy.tech/project/mqt.bench) |
| [`mqt.qudits`][pypi.mqt.qudits.stats]               |        ![pypi.mqt.qudits.version][] |        ![pypi.mqt.qudits.weekly][] |        ![pypi.mqt.qudits.monthly][] |               [![pypi.mqt.qudits.total]](https://pepy.tech/project/mqt.qudits) |
| [`mqt.debugger`][pypi.mqt.debugger.stats]           |      ![pypi.mqt.debugger.version][] |      ![pypi.mqt.debugger.weekly][] |      ![pypi.mqt.debugger.monthly][] |           [![pypi.mqt.debugger.total]](https://pepy.tech/project/mqt.debugger) |
| [`mqt.predictor`][pypi.mqt.predictor.stats]         |     ![pypi.mqt.predictor.version][] |     ![pypi.mqt.predictor.weekly][] |     ![pypi.mqt.predictor.monthly][] |         [![pypi.mqt.predictor.total]](https://pepy.tech/project/mqt.predictor) |
| [`mqt.problemsolver`][pypi.mqt.problemsolver.stats] | ![pypi.mqt.problemsolver.version][] | ![pypi.mqt.problemsolver.weekly][] | ![pypi.mqt.problemsolver.monthly][] | [![pypi.mqt.problemsolver.total]](https://pepy.tech/project/mqt.problemsolver) |
| [`mqt.yaqs`][pypi.mqt.yaqs.stats]                   |          ![pypi.mqt.yaqs.version][] |          ![pypi.mqt.yaqs.weekly][] |          ![pypi.mqt.yaqs.monthly][] |                   [![pypi.mqt.yaqs.total]](https://pepy.tech/project/mqt.yaqs) |

[pypi.mqt.ddsim.stats]: https://pypistats.org/packages/mqt-ddsim
[pypi.mqt.ddsim.version]: https://img.shields.io/pypi/v/mqt.ddsim?label=%20&style=flat-square
[pypi.mqt.ddsim.weekly]: https://img.shields.io/pypi/dw/mqt.ddsim?label=%20&style=flat-square
[pypi.mqt.ddsim.monthly]: https://img.shields.io/pypi/dm/mqt.ddsim?label=%20&style=flat-square
[pypi.mqt.ddsim.total]: https://static.pepy.tech/personalized-badge/mqt-ddsim?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.qmap.stats]: https://pypistats.org/packages/mqt-qmap
[pypi.mqt.qmap.version]: https://img.shields.io/pypi/v/mqt.qmap?label=%20&style=flat-square
[pypi.mqt.qmap.weekly]: https://img.shields.io/pypi/dw/mqt.qmap?label=%20&style=flat-square
[pypi.mqt.qmap.monthly]: https://img.shields.io/pypi/dm/mqt.qmap?label=%20&style=flat-square
[pypi.mqt.qmap.total]: https://static.pepy.tech/personalized-badge/mqt-qmap?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.qcec.stats]: https://pypistats.org/packages/mqt-qcec
[pypi.mqt.qcec.version]: https://img.shields.io/pypi/v/mqt.qcec?label=%20&style=flat-square
[pypi.mqt.qcec.weekly]: https://img.shields.io/pypi/dw/mqt.qcec?label=%20&style=flat-square
[pypi.mqt.qcec.monthly]: https://img.shields.io/pypi/dm/mqt.qcec?label=%20&style=flat-square
[pypi.mqt.qcec.total]: https://static.pepy.tech/personalized-badge/mqt-qcec?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.core.stats]: https://pypistats.org/packages/mqt-core
[pypi.mqt.core.version]: https://img.shields.io/pypi/v/mqt.core?label=%20&style=flat-square
[pypi.mqt.core.weekly]: https://img.shields.io/pypi/dw/mqt.core?label=%20&style=flat-square
[pypi.mqt.core.monthly]: https://img.shields.io/pypi/dm/mqt.core?label=%20&style=flat-square
[pypi.mqt.core.total]: https://static.pepy.tech/personalized-badge/mqt-core?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.qecc.stats]: https://pypistats.org/packages/mqt-qecc
[pypi.mqt.qecc.version]: https://img.shields.io/pypi/v/mqt.qecc?label=%20&style=flat-square
[pypi.mqt.qecc.weekly]: https://img.shields.io/pypi/dw/mqt.qecc?label=%20&style=flat-square
[pypi.mqt.qecc.monthly]: https://img.shields.io/pypi/dm/mqt.qecc?label=%20&style=flat-square
[pypi.mqt.qecc.total]: https://static.pepy.tech/personalized-badge/mqt-qecc?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.bench.stats]: https://pypistats.org/packages/mqt-bench
[pypi.mqt.bench.version]: https://img.shields.io/pypi/v/mqt.bench?label=%20&style=flat-square
[pypi.mqt.bench.weekly]: https://img.shields.io/pypi/dw/mqt.bench?label=%20&style=flat-square
[pypi.mqt.bench.monthly]: https://img.shields.io/pypi/dm/mqt.bench?label=%20&style=flat-square
[pypi.mqt.bench.total]: https://static.pepy.tech/personalized-badge/mqt-bench?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.predictor.stats]: https://pypistats.org/packages/mqt-predictor
[pypi.mqt.predictor.version]: https://img.shields.io/pypi/v/mqt.predictor?label=%20&style=flat-square
[pypi.mqt.predictor.weekly]: https://img.shields.io/pypi/dw/mqt.predictor?label=%20&style=flat-square
[pypi.mqt.predictor.monthly]: https://img.shields.io/pypi/dm/mqt.predictor?label=%20&style=flat-square
[pypi.mqt.predictor.total]: https://static.pepy.tech/personalized-badge/mqt-predictor?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.problemsolver.stats]: https://pypistats.org/packages/mqt-problemsolver
[pypi.mqt.problemsolver.version]: https://img.shields.io/pypi/v/mqt.problemsolver?label=%20&style=flat-square
[pypi.mqt.problemsolver.weekly]: https://img.shields.io/pypi/dw/mqt.problemsolver?label=%20&style=flat-square
[pypi.mqt.problemsolver.monthly]: https://img.shields.io/pypi/dm/mqt.problemsolver?label=%20&style=flat-square
[pypi.mqt.problemsolver.total]: https://static.pepy.tech/personalized-badge/mqt-problemsolver?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.syrec.stats]: https://pypistats.org/packages/mqt-syrec
[pypi.mqt.syrec.version]: https://img.shields.io/pypi/v/mqt.syrec?label=%20&style=flat-square
[pypi.mqt.syrec.weekly]: https://img.shields.io/pypi/dw/mqt.syrec?label=%20&style=flat-square
[pypi.mqt.syrec.monthly]: https://img.shields.io/pypi/dm/mqt.syrec?label=%20&style=flat-square
[pypi.mqt.syrec.total]: https://static.pepy.tech/personalized-badge/mqt-syrec?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.qusat.stats]: https://pypistats.org/packages/mqt-qusat
[pypi.mqt.qusat.version]: https://img.shields.io/pypi/v/mqt.qusat?label=%20&style=flat-square
[pypi.mqt.qusat.weekly]: https://img.shields.io/pypi/dw/mqt.qusat?label=%20&style=flat-square
[pypi.mqt.qusat.monthly]: https://img.shields.io/pypi/dm/mqt.qusat?label=%20&style=flat-square
[pypi.mqt.qusat.total]: https://static.pepy.tech/personalized-badge/mqt-qusat?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.qudits.stats]: https://pypistats.org/packages/mqt-qudits
[pypi.mqt.qudits.version]: https://img.shields.io/pypi/v/mqt.qudits?label=%20&style=flat-square
[pypi.mqt.qudits.weekly]: https://img.shields.io/pypi/dw/mqt.qudits?label=%20&style=flat-square
[pypi.mqt.qudits.monthly]: https://img.shields.io/pypi/dm/mqt.qudits?label=%20&style=flat-square
[pypi.mqt.qudits.total]: https://static.pepy.tech/personalized-badge/mqt-qudits?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.yaqs.stats]: https://pypistats.org/packages/mqt-yaqs
[pypi.mqt.yaqs.version]: https://img.shields.io/pypi/v/mqt.yaqs?label=%20&style=flat-square
[pypi.mqt.yaqs.weekly]: https://img.shields.io/pypi/dw/mqt.yaqs?label=%20&style=flat-square
[pypi.mqt.yaqs.monthly]: https://img.shields.io/pypi/dm/mqt.yaqs?label=%20&style=flat-square
[pypi.mqt.yaqs.total]: https://static.pepy.tech/personalized-badge/mqt-yaqs?period=total&units=international_system&left_color=orange&right_color=orange&left_text=
[pypi.mqt.debugger.stats]: https://pypistats.org/packages/mqt-debugger
[pypi.mqt.debugger.version]: https://img.shields.io/pypi/v/mqt-debugger?label=%20&style=flat-square
[pypi.mqt.debugger.weekly]: https://img.shields.io/pypi/dw/mqt-debugger?label=%20&style=flat-square
[pypi.mqt.debugger.monthly]: https://img.shields.io/pypi/dm/mqt-debugger?label=%20&style=flat-square
[pypi.mqt.debugger.total]: https://static.pepy.tech/personalized-badge/mqt-debugger?period=total&units=international_system&left_color=orange&right_color=orange&left_text=

<!-- SPHINX-END -->

---

## Acknowledgements

The Munich Quantum Toolkit has been supported by the European Research Council (ERC) under the European Union's Horizon 2020 research and innovation program (grant agreement No. 101001318), the Bavarian State Ministry for Science and Arts through the Distinguished Professorship Program, as well as the Munich Quantum Valley, which is supported by the Bavarian state government with funds from the Hightech Agenda Bayern Plus.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/mqt-funding-footer-dark.svg" width="90%">
    <img src="https://raw.githubusercontent.com/munich-quantum-toolkit/.github/refs/heads/main/docs/_static/mqt-funding-footer-light.svg" width="90%" alt="MQT Funding Footer">
  </picture>
</p>
