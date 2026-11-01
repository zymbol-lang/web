# Download & Install Zymbol

> Native binaries for Linux, Windows, and macOS. VS Code extension with LSP. Or
> compile from source on any platform. Current release: v0.0.11 (public alpha).

This is the Markdown representation of <https://zymbol-lang.org/install.html>.

All assets and their checksum files (`SHA256SUMS_*_linux.txt`, `SHA256_*.txt`):
<https://github.com/zymbol-lang/interpreter/releases/tag/v0.0.11>

This is a concept validation release — Zymbol is in active development. APIs,
syntax, and features may change between versions.

## VS Code extension

Syntax highlighting, semantic tokens, bracket matching, and LSP integration
(hover, go-to-definition, diagnostics).

| Package | Version | Download | SHA256 |
| --- | --- | --- | --- |
| Zymbol-Lang VSIX | v0.1.8 | [zymbol-lang-0.1.8.vsix](https://github.com/zymbol-lang/vscode/releases/download/v0.1.8/zymbol-lang-0.1.8.vsix) | `52cb76b93949766eb6c4fd50fd658d59f2b854967382e67988799e9def06a3c2` |

```bash
# Install from the .vsix file:
code --install-extension zymbol-lang-0.1.8.vsix

# Or in VS Code: Extensions (Ctrl+Shift+X) → ··· → Install from VSIX…
```

## Windows

MSI installer with automatic PATH setup. Download and run — no manual
configuration needed.

| Arch | Download | SHA256 |
| --- | --- | --- |
| x86_64 | [zymbol_lang_v0.0.11_x86_64_windows.msi](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64_windows.msi) | `3b60b6818297a8a430576b3b43718d1785cf9a02b2d9e74f348661443a584049` |

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
| aarch64 (Apple Silicon) | [zymbol_lang_v0.0.11_aarch64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_aarch64_macos) | `2eab488aa6439f6189869424a6ff8dcbb2b227d2788cf18600828b2eb09c227f` |
| x86_64 (Intel) | [zymbol_lang_v0.0.11_x86_64_macos](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64_macos) | `1b2b6d246df88353b1c0a060e8969d629d4a2e37d777189591f4de7d3a9d09c8` |

```bash
# Make it executable and run (replace _aarch64_ with _x86_64_ for Intel)
chmod +x zymbol_lang_v0.0.11_aarch64_macos
./zymbol_lang_v0.0.11_aarch64_macos run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.11_aarch64_macos /usr/local/bin/zymbol
```

**First launch warning:** the binary is not signed with a Developer ID and not
notarized, so Gatekeeper blocks it the first time. Clear the quarantine attribute
with `xattr -d com.apple.quarantine ./zymbol_lang_v0.0.11_aarch64_macos`, or open
*System Settings → Privacy & Security* and choose *Open Anyway* after the first
refusal. The Finder's right-click → Open works for apps, not reliably for a
command-line binary.

## Linux packages

The packages (`.deb`, `.rpm`, `.pkg.tar.zst`) install `zymbol` to
`/usr/bin/zymbol`. The static binary runs directly without installing — no
dependencies needed.

| Arch | Format | Download | SHA256 |
| --- | --- | --- | --- |
| x86_64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.11_x86_64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64.deb) | `eebe494de22d672b2c4c85fc7dd576ef9722ac71d327ffc06874e4206c27d630` |
| x86_64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.11_x86_64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64.rpm) | `9afc0fe8220b9431d64cdc778495b7aecae7a00ccc8c588a29be85079c5300da` |
| x86_64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.11_x86_64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64.pkg.tar.zst) | `0c8248980bef2f6abf2aa63f85ac777ef34743908e841fc5d26618f8977e5f23` |
| x86_64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.11_x86_64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_x86_64_linux) | `12e4430242eba59ee557d6a05f1b91c1b777db5cf6da91d52483fec8390c1930` |
| aarch64 | `.deb` Debian / Ubuntu | [zymbol_lang_v0.0.11_aarch64.deb](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_aarch64.deb) | `a2a25a8c0661e4985978e44dba284ffffd41e19d66543abf00126c0ec97d3fc4` |
| aarch64 | `.rpm` Fedora / RHEL | [zymbol_lang_v0.0.11_aarch64.rpm](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_aarch64.rpm) | `e13c72c458bdda223bd8526155be553c511cb2b02d96afb91d268aaa46e8a854` |
| aarch64 | `.pkg.tar.zst` Arch Linux | [zymbol_lang_v0.0.11_aarch64.pkg.tar.zst](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_aarch64.pkg.tar.zst) | `efcdc881c8f719268c4211dd8e3aa810e39288dbe1e16db1f6402aa39c05132c` |
| aarch64 | static binary, any Linux (musl) | [zymbol_lang_v0.0.11_aarch64_linux](https://github.com/zymbol-lang/interpreter/releases/download/v0.0.11/zymbol_lang_v0.0.11_aarch64_linux) | `c5353be61c1d9e6ecc6fd3d7c2e719e2785f7379d706f593feed1e03cd860e14` |

Verifying a download — put your architecture's checksum file from the release
page, `SHA256SUMS_x86_64_linux.txt` or `SHA256SUMS_aarch64_linux.txt`, next to the
package, then:

```bash
sha256sum --ignore-missing -c SHA256SUMS_x86_64_linux.txt   # or SHA256SUMS_aarch64_linux.txt
```

Using the static binary, no installation needed:

```bash
# Make it executable (x86_64)
chmod +x zymbol_lang_v0.0.11_x86_64_linux

# Run a file
./zymbol_lang_v0.0.11_x86_64_linux run hello.zy

# (Optional) Install system-wide
sudo install -m755 zymbol_lang_v0.0.11_x86_64_linux /usr/local/bin/zymbol
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
