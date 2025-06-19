# Copyright (c) 2023 - 2025 Chair for Design Automation, TUM
# Copyright (c) 2025 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

import jinja2
from pathlib import Path
import argparse


def main(package_name: str) -> None:


    templates_path = Path(__file__).absolute().parent.parent / "templates"

    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(templates_path),
        autoescape=jinja2.select_autoescape(["html", "xml", "htm"]),
    )

    template = environment.get_template("pull_request_template.md")

    output = template.render(package_name=package_name)

    with open("/github/workspace/pull_request_template.md", "w") as file:
        file.write(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "package_name",
        type=str,
        help="Name of the MQT package",
    )
    args = parser.parse_args()

    main(args.package_name)
