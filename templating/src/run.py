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
import os


def main(
    *,
    synchronize_pull_request_template: bool,
    synchronize_security_policy: bool,
    package_url: str,
) -> None:
    templates_path = Path(__file__).absolute().parent.parent / "templates"

    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(templates_path),
        autoescape=jinja2.select_autoescape(["html", "xml", "htm"]),
    )

    if synchronize_security_policy:
        template = environment.get_template("SECURITY.md")
        output = template.render(package_url=package_url)
        with open(".github/SECURITY.md", "w") as file:
            file.write(output + "\n")

    if synchronize_pull_request_template:
        template = environment.get_template("pull_request_template.md")
        output = template.render()
        with open(".github/pull_request_template.md", "w") as file:
            file.write(output + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "synchronize_pull_request_template",
        type=bool,
        help="Whether to synchronize the pull-request template",
    )
    parser.add_argument(
        "synchronize_security_policy",
        type=bool,
        help="Whether to synchronize the security policy",
    )
    parser.add_argument(
        "package_url",
        type=str,
        help="GitHub URL of the MQT package",
    )
    args = parser.parse_args()

    main(
        synchronize_pull_request_template=args.synchronize_pull_request_template,
        synchronize_security_policy=args.synchronize_security_policy,
        package_url=args.package_url,
    )
