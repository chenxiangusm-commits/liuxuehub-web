"use client";

import { getQSRank, getQSYear, getQSLabel, getQSSource } from "@/lib/qs-ranking";


import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/storage";
import { getSchoolLogo } from "@/lib/schoolLogos";
import { useState, useEffect } from "react";
import {
  formatFee,
  formatIntake,
  formatDuration,
  formatCollegeDisplayName,
  formatEducationLevel,
  formatIELTS,
  formatTOEFL
} from "@/lib/displayFormat";
import AdmissionsFacts from "@/components/AdmissionsFacts";
import HKUApplicationGuide from "@/components/HKUApplicationGuide";
import AuApplicantProfile from "@/components/AuApplicantProfile";
import type { AuApplicantProfile as AuProfile } from "@/lib/au-applicant-profile";
import HkApplicantProfile from "@/components/HkApplicantProfile";
import { admissionsState } from "@/lib/admissions-state";
import Icon from "@/components/ui/Icon";
import {localizedUnits} from "@/lib/presentation";
import CompareButton from "@/components/CompareButton";
import HkApplicantMatch from "@/components/HkApplicantMatch";
import type { HkApplicantProfile as HkProfile } from "@/lib/hk-applicant-profile";

interface ProgramDetailClientProps {
  program: Program;
  auProfile?: AuProfile;
  hkProfile?: HkProfile;
  sgProfile?: HkProfile;
  ukProfile?: HkProfile;
}

// 获取通用就业方向
const getGeneralCareers = (majorCn: string, majorEn: string): string[] => {
  const text = `${majorCn} ${majorEn}`.toLowerCase();

  if (text.includes('计算机') || text.includes('computer') || text.includes('software')) {
    return ['软件开发工程师', '数据分析师', '系统架构师', '人工智能工程师', '产品经理'];
  }

  if (text.includes('金融') || text.includes('finance')) {
    return ['投资分析师', '金融顾问', '风险管理', '资产管理', '投资银行'];
  }

  if (text.includes('商业') || text.includes('business') || text.includes('management')) {
    return ['企业管理', '市场营销', '人力资源', '运营管理', '咨询顾问'];
  }

  if (text.includes('工程') || text.includes('engineering')) {
    return ['工程师', '项目管理', '技术咨询', '研发工程师', '产品设计'];
  }

  if (text.includes('数据') || text.includes('data') || text.includes('analytics')) {
    return ['数据分析师', '商业分析师', '数据科学家', '机器学习工程师', '量化分析师'];
  }

  if (text.includes('传媒') || text.includes('media') || text.includes('communication')) {
    return ['媒体策划', '品牌营销', '公共关系', '内容创作', '数字营销'];
  }

  if (text.includes('教育') || text.includes('education')) {
    return ['教育管理', '课程设计', '学术研究', '教育培训', '教育咨询'];
  }

  if (text.includes('法律') || text.includes('law')) {
    return ['律师', '法律顾问', '合规管理', '政策分析', '知识产权'];
  }

  return ['相关行业工作', '继续深造', '创业', '专业服务', '咨询顾问'];
};

