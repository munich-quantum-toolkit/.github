# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

"""SC26 compiler and QDMI walkthrough. Runs only on the local DDSIM simulator."""

import hashlib
import importlib.metadata
import json
from collections import Counter
from pathlib import Path

import numpy as np
from mqt.core.mlir import (
    CompilerTarget,
    OutputFormat,
    QCProgram,
    build_functionality,
    compile_program,
    sample,
    simulate,
    submit_program,
)
from mqt.core.qdmi import open_device

SOURCE = """OPENQASM 3.0;
include "stdgates.inc";
qubit a;
qubit b;
h a;
h a;
h a;
cx a, b;
"""

ROUTING_SOURCE = """OPENQASM 3.0;
include "stdgates.inc";
qubit[3] q;
bit[3] result;
h q[0];
cx q[0], q[1];
cx q[1], q[2];
cx q[0], q[2];
result = measure q;
"""

BELL_SOURCE = """OPENQASM 3.0;
include "stdgates.inc";
qubit[2] q;
h q[0];
cx q[0], q[1];
bit[2] result = measure q;
"""


def run():
    qc = QCProgram.from_openqasm_str(SOURCE)
    qco = qc.to_qco(copy=True)
    optimized = qco.copy()
    optimized.run_pass_pipeline("simplify-quantum")
    before, after = qc.num_gates(), optimized.num_gates()
    assert (before, after) == (4, 2)
    original_matrix = build_functionality(qco)
    optimized_matrix = build_functionality(optimized)
    np.testing.assert_allclose(original_matrix, optimized_matrix, atol=1e-12, rtol=0)
    np.testing.assert_allclose(simulate(optimized), np.array([1, 0, 0, 1]) / np.sqrt(2), atol=1e-12, rtol=0)

    native = CompilerTarget.NativeOperations([
        CompilerTarget.OperationCapability("rz", arity=1, num_parameters=1),
        CompilerTarget.OperationCapability("ry", arity=1, num_parameters=1),
        CompilerTarget.OperationCapability("cx", arity=2, num_parameters=0),
        CompilerTarget.OperationCapability("measure", arity=1, num_parameters=0),
    ])
    targets = {
        "Triangle": CompilerTarget(3, connectivity=CompilerTarget.Connectivity.all_to_all(), native_operations=native),
        "Line": CompilerTarget(3, connectivity=CompilerTarget.Connectivity([(0, 1), (1, 2)]), native_operations=native),
    }
    mapped = {}
    for name, target in targets.items():
        result = compile_program(ROUTING_SOURCE, target=target, output=OutputFormat.OPENQASM3)
        counts = sample(result, shots=4096, seed=17)
        assert set(counts) == {"000", "011"}
        assert sum(counts.values()) == 4096
        assert abs(counts["000"] / 4096 - 0.5) < 0.05
        circuit = QCProgram.from_openqasm_str(result.source).to_qiskit()
        mapped[name] = {"source": result.source, "gates": dict(circuit.count_ops()), "counts": counts}

    device = open_device("mqt.ddsim.default")
    compiled = compile_program(BELL_SOURCE, target=device)
    job = submit_program(compiled, target=device, num_shots=1024, custom1=17)
    assert job.wait()
    counts = job.get_counts()
    assert sum(counts.values()) == 1024
    assert set(counts) == {"00", "11"}
    assert abs(counts["00"] / 1024 - 0.5) < 0.05
    assert dict(Counter(job.get_shots())) == counts
    payload = compiled.payload
    payload_bytes = payload.encode() if isinstance(payload, str) else bytes(payload)
    return {
        "kind": "Local, noiseless DDSIM simulation; compilation targets are illustrative models",
        "versions": {name: importlib.metadata.version(name) for name in ("mqt-core", "qiskit", "numpy")},
        "seed": 17,
        "source": SOURCE,
        "qc": qc.ir,
        "qco": qco.ir,
        "optimized": optimized.ir,
        "before": before,
        "after": after,
        "matrix_max_error": float(np.max(np.abs(original_matrix - optimized_matrix))),
        "routing_source": ROUTING_SOURCE,
        "targets": mapped,
        "bell_source": BELL_SOURCE,
        "device": device.name(),
        "format": compiled.program_format.name,
        "status": job.check().name,
        "counts": counts,
        "shots": 1024,
        "payload_sha256": hashlib.sha256(payload_bytes).hexdigest(),
    }


if __name__ == "__main__":
    result = run()
    destination = Path(__file__).resolve().parents[1] / "captures" / "walkthrough.json"
    destination.write_text(json.dumps(result, indent=2) + "\n")
    print(destination)
