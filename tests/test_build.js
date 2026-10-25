#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.join(__dirname, '..');
const output = path.join(root, 'dist');
execFileSync(process.execPath, [path.join(root, 'scripts/build-static.js')], { cwd: root, stdio: 'pipe' });

const runtimeFiles = [
  'index.html', 'explore/index.html', 'diagnose/index.html',
  'children/index.html', 'children/history.html', 'sw.js', 'manifest.webmanifest', 'LICENSE',
  'assets/vendor/LICENSE-cytoscape.txt', 'assets/vendor/LICENSE-qrcode-generator.txt',
  'assets/icons/icon-192.png', 'diagnose/engine.js', 'diagnose/share.js',
  'data/topics.json', 'data/dependencies.json', 'data/questions.json',
  'data/cn-curriculum-standards.json', 'data/id-aliases.json'
];
for (const file of runtimeFiles) {
  assert.deepEqual(fs.readFileSync(path.join(output, file)), fs.readFileSync(path.join(root, file)), file);
}
for (const file of ['.git', 'scripts', 'tests', 'docs', 'screenshots', 'diagnose/README.md', 'data/_qbatches', 'data/verification_report.json']) {
  assert.equal(fs.existsSync(path.join(output, file)), false, file + ' must not be published');
}
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
assert.equal(config.framework, null);
assert.equal(config.installCommand, '');
assert.equal(config.buildCommand, 'node scripts/build-static.js');
assert.equal(config.outputDirectory, 'dist');
const version = JSON.parse(fs.readFileSync(path.join(output, 'version.json'), 'utf8'));
assert.match(version.commit, /^[0-9a-f]{40}$/);
assert.equal(version.repository, 'https://github.com/ervinsae/cn-math-taxonomy');
console.log('Static build: runtime files, licenses, exclusions and version metadata passed');