export default function ProgramDetailClient({ program, auProfile, hkProfile, sgProfile, ukProfile }: ProgramDetailClientProps) {
  const isHongKong = program.region_cn === "中国香港";
  const isAustralia = program.region_cn === "澳大利亚";
  const isAuMasters = isAustralia && program.education_level === "postgraduate";
  const isSingapore = program.region_cn === "新加坡";
  const isSgPostgraduate = isSingapore && program.education_level === "postgraduate";
  const isSgJd = isSgPostgraduate && (/^JD$/i.test(program.degree || "") || /juris doctor/i.test(program.major_en || ""));
  const isUnitedKingdom = program.region_cn === "英国";
  const applicationState = admissionsState(program);
  const matchAnchor = isHongKong ? "#hk-match" : isSingapore ? "#sg-match" : isUnitedKingdom ? "#uk-match" : "#au-match";
  const caseProfile = isHongKong ? hkProfile : isSingapore ? sgProfile : isUnitedKingdom ? ukProfile : auProfile?.caseProfile;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(program.id));
  }, [program.id]);

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(program.id);
    } else {
      addFavorite(program.id);
    }
    setFavorited(!favorited);
  };

  const auditedScope = true;
  const feeInfo = program.admissions_preview ? { primary: program.admissions_preview.feeShort, secondary: program.admissions_preview.feeNote } : auditedScope ? { primary: program.fee || "尚待核对", secondary: "" } : formatFee(program.fee);
  const region = program.region_cn || '';

  const careers = program.careers && program.careers.length > 0 ? program.careers : getGeneralCareers(program.major_cn || '', program.major_en || '');

  // 分组课程
  const curriculum = program.curriculum || [];
  // 检查是否有课程数据
  const hasCurriculumData = curriculum.length > 0 &&
    !curriculum.every(c => !c || c.trim() === '' || c.toLowerCase().includes('course list') || c.toLowerCase().includes('curriculum'));

  // 获取课程显示名称，优先显示中文
  const getCourseDisplayName = (course: string): string => {
    if (!course) return '';

    // 移除后台字段文案
    const cleanCourse = course
      .replace(/Course List/i, '')
      .replace(/Curriculum/i, '')
      .trim();

    // 如果包含 | 分隔符，优先取中文部分
    if (cleanCourse.includes('|')) {
      const parts = cleanCourse.split('|').map(p => p.trim());
      // 查找中文部分（包含中文字符）
      const chinesePart = parts.find(p => /[\u4e00-\u9fa5]/.test(p));
      if (chinesePart) {
        return chinesePart;
      }
      // 如果没有中文，返回第一个非空部分
      return parts[0] || cleanCourse;
    }

    return cleanCourse;
  };



  const languageRequirement = auditedScope ? (program.language_requirement || [program.ielts, program.toefl].filter(Boolean).join('；') || '尚待核对') : program.ielts && formatIELTS(program.ielts) ? formatIELTS(program.ielts) :
                   program.toefl && formatTOEFL(program.toefl) ? formatTOEFL(program.toefl) : "官网暂未明确";
  const duration = formatDuration(program.duration) || "官网暂未明确";
  const intake = program.admissions_preview?.intakeLabel || formatIntake(program.intake) || "官网暂未明确";

  return (
    <div className="detail-page">
      <section className="detail-hero" aria-labelledby="program-name">
        <div className="flex items-center justify-between gap-4"><Link href={`/schools/${program.school_code}`} className="flex min-w-0 items-center gap-3"><span className="school-logo-small"><Image src={getSchoolLogo(program.school_code)} alt="" width={40} height={40}/></span><span><strong className="block text-sm text-slate-800">{program.school_name}</strong><span className="text-xs text-slate-500">{region} · {formatCollegeDisplayName(program.college)||formatEducationLevel(program.education_level)}</span></span></Link><button className={`icon-button ${favorited?'text-rose-600':'text-slate-500'}`} aria-label={favorited?'取消收藏专业':'收藏专业'} aria-pressed={favorited} onClick={handleToggleFavorite}><Icon name="heart" fill={favorited?'currentColor':'none'}/></button></div>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><h1 id="program-name">{program.major_cn||program.major_en||'官网暂未明确'}</h1><p className="mt-2 text-base text-slate-500">{program.major_en}</p></div><div className="flex flex-wrap gap-2"><span className="meta-chip">{formatEducationLevel(program.education_level)}</span>{getQSRank(program)>0&&<a className="meta-chip" href={getQSSource(program)} target="_blank" rel="noopener noreferrer">QS {getQSYear(program)} · {getQSLabel(program)}</a>}</div></div>
        <p className="mt-4 text-xs leading-6 text-slate-600">{program.admissions_preview?`${program.admissions_preview.cycle} · ${program.admissions_preview.mode} · ${program.admissions_preview.applicantScope}`:'历史资料 · 当前招生批次待确认'}</p>
        <dl className="detail-summary"><div className="summary-tile"><dt>国际生学费</dt><dd>{localizedUnits(feeInfo.primary)}</dd></div><div className="summary-tile"><dt>学制</dt><dd>{duration}</dd></div><div className="summary-tile"><dt>语言条件</dt><dd>{program.admissions_preview?.languageShort||languageRequirement}</dd><a href="#admissions-facts-title" className="mt-2 inline-block text-xs text-blue-700">完整语言要求 ↓</a></div><div className="summary-tile"><dt>入学时间</dt><dd>{intake}</dd></div></dl>
        {feeInfo.secondary&&<p className="mt-3 text-xs leading-6 text-slate-600">学费说明：{feeInfo.secondary}</p>}
        <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 md:flex-row"><div className="min-w-0 flex-1"><p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900"><Icon name="clock" width="17" height="17"/>申请截止时间 <span className="status-chip">{applicationState.label}</span></p><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{program.admissions_preview?.deadlineSummary||program.deadline||'官网暂未明确'}</p><a href="#admissions-facts-title" className="mt-2 inline-block text-xs text-blue-700">全部轮次与官网来源 ↓</a></div><div className="flex shrink-0 flex-wrap items-start gap-2"><a href="#official-entry-title" className="ui-primary">查看录取要求 <Icon name="arrow" width="16" height="16"/></a><CompareButton id={program.id}/></div></div>
      </section>
      <nav aria-label="专业详情导航" className="detail-subnav"><a href="#official-entry-title">官方录取要求</a><a href="#admissions-facts-title">学费 · 语言 · 轮次</a><a href="#course-content">课程与就业</a><a href={matchAnchor}>我的申请匹配</a><a href="#program-reference">申请参考</a></nav>
      <div className="detail-columns"><div className="detail-content">
        {program.admissions_preview?<HKUApplicationGuide info={program.admissions_preview}/>:<section className="detail-section" aria-labelledby="official-entry-title"><h2 id="official-entry-title">官方录取要求与申请注意事项</h2><p className="whitespace-pre-line text-sm leading-7 text-slate-700">{program.req_detail||'当前批次完整要求未明确，请查看官网。'}</p>{program.official_url&&<a href={program.official_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-blue-700 underline">查看项目官网 ↗</a>}</section>}
        <AdmissionsFacts program={program}/>
        <section className="detail-section" aria-labelledby="course-content"><h2 id="course-content">课程设置</h2><p className="mb-4 text-xs leading-6 text-slate-500">课程介绍与就业方向供理解项目参考，当前招生要求及来源请见上方官方要求。</p>{hasCurriculumData?<ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{curriculum.map((course,idx)=><li key={idx} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"/>{getCourseDisplayName(course)}</li>)}</ul>:<p className="text-sm text-slate-500">课程设置以学校官网最新信息为准</p>}<div className="mt-6 border-t border-slate-100 pt-5"><h3 className="mb-3 text-base font-semibold">就业方向参考</h3><div className="flex flex-wrap gap-2">{careers.map((item,idx)=><span key={idx} className="meta-chip">{item}</span>)}</div></div></section>
        {program.education_level==='postgraduate'?<HkApplicantMatch profile={caseProfile} admissions={program.admissions_preview} region={program.region_cn} anchorId={matchAnchor.slice(1)} unavailableReason={applicationState.code==='archived'?applicationState.detail:isSgJd?'JD 请按课程学历、考试及面试要求单独判断。':isAuMasters&&auProfile?.inactive?auProfile.summary:undefined}/>:<section id={matchAnchor.slice(1)} className="detail-section"><h2>本科申请参考</h2><p className="text-sm">请对照本人学历、考试及语言要求。</p></section>}
        <section className="detail-section"><h2>准备下一步申请</h2><div className="flex flex-wrap gap-3"><Link href={`/references?program=${encodeURIComponent(program.id)}`} className="ui-secondary">查看行业申请参考</Link><Link href={`/contact?ids=${encodeURIComponent(program.id)}`} className="ui-primary">与顾问沟通这个项目</Link><Link href={`/plan?ids=${encodeURIComponent(program.id)}`} className="ui-secondary">生成选校方案</Link><Link href={`/ai/interview?school=${encodeURIComponent(program.school_name||'')}&program=${encodeURIComponent(program.major_cn||program.major_en||'')}`} className="ui-secondary">面试工具状态</Link><Link href="/ai/resume" className="ui-secondary">文书工具状态</Link><Link href="/favorites" className="ui-secondary">整理我的清单</Link></div></section>
      </div><aside id="program-reference" className="reference-panel"><p className="eyebrow">选择参考</p><h2 className="mb-4 mt-1 text-lg font-semibold text-slate-900">我的背景适合吗？</h2>{program.education_level==='undergraduate'?<p className="text-sm text-slate-600">按本人学历、考试与课程要求判断本科申请条件。</p>:isSgJd?<p className="text-sm text-slate-600">JD 课程需按学历、考试及面试要求单独判断。</p>:isAustralia&&auProfile?<AuApplicantProfile profile={auProfile} compact/>:<HkApplicantProfile profile={caseProfile} compact/>}<a href={matchAnchor} className="ui-primary mt-5 w-full">对照我的申请背景 <Icon name="arrow" width="16" height="16"/></a>{program.official_url&&<a href={program.official_url} target="_blank" rel="noopener noreferrer" className="ui-secondary mt-2 w-full">访问项目官网 ↗</a>}<div className="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">{applicationState.nextDate&&<p>下一截止日 <strong className="ml-1 font-medium tabular-nums text-slate-700">{applicationState.nextDate}</strong></p>}{program.admissions_preview?.updatedOn&&<p>资料日期 {program.admissions_preview.updatedOn}</p>}<p>申请要求、费用口径与批次分别查看。</p></div></aside></div>
    </div>
  );
}
