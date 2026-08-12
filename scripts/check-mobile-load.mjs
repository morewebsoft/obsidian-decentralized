/**
 * Loads the built main.js the way Obsidian mobile does: a `require` that resolves 'obsidian'
 * and nothing else, because the mobile runtime has no Node.
 *
 * Bundling `ws` for Offline Host mode made rollup hoist `require("events")` and friends to the
 * first line of the bundle, so the plugin threw MODULE_NOT_FOUND before onload ever ran and
 * silently refused to enable on phones while working fine on desktop. Nothing in the test
 * suite covers the shipped artifact, so this check does.
 *
 * Run after a build: npm run build && npm run test:mobile-load
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const bundlePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'main.js');

let code;
try {
  code = readFileSync(bundlePath, 'utf8');
} catch (err) {
  console.error(`Could not read ${bundlePath} — run \`npm run build\` first.`);
  process.exit(1);
}

// Obsidian's exports are only used as constructors/namespaces at load time, so a permissive
// stub is enough to get the module body to run.
const stub = class { };
const obsidian = new Proxy({}, {
  get(_target, prop) {
    if (prop === 'Platform') return { isMobile: true, isDesktop: false, isDesktopApp: false };
    if (prop === '__esModule') return false;
    return stub;
  },
});

const mobileRequire = (id) => {
  if (id === 'obsidian') return obsidian;
  const err = new Error(`Cannot find module '${id}'`);
  err.code = 'MODULE_NOT_FOUND';
  throw err;
};

const module_ = { exports: {} };
try {
  new Function('require', 'module', 'exports', code)(mobileRequire, module_, module_.exports);
} catch (err) {
  console.error('main.js fails to load under a mobile-shaped runtime:');
  console.error(`  ${err.code ? err.code + ': ' : ''}${err.message}`);
  console.error('The plugin will refuse to enable on iOS/Android. Node builtins must not be');
  console.error('required at module scope — see the lazy-node-requires plugin in rollup.config.mjs.');
  process.exit(1);
}

if (typeof module_.exports !== 'function') {
  console.error(`main.js loaded but exported ${typeof module_.exports}, expected the plugin class.`);
  process.exit(1);
}

console.log('main.js loads cleanly under a mobile-shaped runtime.');
