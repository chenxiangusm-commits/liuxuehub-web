'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="design-container py-16"><h1 className="text-3xl font-bold">页面暂时未能加载</h1><p className="mt-4 text-sm leading-7 text-slate-600">请重试，或先浏览其他院校与专业。浏览器中的收藏和学生清单仍保留。</p><div className="mt-7 flex flex-wrap gap-3"><button className="ui-primary" onClick={reset}>重新加载</button><Link className="ui-secondary" href="/programs">返回专业库</Link><Link className="ui-secondary" href="/contact">反馈问题</Link></div></main>;}
