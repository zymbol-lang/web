# Download & Install Zymbol

> Native binaries for Linux, Windows, and macOS. VS Code extension with LSP. Or
> compile from source on any platform. Current release: v0.0.10 (public alpha).

This is the Markdown representation of <https://zymbol-lang.org/install.html>.

All assets and their `SHA256SUMS` files:
<https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.10>

This is a concept validation release — Zymbol is in active development. APIs,
syntax, and features may change between versions.

## VS Code extension

Syntax highlighting, semantic tokens, bracket matching, and LSP integration
(hover, go-to-definition, diagnostics).

| Package | Version | Download | SHA256 |
| --- | --- | --- | --- |
| Zymbol-Lang VSIX | v0.1.7 | [zymbol-lang-0.1.7.vsix](https://github.com/zymbol-lang/vscode/releases/download/v0.1.7/zymbol-lang-0.1.7.vsix) | `f5251c8ebde4cfe7bec54c61bdf9e088d4976e82367976439f9deb11830f841b` |

```bash
# Install from the .vsix file:
code --install-extension zymbol-lang-0.1.7.vsix

# Or in VS Code: Extensions (Ctrl+Shift+X) → ··· → Install from VSIX…
```

## Windows

MSI installer with automatic PATH setup. Download and run — no manual
configuration needed.

| Arch | Download | SHA256 |
| --- | --- | --- |
| x86_64 | [zymbol_lang_v0.0.10_x86_64_windows.msi](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64_windows.msi) | `db08e8f07ec07c7fb7ab29feac266700cc1112b9ac63b59b5c4792005a5027c4` |

```bash
# After installing, open a new terminal and verify:
zymbol --version
```

**Code signed:** the Windows `.msi` carries a digital signature (Authenticode,
SHA-256) made with the project's own **self-signed** certificate, `CN=zymbol-lang`.
It proves the file is the one that was built and has not been altered; it does
*not* make Windows treat the publisher as trusted, so SmartScreen may still warn.
The `zymbol.exe` inside is not signed. You can read the signature under the file's
Properties → Digital Signatures, or check the SHA256 above.

## macOS

Native binaries — no installer needed. Download, make executable, run.

| Arch | Download | SHA256 |
| --- | --- | --- |
| aarch64 (Apple Silicon) | [zymbol_lang_v0.0.10_aarch64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_aarch64_macos) | `4f945a0a888a17414519cb36b2cda17e0eed4412fcd279d79c7c25021b4c8046` |
| x86_64 (Intel) | [zymbol_lang_v0.0.10_x86_64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64_macos) | `3eb6bcfffb3dfadb7f56b7e25a0ead4f0169681a7e2833611167c79e5f0e7494` |

```bash
# Make it executable and run (replace _aarch64_ with _x86_64_ for Intel)
chmod +x zymbol_lang_v0.0.10_aarch64_macos
./zymbol_lang_v0.0.10_aarch64_macos run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.10_aarch64_macos /usr/local/bin/zymbol
```

**First launch warning:** the binary is not signed with a Developer ID and not
notarized, so Gatekeeper blocks it the first time. Clear the quarantine attribute
with `xattr -d com.apple.quarantine ./zymbol_lang_v0.0.10_aarch64_macos`, or open
*System Settings → Privacy & Security* and choose *Open Anyway* after the first
refusal. The Finder's right-click → Open works for apps, not reliably for a
command-line binary.

## Linux packages

The packages (`.deb`, `.rpm`, `.pkg.tar.zst`) install `zymbol` to
`/usr/bin/zymbol`. The static binary runs directly without installing — no
dependencies needed.

| Arch | Format | Download | SHA256 |
| --- | --- | --- | --- |
| x86_64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.10_x86_64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64.deb) | `965a4b57b7a6c0af42fd21b9633ee601b2c9d9f3cb944c0b7a608dff1fda3b5c` |
| x86_64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.10_x86_64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64.rpm) | `5572c2b809bfdb741e71640d6c010ac43133686cf0d09c6d654d1403f3a7474d` |
| x86_64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.10_x86_64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64.pkg.tar.zst) | `537cfb9d5ddeb5ecd3c0aa32e8bdeb82d1ba3d22b180f94a9aa128f2d29c40b6` |
| x86_64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.10_x86_64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_x86_64_linux) | `f17f98542dbb91de4e96fcd411e30f737a1525d10b150ea374375ac1bb532513` |
| aarch64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.10_aarch64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_aarch64.deb) | `1fe079538e8af714c6013d81c7569a7d511db638bf2a97cb55caf8659cf27ab1` |
| aarch64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.10_aarch64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_aarch64.rpm) | `36eab9c93a2917f1e5cf5c73bd67f5e8850d39963bebf98c828c3c0d11212de1` |
| aarch64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.10_aarch64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_aarch64.pkg.tar.zst) | `72ba2d571b3ccb1355e31649f183209422b87a40ac976bb52dedf22083fc321d` |
| aarch64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.10_aarch64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.10/zymbol_lang_v0.0.10_aarch64_linux) | `d4f72263cfd28b4a7a636e8732a29eba2971219e02ab0d5dcc725c7da5e09d99` |

Verifying a download — put `SHA256SUMS` (from the release page) next to the
package, then:

```bash
sha256sum --ignore-missing -c SHA256SUMS
```

Using the static binary, no installation needed:

```bash
# Make it executable (x86_64)
chmod +x zymbol_lang_v0.0.10_x86_64_linux

# Run a file
./zymbol_lang_v0.0.10_x86_64_linux run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.10_x86_64_linux /usr/local/bin/zymbol
```

## Compile from source

Works on Linux, macOS, and Windows. Requires [Rust stable
(rustup)](https://rustup.rs).

```bash
# 1 — Clone the interpreter repository
git clone https://github.com/zymbol-lang/interpreter
cd interpreter

# 2 — Build optimized release binary
cargo build --release
# Binary: target/release/zymbol

# 3 — (Optional) Install system-wide on Linux / macOS
sudo install -m755 target/release/zymbol /usr/local/bin/zymbol

# 4 — Verify
zymbol --version
```

## After installing

```bash
zymbol run file.zy          # tree-walker interpreter (default)
zymbol run --vm file.zy     # register VM (faster; how much depends on the program)
zymbol repl                 # interactive REPL
zymbol check file.zy        # syntax and semantic check only
zymbol fmt file.zy --write  # format in place
```

No install needed to try the language: <https://zymbol-lang.org/playground.html>
([Markdown](playground.md)).
