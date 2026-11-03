import Link from 'next/link';
import {SITE} from '@/config/site';
export const metadata={title:'数据使用说明｜九万里留学库'};
export default function Page(){return <main className="design-container py-12"><div className="mx-auto max-w-3xl"><p className="eyebrow">九万里留学库</p><h1 className="mt-2 text-3xl font-bold">数据使用说明</h1><p className="mt-3 text-sm text-slate-500">更新日期：2026-11-03</p>
 <section className="mt-7 space-y-6 rounded-2xl border bg-white p-6 text-sm leading-7 text-slate-600">
  <div><h2 className="mb-2 text-lg font-semibold text-slate-900">本机清单与备份</h2><p>院校查询不要求提供手机号或身份信息。收藏、对比、学生清单和顾问备注保存在当前浏览器；当前未提供账户云同步。清理浏览器数据或更换设备前，可以导出完整备份，在新设备的“我的清单”页面导入。</p><p className="mt-2">完整备份包含学生代号及顾问备注，请自行保管。导入在浏览器内读取文件，原有清单保留，重复编号的学生清单另存为新清单。</p></div>
  <div><h2 className="mb-2 text-lg font-semibold text-slate-900">专业分享与打印</h2><p>“复制专业分享链接”和专业对比链接仅包含公开项目编号，不携带学生代号、方案名称或顾问备注。分享页读取当时已发布的项目资料。打印选校方案时，只有你主动勾选，才会把本机顾问备注加入打印内容。</p></div>
  <div><h2 className="mb-2 text-lg font-semibold text-slate-900">联系顾问</h2><p>咨询摘要只整理所选专业的公开信息。网站可打开你的邮件应用并准备草稿，由你检查、编辑和发送；网站不会自动发出咨询。建议使用学生代号，不填写与咨询无关的证件号或完整住址。</p></div>
  <div><h2 className="mb-2 text-lg font-semibold text-slate-900">AI与账户功能</h2><p>AI文书生成、AI面试评分及账户服务目前尚未开放，生产接口保持关闭。开放前会另行说明服务商、资料用途及账户使用方式。</p></div>
  <div><h2 className="mb-2 text-lg font-semibold text-slate-900">问题反馈</h2><a className="break-all text-blue-700 underline" href={'mailto:'+SITE.email}>{SITE.email}</a></div>
 </section><div className="mt-6 flex flex-wrap gap-3"><Link className="ui-primary" href="/favorites">管理清单与备份</Link><Link className="ui-secondary" href="/contact">联系顾问</Link></div></div></main>;}
