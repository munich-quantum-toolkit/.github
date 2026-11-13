# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# SPDX-License-Identifier: MIT

"""Recapture the teaching examples locally into ignored build output."""

import hashlib
import json
import random
import re
import sys
from collections import Counter
from importlib.metadata import version
from pathlib import Path

import numpy as np
from mqt.core.mlir import QCProgram, QCOProgram, build_functionality
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector


def compact(ir, dialect):
    """Shorten SSA names and alias the qubit type without changing operations."""
    body = ir.split("attributes {mqt.entry_point} {\n", 1)[1].rsplit("  }", 1)[0]
    names = {
        "qc": {"%q": "%a", "%q_0": "%b", "%q_1": "%t"},
        "qco": {
            "%q": "%a",
            "%q_0": "%b",
            "%q_1": "%a1",
            "%q_2": "%a2",
            "%q_3": "%a3",
            "%q_4": "%t",
            "%q_5": "%x",
            "%controls_out": "%c",
            "%targets_out": "%d",
        },
    }[dialect]
    if dialect == "qco" and body.count("qco.h") == 1:
        names.update({"%q_2": "%t", "%q_3": "%x"})
    body = re.sub(r"%[\w]+", lambda match: names.get(match[0], match[0]), body)
    body = body.replace("!" + dialect + ".qubit", "!q")
    body = "\n".join(
        ("    " if line.startswith("      ") else "  ") + line.strip() for line in body.strip().splitlines()
    ).replace(" targets ", "\n    targets ")
    return f"!q = !{dialect}.qubit\nfunc.func @main()\n    attributes {{mqt.entry_point}} {{\n{body}\n}}"


def main():
    root = Path(__file__).resolve().parents[1]
    output = root / "build/teaching-captures"
    output.mkdir(parents=True, exist_ok=True)
    old = json.loads((root / "captures/walkthrough.json").read_text())
    circuit = QuantumCircuit(2)
    circuit.h(0)
    circuit.cx(0, 1)
    state = Statevector.from_instruction(circuit)
    state.seed(3)
    shots = state.sample_memory(1024).tolist()
    assert shots[:3] == ["00", "00", "11"]
    sampling = {
        "kind": "Ordered local Qiskit statevector samples; animation timing is illustrative",
        "versions": {"python": sys.version.split()[0], "qiskit": version("qiskit"), "mqt-core": version("mqt-core")},
        "seed": 3,
        "shots": shots,
        "counts": dict(Counter(shots)),
    }
    # QDMI shot order is unspecified. Arrange the retained counts for the teaching replay.
    first_shots = ["00", "00", "11"]
    remaining = [outcome for outcome, count in old["counts"].items() for _ in range(count - first_shots.count(outcome))]
    random.Random(17).shuffle(remaining)
    replay = {
        "kind": "Presentation replay of retained DDSIM Bell counts; shot order and animation timing are illustrative",
        "source_capture_sha256": hashlib.sha256((root / "captures/walkthrough.json").read_bytes()).hexdigest(),
        "source": old["bell_source"],
        "device": old["device"],
        "seed": old["seed"],
        "shots": first_shots + remaining,
        "counts": old["counts"],
    }
    assert len(replay["shots"]) == old["shots"]
    assert dict(Counter(replay["shots"])) == old["counts"]
    qc = compact(old["qc"], "qc")
    qco = compact(old["qco"], "qco")
    optimized = compact(old["optimized"], "qco")
    for source, cls in ((qc, QCProgram), (qco, QCOProgram), (optimized, QCOProgram)):
        program = cls.from_mlir_str(source)
        np.testing.assert_allclose(build_functionality(program), build_functionality(old["source"]), atol=1e-12, rtol=0)
    transformed = QCOProgram.from_mlir_str(qco).copy()
    transformed.run_pass_pipeline("simplify-quantum")
    np.testing.assert_allclose(
        build_functionality(transformed), build_functionality(QCOProgram.from_mlir_str(optimized)), atol=1e-12, rtol=0
    )
    representations = {
        "source": old["source"].strip(),
        "qc": qc,
        "qco": qco,
        "optimized": optimized,
        "formatting": "Function body from retained MQT Core 4.2 capture, shorter SSA names and a type alias; parsed and full matrices compared",
        "source_capture_sha256": hashlib.sha256((root / "captures/walkthrough.json").read_bytes()).hexdigest(),
    }
    for name, data in (("sampling", sampling), ("bell-replay", replay), ("representations", representations)):
        (output / f"{name}.json").write_text(json.dumps(data, indent=2) + "\n")
    print(output)


if __name__ == "__main__":
    main()
