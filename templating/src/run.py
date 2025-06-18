import jinja2
from pathlib import Path
import argparse


def main(output_path: Path | str) -> None:
    output_path = Path(output_path).absolute()

    templates_path = Path(__file__).absolute().parent.parent / "templates"

    enviornment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(templates_path),
        autoescape=jinja2.select_autoescape(["html", "xml", "htm"]),
    )

    template = enviornment.get_template("pull_request_template.md")

    output = template.render(package_name="core")

    with open(output_path, "w") as file:
        file.write(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "output_path",
        type=str,
        help="Output path for the rendered template",
    )
    args = parser.parse_args()

    main(args.output_path)
