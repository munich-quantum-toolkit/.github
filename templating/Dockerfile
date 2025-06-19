FROM ghcr.io/astral-sh/uv:debian

ADD ./templates/ /templates/
ADD ./src/run.py run.py

RUN uv venv && uv pip install jinja2

ENTRYPOINT ["uv", "run", "run.py"]
