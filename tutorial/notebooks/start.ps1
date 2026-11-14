# Copyright (c) 2023 - 2026 Chair for Design Automation, TUM
# Copyright (c) 2025 - 2026 Munich Quantum Software Company GmbH
# All rights reserved.
#
# SPDX-License-Identifier: MIT
#
# Licensed under the MIT License

$ErrorActionPreference = 'Stop'
$uvCommand = Get-Command uv -CommandType Application -ErrorAction SilentlyContinue
if ($uvCommand) {
    $uvPath = $uvCommand.Source
} else {
    $uvInstallDir = if ($env:UV_INSTALL_DIR) { $env:UV_INSTALL_DIR } else { Join-Path $HOME '.local/bin' }
    $uvPath = Join-Path $uvInstallDir 'uv.exe'
    if (-not (Test-Path -LiteralPath $uvPath)) {
        $previousInstallDir = $env:UV_INSTALL_DIR
        $previousNoModifyPath = $env:UV_NO_MODIFY_PATH
        try {
            $env:UV_INSTALL_DIR = $uvInstallDir
            $env:UV_NO_MODIFY_PATH = '1'
            Invoke-RestMethod https://astral.sh/uv/install.ps1 | Invoke-Expression
        } finally {
            $env:UV_INSTALL_DIR = $previousInstallDir
            $env:UV_NO_MODIFY_PATH = $previousNoModifyPath
        }
    }
}

Push-Location -LiteralPath $PSScriptRoot
try {
    & $uvPath run --no-project --python 3.15 --with-requirements requirements.txt jupyter lab @args
    $uvExitCode = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $uvExitCode
