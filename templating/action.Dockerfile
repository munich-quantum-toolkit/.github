FROM python:3.13

ADD ./templates/ /templates/
ADD ./src/run.py run.py

RUN pip install jinja2

ENTRYPOINT ["python", "run.py"]
