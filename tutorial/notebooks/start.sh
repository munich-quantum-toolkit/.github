#!/usr/bin/env bash
# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

uv_command=$(command -v uv || true)
if [[ -z "$uv_command" ]]; then
    uv_install_dir="${UV_INSTALL_DIR:-$HOME/.local/bin}"
    uv_command="$uv_install_dir/uv"
    if [[ ! -x "$uv_command" ]]; then
        curl -LsSf https://astral.sh/uv/install.sh | UV_INSTALL_DIR="$uv_install_dir" UV_NO_MODIFY_PATH=1 sh
    fi
fi

exec "$uv_command" run --no-project --python 3.15 --with-requirements requirements.txt jupyter lab "$@"
