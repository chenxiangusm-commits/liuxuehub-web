# 九万里院校库验收版

目标域名：www.liuxueku.cn。当前阶段仅部署受 Vercel 登录保护的验收预览，不切换正式域名。

发布数据以 release-data 目录中的单个不可变文件为准，保留原始项目 ID、历史信息、招生年份和缺失字段提示。此包的发布不等于所有招生事实均已复核。

Vercel Preview 环境需要设置：

- LIUXUEHUB_SITE_URL=https://www.liuxueku.cn
- LIUXUEHUB_RELEASE_FILE=release-data/release-20261030-ee17349efdaa.json
- LIUXUEHUB_RELEASE_SHA256=ee17349efdaa3434ba7cdc84980d10fa1f08c7525ac8254b18c029b2d534c8e2
- LIUXUEHUB_RELEASE_PREVIEW_SHA256=ee17349efdaa3434ba7cdc84980d10fa1f08c7525ac8254b18c029b2d534c8e2
- AI_RESUME_USE_MOCK=false

VERCEL_ENV 由 Vercel 自动提供。预览批准只对 preview 环境有效。Production 环境没有配置批准哈希，因此不能意外发布。不要将 LIUXUEHUB_REHEARSAL=local-only 用于云端。

首版提供院校与专业查询、筛选、浏览器本地收藏、对比和清单。短信登录、账户同步与付费 AI 接口尚未开放。

构建：npm ci 后执行 npm run build。使用 Node.js 22。Next.js 仍为 15 系列，已升级安全补丁；PostCSS 覆盖为兼容的 8 系列安全版本。

正式发布前应确认适合商业用途的托管套餐、验收结果和域名解析。代码和数据必须作为一个完整部署发布或回滚，不应逐个替换线上 JSON 文件。
