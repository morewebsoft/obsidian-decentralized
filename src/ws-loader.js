'use strict';

/**
 * Desktop-only lazy entry point for the `ws` package.
 *
 * `await import('ws')` looks like it defers, but rollup has to build a module namespace for a
 * dynamic import and — with inlineDynamicImports, which the single-file plugin layout forces —
 * it evaluates that namespace at bundle load. ws then pulls in `crypto`, `stream` and friends
 * on a runtime that has none, so the whole plugin failed to load on Obsidian mobile.
 *
 * This file is CommonJS on purpose. @rollup/plugin-commonjs is configured with strictRequires
 * for it, so the require() below is left where it stands and compiles to a lazy factory call
 * that only runs when loadWs() is invoked — which DirectIpServer does on desktop alone.
 */
exports.loadWs = function loadWs() {
  return require('ws');
};
