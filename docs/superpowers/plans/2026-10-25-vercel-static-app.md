# Vercel 静态应用适配计划

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** 将现有三科静态应用适配到用户 Vercel，并验证完整使用流程。

**Architecture:** 保留原生 HTML/CSS/JavaScript、JSON 数据、诊断引擎和本机 localStorage。以 Node 标准库生成只含运行文件的 `dist/`，Vercel 托管静态输出。

**Tech Stack:** 原生浏览器 API、Cytoscape/dagre、Node/Python 标准库。

**Spec:** 用户在本任务中授权“按你建议做”；主线程明确保留三科、现有界面和本机保存，不新增数据库、账号、收费或商业功能。

## Global Constraints

- 保留原作者署名、CC BY-NC 4.0 许可和 AI 数据未经教师审核的声明。
- 不新增 OAuth grant、token、付费项目或无关项目配置。
- 代码保存在任务分支，不合并；如开 PR，必须为 draft。
- Git 导入认证失败未解决前，不绕过认证；完成独立代码和本地验证。

## Review Focus

- 预览域名、localhost、子目录和带查询参数的诊断页面，分享二维码均指向当前站点。
- 发布包保留所有页面、数据和第三方许可，排除截图、生成批次与开发文件。
- 375px 手机、768/1024px 平板上的搜索、图谱、答题和分享弹层可使用且无横向溢出。
- 旧哈希、三科学科参数、诊断目标深层链接和刷新恢复保持有效。
- 线上版本必须能用构建元数据核对代码提交，认证阻塞应报告具体失败步骤。

## Task 1: 站点来源与署名

- [x] 写并运行分享来源回归测试，确认旧硬编码地址导致失败。
- [x] 从分享脚本的当前 URL 计算站点根路径；为五个页面补全原作者、许可和数据声明。
- [x] 更新 service worker 版本；运行分享测试。

## Task 2: 静态发布包

- [x] 写并运行发布包测试，确认尚无构建入口导致失败。
- [x] 添加 `scripts/build-static.js`、`vercel.json`、构建输出忽略及部署说明。
- [x] 发布包包含五个运行数据文件、页面、资源、许可证和 `version.json`，且不包含开发文件。
- [x] 运行打包测试、数据校验、题目核验及诊断引擎测试。

## Task 3: 浏览器验证与交付

- [x] 让现有 Chrome 冒烟脚本支持发布目录和独立截图目录；更新分享 URL 断言。
- [x] 运行既有浏览器流程，并补充图谱搜索筛选、物理、档案和平板检查。
- [ ] 核查最终差异，保存任务分支；若提交 PR，保持 draft。
- [ ] 使用现有 Vercel 授权部署；认证失败则报告最小用户动作，不自行新建授权。
- [ ] 部署成功后核对线上 URL、版本及主要流程；否则明确线上验证未完成。

## Progress

- Baseline: `python3 scripts/validate.py` passed; `node tests/test_engine.js` 88 passed, 0 failed.
- Vercel GitHub namespaces query previously failed with 401 `github_response_error`; account and project reads succeeded.
- Tasks 1–2: share URL test 4/4 passed after RED; build test passed after RED; 6723 questions verified with mismatch 0, 6191 auto-verified and 532 unverifiable (the latter require human/self review). Generated verification report saved in `/tmp/cnm-vercel-qa/` and restored in source to avoid unrelated data changes.
- Browser run: 467/469 checks passed with zero browser/network errors. Ruling: query “配方法” also matches descriptions, so the search assertion must check the expected result and a reduced list, not exactly one result. Product behavior stays unchanged.
- Local browser server initially failed because the sandbox denied binding localhost; the same test ran after scoped execution approval with a fresh temporary Chrome profile.
- Browser verification: 469/469 checks passed, zero browser/network errors; screenshots and machine-readable report in `/tmp/cnm-vercel-qa/`. Offline browser interaction is not yet claimed.
- Independent review found no Critical/Important core-app issue. Ruling: treat stale `version.json` in CacheStorage as important to the required deployment provenance check; fix it with a RED→GREEN worker regression test, and resolve `sw.js` relative to its scope for subdirectory compatibility. No product feature was added.
