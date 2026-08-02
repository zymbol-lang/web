/**
 * zyp.js — reads a Zymbol Package (.zyp) in the browser.
 *
 * A .zyp is a plain ZIP archive: `zyp.toml` (human-authored manifest), `zyp.json` (the same
 * manifest, pre-serialized to JSON by the Rust `zymbol-package` crate), and the source tree
 * under `src/`. This module reads the ZIP's central directory by hand — no bundler, no CDN
 * dependency, consistent with the rest of `web/` (see CLAUDE.md: no build step) — and never
 * touches `zyp.toml`: parsing TOML in the browser would mean either a CDN dependency or a
 * hand-rolled parser that could silently diverge from the Rust `toml` crate on comments,
 * escapes, or multi-line strings. `zyp.json` exists specifically so this file never has to.
 *
 * Only Stored (0) and Deflate (8) compression are supported — the only two the writer ever
 * produces. Deflate uses the browser's native `DecompressionStream('deflate-raw')` (Chrome
 * 103+, Firefox 113+, Safari 16.4+); there is no fallback, matching the "modern browser,
 * zero dependencies" stance of the rest of the playground.
 */

const EOCD_SIG = 0x06054b50;
const CDH_SIG  = 0x02014b50;

// Matches the writer's guard in zymbol-package/src/reader.rs — a sanity ceiling against a
// pathological archive eating the whole tab's memory, not a security boundary (the user
// picked this file themselves).
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

/**
 * Reads a `.zyp` archive.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<{ manifest: object, files: Map<string, string> }>}
 *   `files` maps a source-relative path (e.g. `"核/盤.zy"`, no `src/` prefix) to its
 *   decoded UTF-8 text.
 */
export async function readZyp(arrayBuffer) {
  const { entries } = await parseZip(arrayBuffer);

  const manifestBytes = entries.get('zyp.json');
  if (!manifestBytes) {
    throw new Error("zyp.json not found in archive — not a valid .zyp (or built by an older zymbol-package)");
  }
  const manifest = JSON.parse(new TextDecoder('utf-8').decode(manifestBytes));

  const files = new Map();
  for (const [name, bytes] of entries) {
    if (!name.startsWith('src/')) continue;
    const rel = name.slice('src/'.length);
    if (!rel || rel.endsWith('/')) continue; // directory entry, no data of its own
    // Mirrors the Rust reader's entry-name check. A browser has no filesystem, so a
    // traversing name like `src/../../x.zy` can't escape anywhere — but it would still
    // become a tab named `../../x.zy` and a resolver key nothing can address, and the two
    // readers disagreeing about what a valid package looks like is exactly how the CLI's
    // own traversal hole survived as long as it did. Same rule, both sides.
    if (!isSafeRelativePath(rel)) {
      throw new Error(`unsafe path in package: '${name}'`);
    }
    files.set(rel, new TextDecoder('utf-8').decode(bytes));
  }

  return { manifest, files };
}

/** Lexical mirror of `validate_relative_path` in the Rust crate's `path_safety` module. */
function isSafeRelativePath(path) {
  if (!path || path.includes('\0') || path.includes('\\') || path.startsWith('/')) return false;
  if (path[1] === ':') return false; // Windows drive letter, e.g. "C:/..."
  return !path.split('/').some(part => part === '..' || part === '.');
}

/**
 * Parses a ZIP's central directory into a flat `Map<entryName, bytes>`, decompressing each
 * entry as needed. Internal — `readZyp` is the public entry point.
 */
async function parseZip(arrayBuffer) {
  const view  = new DataView(arrayBuffer);
  const bytes = new Uint8Array(arrayBuffer);

  const eocdOffset = findEocd(view, bytes.length);
  if (eocdOffset < 0) {
    throw new Error('not a zip file (End Of Central Directory record not found)');
  }

  const totalEntries    = view.getUint16(eocdOffset + 10, true);
  const centralDirSize  = view.getUint32(eocdOffset + 12, true);
  const centralDirStart = view.getUint32(eocdOffset + 16, true);

  if (totalEntries === 0xffff || centralDirStart === 0xffffffff || centralDirSize === 0xffffffff) {
    throw new Error('zip64 archives are not supported');
  }

  const entries = new Map();
  let offset = centralDirStart;
  let totalBytes = 0;

  for (let i = 0; i < totalEntries; i++) {
    if (view.getUint32(offset, true) !== CDH_SIG) {
      throw new Error(`corrupt central directory (entry ${i} of ${totalEntries})`);
    }

    const compression      = view.getUint16(offset + 10, true);
    const compressedSize   = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const nameLen          = view.getUint16(offset + 28, true);
    const extraLen         = view.getUint16(offset + 30, true);
    const commentLen       = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localHeaderOffset === 0xffffffff) {
      throw new Error('zip64 entries are not supported');
    }

    totalBytes += uncompressedSize;
    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new Error(`archive exceeds the ${MAX_TOTAL_BYTES}-byte decompression ceiling`);
    }

    const nameBytes = bytes.subarray(offset + 46, offset + 46 + nameLen);
    const name = new TextDecoder('utf-8').decode(nameBytes);

    // Sizes above come from the CENTRAL directory, not the local header — with a data
    // descriptor (general-purpose flag bit 3) the local header's size fields are zero.
    // The local header IS still needed for its own name/extra lengths, though, since those
    // determine where this entry's actual data starts.
    const localNameLen  = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    const compressedBytes = bytes.subarray(dataStart, dataStart + compressedSize);

    let data;
    if (compression === 0) {
      data = compressedBytes;
    } else if (compression === 8) {
      data = await inflateRaw(compressedBytes);
    } else {
      throw new Error(`unsupported compression method ${compression} for entry '${name}' (only Stored/Deflate are)`);
    }

    entries.set(name, data);
    offset += 46 + nameLen + extraLen + commentLen;
  }

  return { entries };
}

/**
 * Scans backward for the End Of Central Directory signature, within the ZIP spec's maximum
 * comment length (65535 bytes) plus the EOCD record's own fixed 22 bytes.
 */
function findEocd(view, length) {
  const maxScan = Math.min(length, 65535 + 22);
  const minOffset = Math.max(0, length - maxScan);
  for (let i = length - 22; i >= minOffset; i--) {
    if (view.getUint32(i, true) === EOCD_SIG) return i;
  }
  return -1;
}

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}
