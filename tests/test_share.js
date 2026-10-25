#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../diagnose/share.js'), 'utf8');
const cases = [
  ['https://cn-math-taxonomy.vercel.app/diagnose/share.js', 'https://cn-math-taxonomy.vercel.app/?from=share'],
  ['https://cn-math-taxonomy-branch.vercel.app/diagnose/share.js', 'https://cn-math-taxonomy-branch.vercel.app/?from=share'],
  ['http://localhost:8000/diagnose/share.js', 'http://localhost:8000/?from=share'],
  ['https://example.com/learning/diagnose/share.js?v=2', 'https://example.com/learning/?from=share']
];
for (const [scriptUrl, expected] of cases) {
  const window = {
    document: { currentScript: { src: scriptUrl } },
    location: { href: new URL('./?subject=physics&target=cnp_001#result', scriptUrl).href }
  };
  vm.runInNewContext(source, { window, URL });
  assert.equal(window.ShareCard.url, expected, scriptUrl);
  assert.equal(window.ShareCard.width, 1080);
  assert.equal(window.ShareCard.height, 1920);
}
console.log('Share URL: 4 deployment origins/paths passed');
