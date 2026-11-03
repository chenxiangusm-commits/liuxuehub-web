# 九万里留学库发布说明

正式项目：liuxueku，域名 https://www.liuxueku.cn。旧 liuxuehub-web 项目独立保留，不推送 main。

本次为用户2026-11-03授权的平台改进。招生资料沿用已批准不可变发布包：
release-data/release-20261030-ee17349efdaa.json
SHA-256: ee17349efdaa3434ba7cdc84980d10fa1f08c7525ac8254b18c029b2d534c8e2

Production需要LIUXUEHUB_RELEASE_FILE、LIUXUEHUB_RELEASE_SHA256及对应LIUXUEHUB_RELEASE_APPROVED_SHA256。
Preview使用LIUXUEHUB_RELEASE_PREVIEW_SHA256，仅适用于Vercel Preview。不可取消发布校验。

先进行独立预览、功能验证和完整性检查，再构建Production并绑定正式域名。每次发布保留前一Ready部署及源代码归档用于回滚。

院校与专业资料、行业申请统计保持原版本，不写入正式院校JSON或改变历史ID。行业参考仅展示既有聚合统计，不发布第三方学生案例原文。
清单、备份、学生代号和顾问备注保存在本机；公开分享仅包含专业ID。云同步、账户及付费AI仍保持关闭。
联系邮箱沿用用户确认的 contact@liuxuehub.cn；网页只打开邮件草稿，不自动发送。

构建：npm ci，npm run build。Node22.x，Next15。报告保存在上级目录。
