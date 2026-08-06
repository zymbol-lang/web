// SPDX-License-Identifier: AGPL-3.0-only
//
// WebMCP — exposes the playground's actions to an agent running in the browser,
// via `navigator.modelContext.registerTool()`.
//
// The playground is an application, not a document: an agent that can only read
// the page can tell you what Zymbol looks like, but cannot run a line of it.
// These tools let it write a program, execute it in the same engine the ▶ Run
// button uses, and read the real output — including the real error.
//
// Two rules shape what is here:
//
//   nothing silent   every tool writes to the output panel, so a person watching
//                    the tab sees what the agent did and what came back;
//   nothing lost     `zymbol_run` never touches the editor. The one tool that
//                    does overwrite it says so in its description, because
//                    replacing someone's unsaved work is not a side effect to
//                    discover afterwards.
//
// The API is a Chrome origin trial and absent almost everywhere. This module is
// feature-detected end to end: no `navigator.modelContext`, no tools, no error,
// no difference to the page.

const SCHEMA_SOURCE = {
  type: 'object',
  properties: {
    source: { type: 'string', description: 'Zymbol source code' },
  },
  required: ['source'],
};

/**
 * @param {object} bridge  playground internals, injected rather than imported so
 *                         this module stays testable without a DOM.
 * @param {(src: string) => Promise<string>} bridge.runSource
 * @param {() => {name: string|null, code: string}} bridge.getEditor
 * @param {(src: string) => void} bridge.setEditor
 * @param {(query?: string) => Array<{title: string, path: string, desc?: string}>} bridge.listExamples
 * @param {(path: string) => Promise<string>} bridge.openExample
 * @param {(text: string) => void} bridge.note
 * @returns {AbortController|null} unregisters every tool when aborted
 */
export function registerWebMcpTools(bridge) {
  const ctx = globalThis.navigator?.modelContext;
  if (!ctx || typeof ctx.registerTool !== 'function') return null;

  const controller = new AbortController();
  const { signal } = controller;

  const tools = [
    {
      name: 'zymbol_run',
      description:
        'Run Zymbol source in the browser interpreter and return everything it printed, ' +
        'including runtime errors. Does not modify the editor. Modules imported with <# ' +
        'resolve against the files currently mounted in the playground.',
      inputSchema: SCHEMA_SOURCE,
      async execute({ source }) {
        bridge.note(`\n[agent] zymbol_run\n`);
        const output = await bridge.runSource(String(source ?? ''));
        return { content: [{ type: 'text', text: output || '(no output)' }] };
      },
    },
    {
      name: 'zymbol_get_editor',
      description:
        'Read the file currently open in the playground editor: its name and its full source.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        const { name, code } = bridge.getEditor();
        return { content: [{ type: 'text', text: `// ${name ?? '(untitled)'}\n${code}` }] };
      },
    },
    {
      name: 'zymbol_set_editor',
      description:
        'Replace the contents of the open editor tab with the given Zymbol source. ' +
        'Overwrites whatever the person had there — read zymbol_get_editor first if that matters.',
      inputSchema: SCHEMA_SOURCE,
      async execute({ source }) {
        bridge.setEditor(String(source ?? ''));
        bridge.note(`\n[agent] zymbol_set_editor — editor replaced\n`);
        return { content: [{ type: 'text', text: 'Editor updated. Call zymbol_run to execute it.' }] };
      },
    },
    {
      name: 'zymbol_list_examples',
      description:
        'List the runnable examples this playground ships, optionally filtered by a ' +
        'substring of the title, path or description. Returns paths usable with zymbol_open_example.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional substring filter' },
        },
      },
      async execute({ query } = {}) {
        const hits = bridge.listExamples(query ? String(query) : undefined);
        const text = hits.length
          ? hits.map(e => `${e.path}\t${e.title}${e.desc ? ` — ${e.desc}` : ''}`).join('\n')
          : '(no example matches)';
        return { content: [{ type: 'text', text }] };
      },
    },
    {
      name: 'zymbol_open_example',
      description:
        'Open an example by its path under examples/ (for instance ' +
        '"games/classic/go.zyp" or "rosetta-stone/Klingon_pIqaD.zy"). A package mounts its ' +
        'whole source tree and opens its default script.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path under examples/, as listed by zymbol_list_examples' },
        },
        required: ['path'],
      },
      async execute({ path }) {
        const result = await bridge.openExample(String(path ?? ''));
        return { content: [{ type: 'text', text: result }] };
      },
    },
  ];

  for (const tool of tools) ctx.registerTool({ ...tool, signal });
  return controller;
}
