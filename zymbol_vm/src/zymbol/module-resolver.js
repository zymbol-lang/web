// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Path-normalizing module resolver, factored out of playground.js so it can be exercised
 * without a DOM (playground.js touches `document` at import time). See
 * playground.js's `buildModuleResolver` for the story: this replaces a resolver that
 * collapsed every import to its basename, which silently collided same-named modules in
 * different directories and never returned `resolvedPath` (so zymbol.js's module cache and
 * circular-import detection kept treating the same file, imported via two different
 * relative paths, as two distinct modules — loading and running it twice).
 *
 * `joinPath` normalizes `.`/`..` against the importing file's own directory, mirroring
 * `ModulePath::resolve_from` on the Rust side. `makeResolver` returns a *nested* resolver
 * rooted at the resolved file's own directory — required for imports more than one level
 * deep (e.g. 対局 → 表示/描画 → ../核/盤).
 */

/** @returns {string|null} the normalized path, or `null` if it walks above the root. */
export function joinPath(baseDir, rel) {
  const parts = (baseDir ? baseDir.split('/') : []).concat(rel.split('/'));
  const out = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (out.length === 0) return null; // escaped above the root — not resolvable
      out.pop();
      continue;
    }
    out.push(part);
  }
  return out.join('/');
}

/**
 * @param {(path: string) => string | undefined} getCode looks up a file's source by its
 *   full, root-relative path (e.g. `"核/盤.zy"`); returns `undefined` if not found.
 * @param {string} baseDir the directory `importPath`s passed to the returned resolver are
 *   relative to.
 * @returns the resolver function zymbol.js's `Interpreter` expects: `async (importPath) =>
 *   { notFound: true, path } | { src, resolver, resolvedPath }`.
 */
export function makeResolver(getCode, baseDir) {
  const resolver = async (importPath) => {
    const joined = joinPath(baseDir, importPath);
    if (joined === null) return { notFound: true, path: importPath };
    const path = joined.endsWith('.zy') ? joined : joined + '.zy';
    const src = getCode(path);
    if (src === undefined) return { notFound: true, path };
    const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
    return { src, resolver: makeResolver(getCode, dir), resolvedPath: path };
  };
  return resolver;
}
