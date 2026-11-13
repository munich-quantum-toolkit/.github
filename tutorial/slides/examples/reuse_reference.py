# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

"""Copy the reference renderers, styles and animation engine without rewriting them.

Run after building the IQM paper, openQSE DOE and MQSF decks in the reference checkout.
Only retained evidence and assets used by this tutorial are included.
"""

import argparse
import base64
import gzip
import hashlib
import json
import subprocess
from pathlib import Path

REVISION = "aa951e888c8e2fc36ebabc893dddd02cfd4ed90b"
ROOT = Path(__file__).resolve().parents[1]
STYLES = [
    "shared/presentation.css",
    "shared/opening.css",
    "presentations/2026-11_sc26_qdmi_on_iqm/sc26.css",
    "presentations/2026-11_sc26_aws_booth/booth.css",
    "presentations/2026-11_sc26_openqse_doe/talks.css",
]
SCRIPTS = [
    "shared/visuals.js",
    "shared/circuit.js",
    "shared/motion.js",
    "shared/opening.js",
    "presentations/2026-11_sc26_qdmi_on_iqm/sc26.js",
    "presentations/2026-11_sc26_iqm_paper/deck.js",
    "presentations/2026-11_sc26_openqse_doe/talks.js",
    "presentations/2026-11_sc26_openqse_doe/deck.js",
    "presentations/2026-11_sc26_qdmi_on_iqm/presentation.js",
]
MQSF_SCRIPT = "presentations/2026-10_mqsf_system_software_for_quantum/presentation.js"
MQSF_ASSETS = "eq-grover-iterations qr-unrolling oxford quantinuum ubc xanadu unitary".split()
ASSETS = "aws qr-afqmc-paper qr-afqmc qr-braket qr-core-repo qr-ibm qr-iqm qr-mqss qr-orchestrator qr-pasqal qr-qdmi-repo braket c ibm ionq iqm jeff llvm lrz-mark mlir mqsc mqss mqt mqv orchestrator pasqal pennylane qdmi qir qiskit slurm tum tum-mark principle-community principle-open principle-performance principle-practice principle-unlocked".split()


def embedded(html, name):
    start = html.index(f"window.{name}=") + len(f"window.{name}=")
    return json.JSONDecoder().raw_decode(html[start:])[0]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("checkout", type=Path)
    checkout = parser.parse_args().checkout
    assert subprocess.check_output(["git", "-C", str(checkout), "rev-parse", "HEAD"], text=True).strip() == REVISION
    dest = ROOT / "reference"
    manifest = {"revision": REVISION, "styles": STYLES, "scripts": SCRIPTS, "mqsf_script": MQSF_SCRIPT, "sha256": {}}
    for name in STYLES + SCRIPTS + [MQSF_SCRIPT]:
        data = (checkout / name).read_bytes()
        target = dest / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        manifest["sha256"][name] = hashlib.sha256(data).hexdigest()
    iqm_html = (checkout / "build/2026-11_sc26_iqm_paper/index.html").read_text()
    doe_html = (checkout / "build/2026-11_sc26_openqse_doe/index.html").read_text()
    iqm = embedded(iqm_html, "MQSF_DATA")
    doe = embedded(doe_html, "MQSF_DATA")
    data = {"targets": doe["targets"], "presentation": iqm["presentation"]}
    (dest / "data.json").write_text(json.dumps(data, indent=2) + "\n")
    manifest["sha256"]["data.json"] = hashlib.sha256((dest / "data.json").read_bytes()).hexdigest()
    # Keep the accepted measurement/propagation replay together, without recapturing it.
    afqmc = gzip.compress(json.dumps(iqm["application"], separators=(",", ":")).encode(), mtime=0)
    (dest / "afqmc.json.gz").write_bytes(afqmc)
    manifest["sha256"]["afqmc.json.gz"] = hashlib.sha256(afqmc).hexdigest()
    mqsf_html = (checkout / "build/2026-10_mqsf_system_software_for_quantum/index.html").read_text()
    mqsf = embedded(mqsf_html, "MQSF_DATA")
    structured = {
        "scenarios": [s for s in mqsf["scenarios"] if s["id"] in {"parity", "qpe"}],
        "compiler_evidence": {"grover_size": mqsf["compiler_evidence"]["grover_size"]},
    }
    packed = gzip.compress(json.dumps(structured, separators=(",", ":")).encode(), mtime=0)
    (dest / "structured.json.gz").write_bytes(packed)
    manifest["sha256"]["structured.json.gz"] = hashlib.sha256(packed).hexdigest()
    assets = embedded(iqm_html, "MQSF_ASSETS")
    mqsf_assets = embedded(mqsf_html, "MQSF_ASSETS")
    for name in ("mqt", "jeff", "tum-mark", "mqsc", "qdmi", "llvm"):
        assert assets[name] == mqsf_assets[name], name
    assets.update({name: mqsf_assets[name] for name in MQSF_ASSETS})
    manifest["assets"] = {}
    manifest["asset_sha256"] = {}
    for name in ASSETS + MQSF_ASSETS:
        image = base64.b64decode(assets[name].split(",", 1)[1])
        filename = "pr-" + name + ".svg"
        (ROOT / "assets" / filename).write_bytes(image)
        manifest["assets"][name] = filename
        manifest["asset_sha256"][filename] = hashlib.sha256(image).hexdigest()
    (dest / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Copied {len(STYLES) + len(SCRIPTS) + 1} source files unchanged")


if __name__ == "__main__":
    main()
