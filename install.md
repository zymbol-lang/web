# Download & Install Zymbol

> Native binaries for Linux, Windows, and macOS. VS Code extension with LSP. Or
> compile from source on any platform. Current release: v0.0.9 (public alpha).

This is the Markdown representation of <https://zymbol-lang.org/install.html>.

All assets and their `SHA256SUMS` files:
<https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.9>

This is a concept validation release — Zymbol is in active development. APIs,
syntax, and features may change between versions.

## VS Code extension

Syntax highlighting, semantic tokens, bracket matching, and LSP integration
(hover, go-to-definition, diagnostics).

| Package | Version | Download | SHA256 |
| --- | --- | --- | --- |
| Zymbol-Lang VSIX | v0.1.5 | [zymbol-lang-0.1.5.vsix](https://github.com/zymbol-lang/vscode/releases/download/v0.1.5/zymbol-lang-0.1.5.vsix) | `263a81538dd5cee33e1f0184f4012fdeb8dd12f4b8a8d0988d350ff9c2e14d1c` |

```bash
# Install from the .vsix file:
code --install-extension zymbol-lang-0.1.5.vsix

# Or in VS Code: Extensions (Ctrl+Shift+X) → ··· → Install from VSIX…
```

## Windows

MSI installer with automatic PATH setup. Download and run — no manual
configuration needed.

| Arch | Download | SHA256 |
| --- | --- | --- |
| x86_64 | [zymbol_lang_v0.0.9_x86_64_windows.msi](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64_windows.msi) | `b5fcd7f6d8d226328a715699234896d9983de82afe5885ae96c65f9cbc723059` |

```bash
# After installing, open a new terminal and verify:
zymbol --version
```

**Code signed:** the Windows `.exe` and `.msi` are digitally signed via
[SignPath.io](https://signpath.io). Verify under the file's Properties → Digital
Signatures, or check the SHA256 above.

## macOS

Native binaries — no installer needed. Download, make executable, run.

| Arch | Download | SHA256 |
| --- | --- | --- |
| aarch64 (Apple Silicon) | [zymbol_lang_v0.0.9_aarch64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_aarch64_macos) | `5070af3c3a27202ba72673cb6e03b877502a10347bc2ff3651cb30a73c587c14` |
| x86_64 (Intel) | [zymbol_lang_v0.0.9_x86_64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64_macos) | `62e02df3a53973a35f3a8d2d261348bfc23b3ecab93f3d519d85e0632d032149` |

```bash
# Make it executable and run (replace _aarch64_ with _x86_64_ for Intel)
chmod +x zymbol_lang_v0.0.9_aarch64_macos
./zymbol_lang_v0.0.9_aarch64_macos run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.9_aarch64_macos /usr/local/bin/zymbol
```

**First launch warning:** the binary is not signed with a Developer ID and not
notarized, so Gatekeeper blocks it the first time. Clear the quarantine attribute
with `xattr -d com.apple.quarantine ./zymbol_lang_v0.0.9_aarch64_macos`, or open
*System Settings → Privacy & Security* and choose *Open Anyway* after the first
refusal. The Finder's right-click → Open works for apps, not reliably for a
command-line binary.

## Linux packages

The packages (`.deb`, `.rpm`, `.pkg.tar.zst`) install `zymbol` to
`/usr/bin/zymbol`. The static binary runs directly without installing — no
dependencies needed.

| Arch | Format | Download | SHA256 |
| --- | --- | --- | --- |
| x86_64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.9_x86_64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64.deb) | `1e2b59e0d89c32aa87412e29013826aadea8f11f39d2d4ba7059964866a14ac0` |
| x86_64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.9_x86_64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64.rpm) | `c45516d3a09749829414741c754b728a272541a6150bf868b6fff3534180a2d5` |
| x86_64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.9_x86_64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64.pkg.tar.zst) | `adaad32a14a707febfb2551d48814ef86c1b13046e6feb897737a1379b5633c0` |
| x86_64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.9_x86_64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_x86_64_linux) | `a8d8afead89839a54b5ddcbdb66f9c114c4334994d115b15b0b4c98aad8a4ecf` |
| aarch64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.9_aarch64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_aarch64.deb) | `a5c37fd3d17d028f8100add989996e3fa86bf1f65703bb36a3e0c561b70d8aad` |
| aarch64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.9_aarch64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_aarch64.rpm) | `1d6f3e5a9abe147985a8a2b708eec29a94e5adbc9c28855c49b65393636f50c2` |
| aarch64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.9_aarch64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_aarch64.pkg.tar.zst) | `27af40737f06bd96f09c0ff3373234b985085716b1c71f7cd84381e2427ae8f3` |
| aarch64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.9_aarch64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.9/zymbol_lang_v0.0.9_aarch64_linux) | `a931054a25672f8d8cc55dabe3dddcbd9039fc4f4ef618d818b140b23b2bc80b` |

Verifying a download — put `SHA256SUMS` (from the release page) next to the
package, then:

```bash
sha256sum --ignore-missing -c SHA256SUMS
```

Using the static binary, no installation needed:

```bash
# Make it executable (x86_64)
chmod +x zymbol_lang_v0.0.9_x86_64_linux

# Run a file
./zymbol_lang_v0.0.9_x86_64_linux run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.9_x86_64_linux /usr/local/bin/zymbol
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
zymbol run --vm file.zy     # register VM (~4× faster)
zymbol repl                 # interactive REPL
zymbol check file.zy        # syntax and semantic check only
zymbol fmt file.zy --write  # format in place
```

No install needed to try the language: <https://zymbol-lang.org/playground.html>
([Markdown](playground.md)).
