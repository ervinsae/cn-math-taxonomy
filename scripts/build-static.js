#!/usr/bin/env node
/* 无第三方依赖：只发布页面、静态资源、运行数据与许可证。 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const output = path.join(root, 'dist');
const files = [
  'index.html', 'sw.js', 'manifest.webmanifest', 'LICENSE',
  'data/topics.json', 'data/dependencies.json', 'data/questions.json',
  'data/cn-curriculum-standards.json', 'data/id-aliases.json'
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
}
for (const dir of ['assets', 'explore', 'diagnose', 'children']) {
  fs.cpSync(path.join(root, dir), path.join(output, dir), {
    recursive: true,
    filter: (source) => !source.endsWith('.md')
  });
}

const commit = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({
  commit,
  repository: 'https://github.com/ervinsae/cn-math-taxonomy'
}, null, 2) + '\n');
console.log('Static site ready: dist/ (commit ' + commit + ')');
