# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

"""Exercise the delivered HTML offline and retain rendered review images."""

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


def check(browser_path, output) -> None:
    root = Path(__file__).resolve().parent
    html = root / "build/sc26-tutorial.html"
    output.mkdir(parents=True, exist_ok=True)
    errors, requests, overflow = [], [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=browser_path, headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080}, reduced_motion="reduce")
        context.route(
            "**/*",
            lambda route: (
                (requests.append(route.request.url), route.abort())
                if route.request.url.startswith(("http:", "https:"))
                else route.continue_()
            ),
        )
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto(html.as_uri())
        page.evaluate("document.fonts.ready")
        assert page.evaluate('document.fonts.check("32px Inter")')
        slides = page.evaluate("MQSF_DECK.slides")
        ids = [slide["id"] for slide in slides]
        assert ids.index("compiler-map") == ids.index("optimize") + 1
        assert ids.index("compiler-map") < ids.index("break") < ids.index("notebook-compiler")
        headers = []
        assert ids[ids.index("notebook-compiler") :] == [
            "notebook-compiler",
            "hybrid-algorithm",
            "afqmc-execution",
            "qdmi-interface",
            "slurm-playground",
            "execute",
            "notebook-qdmi",
            "grover-growth",
            "structured",
            "adaptive-execution",
            "conclusions",
        ]
        assert page.locator(".slide-header img").evaluate_all("els=>els.map(e=>e.alt)") == [
            "Technical University of Munich",
            "MQSC",
            "Munich Quantum Valley",
        ]
        assert page.locator(".cover-art").inner_text().strip(), "Restore the labels inside the overview boxes"
        assert page.locator(".cover-art text").evaluate_all(
            "els=>els.every(e=>!['Program','Runtime','Users','Device Capabilities','Submit','Results'].includes(e.textContent))"
        )
        sampling_index = next(i for i, slide in enumerate(slides) if slide["id"] == "quantum-program")
        states = [(i, b) for i, slide in enumerate(slides) for b in range(slide["builds"] + 1)]
        for theme in ("light", "dark"):
            page.emulate_media(color_scheme=theme)
            for i, b in states:
                page.evaluate("([i,b]) => {MQSF_DECK.go(i,b); MQSF_DECK.finishMotion();}", [i, b])
                page.evaluate("document.fonts.ready")
                assert page.evaluate("MQSF_DECK.getState()") == {"slide": i, "step": b, "animating": False}
                assert page.locator(".katex-error").count() == 0
                assert page.locator('#slide [src="brand:mqt"], #slide [href="brand:mqt"]').count() == 0
                if slides[i]["id"] == "detail" and b >= 2:
                    assert page.locator("#slide image").evaluate_all(
                        "els=>els.some(e=>e.getAttribute('href')===MQSF_ASSETS.mqt)"
                    ), "Keep the MQT logo in slide content"
                    assert page.locator("#slide image").evaluate_all(
                        "els=>els.some(e=>e.getAttribute('href')===MQSF_ASSETS['qr-iqm'])"
                    ), "Keep source QR artwork"
                if slides[i]["id"].startswith("notebook-"):
                    assert page.locator("#deck").evaluate("e=>getComputedStyle(e).backgroundColor") == "rgb(20, 43, 69)"
                    assert page.locator(".notebook-qr").get_attribute("src") == page.evaluate('ASSETS["qr-tutorial"]')
                assert page.locator('#deck a, #deck [role="link"]').count() == 0
                assert page.evaluate(r"""() => {
                    const ids=[...document.querySelectorAll('#slide [id]')].map(e=>e.id);
                    return new Set(ids).size === ids.length && [...document.querySelectorAll('#slide [marker-end]')].every(e=>{
                        const id=e.getAttribute('marker-end').match(/url\(#([^)]*)\)/)?.[1];
                        return !id || e.ownerSVGElement.contains(document.getElementById(id));
                    });
                }"""), "SVG arrow definitions must belong to the same build"
                header = page.locator(".slide-header span").text_content()
                if theme == "light" and b == 0:
                    headers.append(header)
                assert header == headers[i]
                if slides[i]["id"] in ("welcome", "break"):
                    assert header == ""
                elif slides[i]["id"].startswith("notebook-"):
                    assert header == "YOUR TURN"
                # The copied headings establish the shared FullHD title anchor.
                for title in page.locator("#slide h2").all():
                    box = title.bounding_box()
                    assert (box["x"], box["y"]) == (80, 152), (slides[i]["id"], b, box)
                if slides[i]["id"] == "break":
                    box = page.locator(".chapter-separator h1").bounding_box()
                    assert (box["x"] + box["width"] / 2, box["y"] + box["height"] / 2) == (960, 540)
                projected_text = page.locator("#deck").inner_text()
                assert not any(
                    marker in projected_text for marker in ("http:", "https:", "www.", "github.com", "readthedocs")
                )
                found = page.evaluate("""() => {
                    const box=document.querySelector('#slide').getBoundingClientRect();
                    // The original scenes use the gap below the article for credits and panels.
                    const bottom=document.querySelector('.slide-footer').getBoundingClientRect().top-12;
                    const result=[];
                    for (const el of document.querySelectorAll('#slide *')) {
                        if(el.closest('[aria-hidden="true"]') || el instanceof SVGElement ||
                            !el.checkVisibility({checkOpacity:true, checkVisibilityCSS:true})) continue;
                        // KaTeX's internal boxes deliberately overlap; check the complete formula.
                        if(el.closest('.katex') && !el.matches('.katex')) continue;
                        const r=el.getBoundingClientRect();
                        if(!r.width || !r.height) continue;
                        // Visible centered labels may extend beyond their layout box, within the slide.
                        const clips=getComputedStyle(el).overflowX !== 'visible';
                        if(r.bottom>bottom || r.right>box.right+2 || r.left<box.left-2 || (clips && el.scrollWidth>el.clientWidth+3)) {
                            result.push({tag:el.tagName,text:el.textContent.slice(0,80),bottom:Math.round(r.bottom-box.bottom),right:Math.round(r.right-box.right),scroll:el.scrollWidth-el.clientWidth});
                        }
                    }
                    for (const svg of document.querySelectorAll('#slide svg.diagram')) {
                        if(svg.closest('[aria-hidden="true"]')) continue;
                        const r=svg.getBBox(), v=svg.viewBox.baseVal;
                        if(r.x<v.x-3 || r.y<v.y-3 || r.x+r.width>v.x+v.width+3 || r.y+r.height>v.y+v.height+3)
                            result.push({tag:'SVG',bounds:[r.x,r.y,r.width,r.height],viewBox:[v.x,v.y,v.width,v.height]});
                    }
                    return result;
                }""")
                if found:
                    overflow.append({"slide": slides[i]["id"], "build": b, "theme": theme, "elements": found})
                assert page.locator("pre[data-snippet]").evaluate_all(r"""els => els.every(el =>
                    [...el.querySelectorAll('.code-text')].map(line => line.textContent).join('\n') === SNIPPETS[el.dataset.snippet].source.replace(/\n+$/, '') &&
                    [...el.querySelectorAll('.line-no')].every((line, i) => line.textContent === String(i + 1)) &&
                    getComputedStyle(el).backgroundColor === 'rgb(240, 240, 240)' &&
                    el.querySelectorAll('span[class]').length > 0 &&
                    new Set([...el.querySelectorAll('span[class]')].map(s => getComputedStyle(s).color)).size > 1
                )"""), "Pygments must preserve code and render distinct token colors"
                if slides[i]["id"] == "conclusions":
                    assert page.locator(".closing-qr").count() == 4
                    assert page.locator(".closing-resource h3").all_text_contents() == [
                        "Tutorial materials",
                        "MQT Core",
                        "QDMI",
                        "MQSC",
                    ]
                if slides[i]["id"] == "grover-growth":
                    assert page.locator(".grover-equation .katex").count() == 1
                if slides[i]["id"] == "adaptive-execution":
                    assert page.locator(".qpe-nested svg text").count() == 0
                    assert page.locator(".qpe-nested .katex").count() > 0
                    arrows = page.locator('.adaptive-sequence [data-morph^="sequence-"] [marker-end]')
                    assert arrows.count() == 4
                    assert arrows.evaluate_all('els=>els.every(e=>e.getAttribute("stroke-width")==="3")')
                if slides[i]["id"] == "execute":
                    assert page.locator(".code-block h3").count() == 0
                    assert page.locator(".execution-output [data-outcome]").evaluate_all("""els =>
                        els.every(el => Number(el.dataset.count) === SAMPLING.counts[el.dataset.outcome] &&
                            Math.abs(Number(el.getAttribute('height')) / 300 - Number(el.dataset.count) / SAMPLING.shots.length) < 1e-12) &&
                        els.reduce((n, el) => n + Number(el.dataset.count), 0) === SAMPLING.shots.length
                    """)
                assert page.evaluate("Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)")
                page.screenshot(path=str(output / f"{theme}-{i + 1:02d}-{b}-{slides[i]['id']}.png"))
        chapters = [header for header in headers if header not in ("YOUR TURN", "")]
        assert list(dict.fromkeys(chapters)) == [
            "System software",
            "Quantum programming",
            "Quantum compilation",
            "HPC integration",
            "STRUCTURED PROGRAMS",
            "CONCLUSIONS",
        ]
        assert all(a == b or chapters.index(b) > chapters.index(a) for a, b in zip(chapters, chapters[1:]))
        # Revealing the optimized output does not move the input or Python footer.
        geometry = []
        for step in (0, 1):
            page.evaluate("([i,s])=>{MQSF_DECK.go(i,s);MQSF_DECK.finishMotion();}", [ids.index("optimize"), step])
            geometry.append(
                page.locator(".program-panel:first-of-type, .story-python").evaluate_all(
                    "els=>els.map(e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})"
                )
            )
        assert page.locator(".program-panel").count() == 2
        assert geometry[0] == geometry[1], "Unchanged compiler content must stay stationary"
        # Exact sampling frequencies on a fixed 0–100% axis, including partial replays.
        for step, expected in enumerate((0, 0, 1, 2, 3, 1024)):
            page.evaluate("([i,s])=>{MQSF_DECK.go(i,s);MQSF_DECK.finishMotion();}", [sampling_index, step])
            assert page.locator(".sample-token, .sampling-caption").count() == 0
            assert page.locator(".sampling-circuit svg text").count() == 0
            assert page.locator(".sampling-circuit").is_visible() == (step >= 1)
            assert page.locator(".sampling-histogram").is_visible() == (step >= 2)
            assert int(page.locator("[data-shots]").get_attribute("data-shots")) == expected
            values = page.locator("[data-outcome]").evaluate_all(
                "els=>els.map(e=>[e.dataset.outcome,+e.dataset.count,+e.dataset.frequency,+e.getAttribute('height')])"
            )
            for outcome, count, frequency, height in values:
                assert count == page.evaluate(
                    "n=>SAMPLING.shots.slice(0,n).filter(s=>s==='" + outcome + "').length", expected
                )
                assert abs(frequency - (count / expected if expected else 0)) < 1e-12
                assert abs(height - 300 * frequency) < 1e-10
        for progress in (0, 0.25, 0.5, 0.75, 1):
            page.evaluate(
                "([i,p])=>document.querySelector('#slide').innerHTML=MQSF_DECK.renderSlide(i,5,p)",
                [sampling_index, progress],
            )
            expected = 3 + int(1021 * progress)
            assert int(page.locator("[data-shots]").get_attribute("data-shots")) == expected
            assert (
                page.locator("[data-count]").evaluate_all("els=>els.reduce((n,e)=>n+Number(e.dataset.count),0)")
                == expected
            )
        page.evaluate("i=>{MQSF_DECK.go(i,3);MQSF_DECK.finishMotion();}", ids.index("representations"))
        circuit_box = page.locator(".story-circuit").bounding_box()
        source_box = page.locator('[data-morph="program-OpenQASM"]').bounding_box()
        assert circuit_box["width"] == 480
        assert circuit_box["x"] + circuit_box["width"] / 2 == source_box["x"] + source_box["width"] / 2
        assert "import" not in page.locator(".story-python").inner_text()
        python_boxes = page.locator(".story-python pre").evaluate_all(
            "els=>els.map(e=>{const r=e.getBoundingClientRect();return {center:r.x+r.width/2,border:getComputedStyle(e).borderLeftWidth}})"
        )
        assert [b["center"] for b in python_boxes] == [660, 1260]
        assert all(b["border"] == "4px" for b in python_boxes)
        qco = page.locator('[data-morph="program-QCO"] pre').inner_text()
        qco_box = page.locator('[data-morph="program-QCO"]').bounding_box()
        page.evaluate("i=>{MQSF_DECK.go(i,0);MQSF_DECK.finishMotion();}", ids.index("optimize"))
        assert page.locator('[data-morph="program-QCO"] pre').inner_text() == qco
        moved_box = page.locator('[data-morph="program-QCO"]').bounding_box()
        assert moved_box["y"] == qco_box["y"] and moved_box["width"] == qco_box["width"]
        assert qco_box["x"] - moved_box["x"] == 900
        page.evaluate("MQSF_DECK.go(0,0)")
        for expected in states[1:]:
            page.keyboard.press("PageDown")
            assert page.evaluate("MQSF_DECK.getState()") == {
                "slide": expected[0],
                "step": expected[1],
                "animating": False,
            }
        for expected in reversed(states[:-1]):
            page.keyboard.press("PageUp")
            assert page.evaluate("MQSF_DECK.getState()") == {
                "slide": expected[0],
                "step": expected[1],
                "animating": False,
            }
        page.keyboard.press("g")
        assert page.locator("#overview").evaluate("(el)=>el.open")
        page.locator("#slide-grid button").nth(10).click()
        assert page.evaluate("MQSF_DECK.getState().slide") == 10
        page.keyboard.press("b")
        assert page.locator("#blackout").is_visible()
        page.keyboard.press("b")
        assert not page.locator("#blackout").is_visible()
        page.keyboard.press("7")
        page.keyboard.press("Enter")
        assert page.evaluate("MQSF_DECK.getState().slide") == 6
        page.goto(html.as_uri() + f"#{sampling_index + 1}.2")
        page.reload()
        assert page.evaluate("MQSF_DECK.getState()") == {"slide": sampling_index, "step": 2, "animating": False}
        page.goto(html.as_uri() + "#no-such-slide/NaN")
        page.reload()
        assert page.evaluate("MQSF_DECK.getState().slide") == 0
        # Sample the original continuous renderers at the beginning, middle and end.
        for i, slide in enumerate(slides):
            for step in slide["playbacks"]:
                for progress in (0, 0.5, 1):
                    page.evaluate(
                        """([i,s,p])=>{
                        MQSF_DECK.go(i,s); MQSF_DECK.finishMotion();
                        document.querySelector('#slide').innerHTML=MQSF_DECK.renderSlide(i,s,p);
                    }""",
                        [i, int(step), progress],
                    )
                    page.screenshot(path=str(output / f"motion-{slide['id']}-{step}-{progress}.png"))
        # A transition from copied content to authored content keeps the title anchored.
        page.emulate_media(reduced_motion="no-preference")
        demo_index = ids.index("native-demo")
        page.evaluate(
            "([i,b])=>{MQSF_DECK.go(i,b);MQSF_DECK.finishMotion();}",
            [demo_index, slides[demo_index]["builds"]],
        )
        page.keyboard.press("PageDown")
        page.wait_for_timeout(150)
        assert page.evaluate("MQSF_DECK.getState().slide") == ids.index("mlir-operation")
        for title in page.locator("#slide h2").all():
            box = title.bounding_box()
            assert (box["x"], box["y"]) == (80, 152), box
        page.screenshot(path=str(output / "title-transition.png"))
        page.evaluate("MQSF_DECK.finishMotion()")
        page.keyboard.press("f")
        assert page.evaluate("!!document.fullscreenElement")
        page.keyboard.press("f")
        page.emulate_media(reduced_motion="no-preference")
        page.evaluate("i=>{MQSF_DECK.go(i,3);MQSF_DECK.finishMotion();}", ids.index("representations"))
        page.evaluate("i=>MQSF_DECK.go(i,0)", ids.index("optimize"))
        page.wait_for_timeout(150)
        moving_box = page.locator('[data-morph="program-QCO"]').bounding_box()
        assert 380 < moving_box["x"] < 1280, "QCO must move from the third column to the first"
        page.screenshot(path=str(output / "qco-panel-transition.png"))
        page.keyboard.press("PageUp")
        page.evaluate("MQSF_DECK.finishMotion()")
        assert page.locator('[data-morph="program-QCO"]').bounding_box()["x"] == 1280
        page.evaluate("i=>MQSF_DECK.go(i,5,true)", sampling_index)
        page.wait_for_timeout(350)
        assert page.evaluate("MQSF_DECK.getState().animating")
        assert 3 < int(page.locator("[data-shots]").get_attribute("data-shots")) < 1024
        page.screenshot(path=str(output / "sampling-transition.png"))
        page.keyboard.press("PageUp")
        page.evaluate("MQSF_DECK.finishMotion()")
        assert page.evaluate("MQSF_DECK.getState()") == {"slide": sampling_index, "step": 4, "animating": False}
        assert page.locator("[data-shots]").get_attribute("data-shots") == "3"
        routing_index = next(i for i, slide in enumerate(slides) if slide["id"] == "native-demo")
        page.evaluate("(i)=>MQSF_DECK.go(i,4,true)", routing_index)
        page.wait_for_timeout(900)
        assert page.evaluate("MQSF_DECK.getState().animating")
        page.screenshot(path=str(output / "compilation-transition.png"))
        page.keyboard.press("PageDown")
        page.keyboard.press("PageDown")
        page.keyboard.press("PageUp")
        page.evaluate("MQSF_DECK.finishMotion()")
        assert page.evaluate("MQSF_DECK.getState()") == {"slide": routing_index, "step": 5, "animating": False}
        page.set_viewport_size({"width": 1366, "height": 768})
        page.wait_for_timeout(100)
        assert page.locator("#deck").bounding_box()["width"] <= 1366.1
        page.screenshot(path=str(output / "laptop.png"))
        browser.close()
    report = {
        "slides": len(slides),
        "states": len(states),
        "themes": ["light", "dark"],
        "errors": errors,
        "external_requests": requests,
        "overflow": overflow,
    }
    (output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    assert not errors, errors
    assert not requests, requests
    assert not overflow, "Slide overflow; see report.json"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", default="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent / "build/review")
    args = parser.parse_args()
    check(args.browser, args.output)
