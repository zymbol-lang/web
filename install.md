# Download & Install Zymbol

> Native binaries for Linux, Windows, and macOS. VS Code extension with LSP. Or
> compile from source on any platform. Current release: v0.0.8 (public alpha).

This is the Markdown representation of <https://zymbol-lang.org/install.html>.

All assets and their `SHA256SUMS` files:
<https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.8>

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
| x86_64 | [zymbol_lang_v0.0.8_x86_64_windows.msi](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64_windows.msi) | `44de62a18180914f3b5c7de03cd683c9d49adf2e4443add2188635bb9824a265` |

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
| aarch64 (Apple Silicon) | [zymbol_lang_v0.0.8_aarch64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_aarch64_macos) | `1807b6b89c6454595c558d47561a8855b702815ab99979fa1cba1b5d361c1cba` |
| x86_64 (Intel) | [zymbol_lang_v0.0.8_x86_64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64_macos) | `8abda8c600ca6ccd0d0f2ca88548bbb9bd422d237f771a24a852c8366a2e4ba6` |

```bash
# Make it executable and run (replace _aarch64_ with _x86_64_ for Intel)
chmod +x zymbol_lang_v0.0.8_aarch64_macos
./zymbol_lang_v0.0.8_aarch64_macos run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.8_aarch64_macos /usr/local/bin/zymbol
```

**First launch warning:** macOS may show "unidentified developer". Right-click →
Open → Open to bypass. Code signing coming soon.

## Linux packages

The packages (`.deb`, `.rpm`, `.pkg.tar.zst`) install `zymbol` to
`/usr/bin/zymbol`. The static binary runs directly without installing — no
dependencies needed.

| Arch | Format | Download | SHA256 |
| --- | --- | --- | --- |
| x86_64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.8_x86_64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64.deb) | `c970b6142eb6d3da2467be840960f776c645cc06a2a5b74e54f3aeb84954235f` |
| x86_64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.8_x86_64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64.rpm) | `4f16d48696d35f62a21cbd6e75e07b401e5a042c1c49e766aa47262a5c6fec36` |
| x86_64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.8_x86_64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64.pkg.tar.zst) | `977fe27dbc2e94d0dd9b4c51a02d4699c9234512197921a2d5b8fceb964714d7` |
| x86_64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.8_x86_64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_x86_64_linux) | `92f181f25e81a64d65bab5931c77a88844a9d0f72050b1a9e60cf339e8210b12` |
| aarch64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.8_aarch64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_aarch64.deb) | `9b4f1ddbb958ab5f0bff70c147dd14719c157f861dd1b96cb6dec5d8e211f3a7` |
| aarch64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.8_aarch64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_aarch64.rpm) | `1d58899f66cc6965d7686286559908954bfbb2880bc8f7bd5f7e8ab58904ef8a` |
| aarch64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.8_aarch64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_aarch64.pkg.tar.zst) | `587779087547c6cb03d543e5751a6ab80a209cd73bb64dfa604d32e944a3367f` |
| aarch64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.8_aarch64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.8/zymbol_lang_v0.0.8_aarch64_linux) | `532cba88dc43b5656c7c0b57133d5f1453d189ed2fbbee3ddca5d737ef7691b6` |

Verifying a download — put `SHA256SUMS` (from the release page) next to the
package, then:

```bash
sha256sum --ignore-missing -c SHA256SUMS
```

Using the static binary, no installation needed:

```bash
# Make it executable (x86_64)
chmod +x zymbol_lang_v0.0.8_x86_64_linux

# Run a file
./zymbol_lang_v0.0.8_x86_64_linux run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.8_x86_64_linux /usr/local/bin/zymbol
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
