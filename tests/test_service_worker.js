#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');

async function intercepted(scope, file, mode) {
  const handlers = {};
  const handled = [];
  const self = {
    registration: { scope }, location: { origin: new URL(scope).origin },
    addEventListener: (type, handler) => { handlers[type] = handler; }
  };
  vm.runInNewContext(source, {
    self, URL, Request,
    caches: { match: async () => new Response('old cached content') },
    fetch: async () => new Response('fresh network content'),
    setTimeout: () => 0
  });
  handlers.fetch({
    request: { method: 'GET', url: new URL(file, scope).href, mode: mode || 'cors' },
    respondWith: (response) => { handled.push(response); }
  });
  await Promise.all(handled);
  return handled.length > 0;
}

(async () => {
  for (const scope of ['https://example.vercel.app/', 'https://example.com/learning/']) {
    assert.equal(await intercepted(scope, 'version.json'), false, 'version metadata must bypass CacheStorage');
    assert.equal(await intercepted(scope, 'version.json', 'navigate'), false, 'version navigation must use the network');
    assert.equal(await intercepted(scope, 'sw.js'), false, 'service worker script must bypass CacheStorage');
    assert.equal(await intercepted(scope, 'data/topics.json'), true, 'learning data remains available for offline caching');
  }
  console.log('Service worker: fresh version metadata and root/subdirectory caching passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
