# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# SPDX-License-Identifier: MIT

"""Build the offline SC26 HTML with the locked presentations authoring environment."""

import base64
import gzip
import hashlib
from html import unescape
import json
import re
import shutil
from pathlib import Path

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name


def build():
    root = Path(__file__).resolve().parent
    reference_root = root / "reference"
    manifest = json.loads((reference_root / "manifest.json").read_text())
    for name, digest in manifest["sha256"].items():
        assert hashlib.sha256((reference_root / name).read_bytes()).hexdigest() == digest, name
    for name, digest in manifest["asset_sha256"].items():
        assert hashlib.sha256((root / "assets" / name).read_bytes()).hexdigest() == digest, name
    assets = {}
    for path in sorted((root / "assets").iterdir()):
        if path.suffix in {".svg", ".png"}:
            mime = "image/svg+xml" if path.suffix == ".svg" else "image/png"
            assets[path.stem] = f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()
    font = base64.b64encode((root / "assets/inter-latin.woff2").read_bytes()).decode()
    css = (
        "@font-face{font-family:Inter;src:url(data:font/woff2;base64,"
        + font
        + ") format('woff2');font-weight:100 900;font-display:block;}\n"
    )
    code_font = base64.b64encode((root / "assets/FiraCode-VF.woff2").read_bytes()).decode()
    css += (
        "@font-face{font-family:'Fira Code';src:url(data:font/woff2;base64,"
        + code_font
        + ") format('woff2');font-weight:300 700;font-display:block;}\n"
    )
    css += "\n".join((reference_root / name).read_text() for name in manifest["styles"])
    formatter = HtmlFormatter(nowrap=True, style="friendly")
    css += "\n" + formatter.get_style_defs(".highlight")
    css += "\n" + (root / "presentation.css").read_text()
    css += '\n#deck:has(.notebook-dark) #mqsc-logo {content:url("' + assets["mqsc-white"] + '");filter:none;}'
    css += '\n#deck:has(.notebook-dark) #mqv-logo {content:url("' + assets["mqv-header-white"] + '");filter:none;}'
    katex = root / "vendor/katex"
    math_css = re.sub(
        r"src:url\(fonts/([^()]+\.woff2)\)[^}]*",
        lambda match: (
            "src:url(data:font/woff2;base64,"
            + base64.b64encode((katex / "fonts" / match[1]).read_bytes()).decode()
            + ") format('woff2')"
        ),
        (katex / "katex.min.css").read_text(),
    )
    assert "url(fonts/" not in math_css
    css = math_css + "\n" + css
    capture = json.loads((root / "captures/walkthrough.json").read_text())
    assert capture["before"] == 4
    assert capture["after"] == 2
    assert sum(capture["counts"].values()) == capture["shots"]
    sampling = json.loads((root / "captures/bell-replay.json").read_text())
    representations = json.loads((root / "captures/representations.json").read_text())
    assert (
        sampling["source_capture_sha256"]
        == hashlib.sha256((root / "captures/walkthrough.json").read_bytes()).hexdigest()
    )
    assert sampling["counts"] == capture["counts"]
    assert len(sampling["shots"]) == capture["shots"]
    assert sampling["shots"][:3] == ["00", "00", "11"]
    assert set(sampling["shots"]) == {"00", "11"}
    assert sampling["counts"] == {outcome: sampling["shots"].count(outcome) for outcome in ("00", "11")}
    assert (
        representations["source_capture_sha256"]
        == hashlib.sha256((root / "captures/walkthrough.json").read_bytes()).hexdigest()
    )
    snippets = json.loads((root / "snippets.json").read_text())
    for key in ("source", "qc", "qco", "optimized"):
        snippets[key] = {"language": "openqasm3" if key == "source" else "mlir", "source": representations[key]}
    for item in snippets.values():
        lexer = get_lexer_by_name(item["language"], stripnl=False, ensurenl=False)
        item["html"] = highlight(item["source"], lexer, formatter).rstrip("\n")
        assert unescape(re.sub(r"<[^>]+>", "", item["html"])) == item["source"].rstrip("\n")
    reference = json.loads((reference_root / "data.json").read_text())
    reference["application"] = json.loads(gzip.decompress((reference_root / "afqmc.json.gz").read_bytes()))
    reference.update(json.loads(gzip.decompress((reference_root / "structured.json.gz").read_bytes())))
    # Keep capture commands and recorder paths in the evidence, outside the audience HTML.
    for target in reference["targets"]:
        target.pop("provenance", None)
    reference_assets = {name: assets[Path(filename).stem] for name, filename in manifest["assets"].items()}
    reference_assets.update(tum=assets["tum"])
    scripts = []
    for name in manifest["scripts"]:
        if name == "presentations/2026-11_sc26_openqse_doe/deck.js":
            # Retain each source deck's own registration and target sequence.
            scripts.append("window.SC26_IQM_DECK = window.MQSC_AWS_BOOTH;")
        scripts.append((reference_root / name).read_text())
        if name == "presentations/2026-11_sc26_openqse_doe/deck.js":
            scripts.append((reference_root / "presentations/2026-11_sc26_openqse_doe/talks.js").read_text())
    # Retain MQSF renderers and registrations verbatim, using the tutorial's navigation shell.
    mqsf_source = (reference_root / manifest["mqsf_script"]).read_text()
    boundary = "  function resize() {"
    assert mqsf_source.count(boundary) == 1
    mqsf_renderers = mqsf_source.split(boundary)[0] + "window.SC26_MQSF_SLIDES = slides;\n})();"
    scripts.insert(-1, mqsf_renderers)
    scripts.insert(-1, (root / "slides.js").read_text())
    html = (root / "index.html").read_text()
    replacements = {
        "<!-- STYLES -->": f"<style>{css}</style>",
        "<!-- DATA -->": "<script>const ASSETS="
        + json.dumps(assets)
        + ";const SAMPLING="
        + json.dumps(sampling).replace("<", "\\u003c")
        + ";const SNIPPETS="
        + json.dumps(snippets).replace("<", "\\u003c")
        + ";window.MQSF_DATA="
        + json.dumps(reference).replace("<", "\\u003c")
        + ";window.MQSF_ASSETS="
        + json.dumps(reference_assets)
        + ";</script>",
        "<!-- SCRIPT -->": "<script>\n"
        + (katex / "katex.min.js").read_text()
        + "\n</script><script>\n"
        + "\n".join(scripts)
        + "\n</script>",
    }
    for marker, value in replacements.items():
        assert html.count(marker) == 1, marker
        html = html.replace(marker, value)
    output = root / "build"
    output.mkdir(exist_ok=True)
    destination = output / "sc26-tutorial.html"
    destination.write_text(html)
    notices = "\n\n".join(path.read_text() for path in sorted((root / "assets").glob("*.txt")))
    notices += "\n\nKaTeX 0.19.1\n" + (katex / "LICENSE").read_text()
    notices += "\n\n" + (root / "SOURCES.md").read_text()
    (output / "NOTICES.txt").write_text(notices)
    notebooks = root.parent / "notebooks"
    delivery_notebooks = output / "notebooks"
    delivery_notebooks.mkdir(exist_ok=True)
    for path in notebooks.iterdir():
        if path.suffix in {".ipynb", ".md", ".txt"}:
            shutil.copyfile(path, delivery_notebooks / path.name)
    shutil.copytree(notebooks / "_static", delivery_notebooks / "_static", dirs_exist_ok=True)
    print(destination)
    return destination


if __name__ == "__main__":
    build()
