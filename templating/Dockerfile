FROM ghcr.io/astral-sh/uv:debian

ADD . /app/

RUN uv venv
RUN uv pip install jinja2

ENTRYPOINT ["uv", "run", "/app/src/run.py"]
