import { publicMetadata } from '@/lib/public-metadata';
export const metadata = publicMetadata('/references', '行业申请参考｜九万里留学库', '按本科背景和成绩制查看行业公开案例的聚合参考。');
import Link from 'next/link';
import {referenceSchools} from '@/lib/reference.server';
import {getProgramIndex} from '@/lib/data.server';
import {programProfile} from '@/lib/catalog.server';
import HkApplicantProfile from '@/components/HkApplicantProfile';
import ReferenceFilters from '@/components/ReferenceFilters';

export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=await searchParams;const schools=await referenceSchools();const region=typeof params.region==='string'?params.region:'';
 const visible=schools.filter(s=>!region||s.region===region);const code=typeof params.school==='string'?params.school:'';
 const id=typeof params.program==='string'?params.program:'';
 const program=id?(await getProgramIndex()).find(p=>p.id===id):undefined;
 const requested=Boolean(id||code);
 const selected=program?schools.find(s=>s.code===program.school_code):code?visible.find(s=>s.code===code):id?undefined:(visible.find(s=>s.profile.bands.length>0)||visible[0]);
 const profile=program?programProfile(program):selected?.profile;
 return <main className="design-container py-10"><p className="eyebrow">九万里留学库 · 选校定位</p><h1 className="mt-2 text-3xl font-bold">行业申请参考</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">查看与你相近本科背景的成绩分布，再进入具体项目核对学历、先修课、语言和招生安排。</p><div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-600">来源为行业公开录取背景的聚合统计，{schools.length}所院校有已整理的参考资料。这里不是九万里自有成功案例库，也不展示个人学生经历或录取概率。</div>
 <ReferenceFilters key={`${region}:${selected?.code||''}`} schools={schools.map(({code,name,region})=>({code,name,region}))} initialRegion={program?.region_cn||region} initialSchool={selected?.code||''}/>
 {requested&&!program&&!selected&&<p role="status" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm leading-7">没有找到这所学校或专业在所选范围内的参考资料。请重新选择学校；这里不会自动替换成另一所学校的样本。</p>}
 <section className="rounded-2xl border bg-white p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{program?program.school_name+' · '+program.major_cn:selected?.name||'暂无对应样本'}</h2>{program&&<p className="mt-2 text-xs text-slate-500">按卡片标注区分本专业、本校同类专业或全校样本，不把同校其他专业视为本专业门槛。</p>}</div>{program?<Link className="ui-secondary" href={'/programs/'+program.id}>返回专业详情</Link>:selected&&<Link className="ui-secondary" href={'/schools/'+selected.code}>查看学校与专业</Link>}</div><HkApplicantProfile key={program?.id||selected?.code||'none'} profile={profile} compact={Boolean(program)}/></section>
 <section className="mt-6 rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">如何使用这份参考</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-600"><li>选择与你一致的本科背景与原成绩制，不把4分制、5分制直接折算成百分制。</li><li>先看卡片的样本数与适用范围，再看建议区间；仅成功案例不足以计算录取概率。</li><li>语言分数与录取者经历不等于课程的官方门槛，具体申请条件以对应批次的大学官网要求为准。</li><li>样本不足时保持未知，不补造分数、案例或申请结果。</li></ol><div className="mt-6 flex flex-wrap gap-3"><Link className="ui-primary" href="/ai/school-match">对照我的成绩背景</Link><Link className="ui-secondary" href="/contact">与顾问沟通选校方向</Link></div></section></main>;
}
