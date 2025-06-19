# Copyright (c) 2023 - 2025 Chair for Design Automation, TUM
# Copyright (c) 2025 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

FROM python:3.13

ADD ./templates/ /templates/
ADD ./src/run.py run.py

RUN pip install jinja2

ENTRYPOINT ["python", "/run.py"]
